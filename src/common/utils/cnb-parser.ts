import { CNBHeaders, CNBRatesObject, CountryExchangeRate, NumberKeys } from '../api-types';

export const formatExchangeRateValue = (value: string, key: CNBHeaders) => {
	if (key in NumberKeys) {
		return Number(String(value).trim());
	}

	return value.trim();
};

export const validateHeaderKey = (maybeKey: string): maybeKey is CNBHeaders => {
	if (maybeKey in CNBHeaders) {
		return true;
	}

	return false;
};

const ExampleExchangeRateObject: CountryExchangeRate = {
	[CNBHeaders.country]: 'Czech Republic',
	[CNBHeaders.currency]: 'Česká koruna',
	[CNBHeaders.amount]: 1,
	[CNBHeaders.code]: 'CZK',
	[CNBHeaders.rate]: 1,
};

export const validateMaybeExchangeRateObject = (maybeExchangeRateObject: {
	[key: string]: string | number;
}): maybeExchangeRateObject is CountryExchangeRate => {
	const entriesOfExample = Object.entries(ExampleExchangeRateObject);

	if (entriesOfExample.length !== Object.keys(maybeExchangeRateObject).length) {
		return false;
	}

	return entriesOfExample.every(
		([key, expectedValue]) =>
			key in maybeExchangeRateObject && typeof maybeExchangeRateObject[key] === typeof expectedValue
	);
};

export enum KnownParsingErrors {
	'incorrect-cnb-header-format' = 'incorrect-cnb-header-format',
	'unknown-header-key' = 'unknown-header-key',
	'incorrect-file-format' = 'incorrect-file-format',
}

export class ParsingError extends Error {
	public code: KnownParsingErrors;
	public message: string;

	constructor(code: KnownParsingErrors, message: string) {
		super();
		(this.code = code), (this.message = message);
	}
}

export class IncorrectHeaderFormatError extends ParsingError {
	constructor() {
		super(
			KnownParsingErrors['incorrect-cnb-header-format'],
			'The headers of the ČNB list contains incomplete values. Some necesarry values are missing.'
		);
	}
}

export class IncorrectFileFormatError extends ParsingError {
	constructor() {
		super(KnownParsingErrors['incorrect-file-format'], 'The ČNB file should first contain a valid date information.');
	}
}

export class UnknownHeaderKeyError extends ParsingError {
	constructor(keyName: string) {
		super(KnownParsingErrors['unknown-header-key'], `Unknown ČNB header key ${keyName}.`);
	}
}

export const exchangeRatesStringToJSObject = (cnbString: string, date: string): CNBRatesObject => {
	const perLine = cnbString.trim().split('\n');
	const firstLine = perLine[0] || '';

	if (firstLine.search('#') === -1) {
		throw new IncorrectFileFormatError();
	}

	// NOTE: first line is date, second are the headers
	const retrievedHeaders = (perLine[1] || '').split('|').map((str) => str.trim().toLowerCase());

	const headersAsKeys = Object.keys(CNBHeaders);
	const validHeaders =
		headersAsKeys.every((header) => retrievedHeaders.indexOf(header) > -1) &&
		retrievedHeaders.length >= headersAsKeys.length;

	if (!validHeaders) {
		throw new IncorrectHeaderFormatError();
	}

	const dataLines = perLine.slice(2, perLine.length);

	const rates = dataLines
		.map((dataString) =>
			dataString.split('|').reduce((valueObject: { [key: string]: string | number }, dataString, index) => {
				const possibleKey = retrievedHeaders[index];
				if (!validateHeaderKey(possibleKey)) {
					throw new UnknownHeaderKeyError(possibleKey);
				}

				return {
					...valueObject,
					[retrievedHeaders[index]]: formatExchangeRateValue(dataString, possibleKey),
				};
			}, {})
		)
		.filter((maybeCorrectObject): maybeCorrectObject is CountryExchangeRate => {
			const validObject = validateMaybeExchangeRateObject(maybeCorrectObject);

			if (!validObject) {
				// NOTE: do some reporting
				return false;
			}

			return true;
		})
		.sort((aData, bData) => (aData.code < bData.code ? -1 : 1));

	return { date, rates };
};
