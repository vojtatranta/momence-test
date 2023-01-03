import { KnownParsingErrors } from './utils/cnb-parser';

export const API_PORT = 4444;

export type CNBRatesObject = {
	date: string;
	rates: CountryExchangeRate[];
};

export enum CNBHeaders {
	country = 'country',
	currency = 'currency',
	amount = 'amount',
	code = 'code',
	rate = 'rate',
}

export type CountryExchangeRate = {
	[CNBHeaders.country]: string;
	[CNBHeaders.currency]: string;
	[CNBHeaders.amount]: number;
	[CNBHeaders.code]: string;
	[CNBHeaders.rate]: number;
};

export const NumberKeys = {
	[CNBHeaders.amount]: true,
	[CNBHeaders.rate]: true,
};

export const createUrlWithBase = (url = '') => {
	const urlAppendix = `${API_PORT}/${url}`.replace('//', '/');
	return `${'http://localhost:'}${urlAppendix}`;
};

export enum KnownApiErrors {
	'invalid-date' = 'invalid-date',
}

export const DEFAULT_API_ERROR = 422;
export const DEFAULT_ERROR_CODE = 'unknown-error';

export type AllKnownApiErrors = KnownApiErrors | KnownParsingErrors;

export type ApiErrorResponse = { code: AllKnownApiErrors | typeof DEFAULT_ERROR_CODE; status: number; message: string };
