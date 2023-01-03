import { type Response } from 'express';

import { dateToDateSegments } from '../common/utils/date-utils';
import { ApiErrorResponse, DEFAULT_API_ERROR, DEFAULT_ERROR_CODE, KnownApiErrors } from '../common/api-types';

export class ApiError extends Error {
	public code: KnownApiErrors;
	public status: number | null;

	constructor(code: KnownApiErrors, message: string, status?: number) {
		super();

		this.code = code;
		this.message = message;
		this.status = status || null;
	}
}

export const createCNBUrl = (cnbFormattedDate: string) => {
	return `https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt?date=${cnbFormattedDate}`;
};

export const errorToObject = (error: Error | ApiError): ApiErrorResponse => {
	const code = 'code' in error ? error.code : DEFAULT_ERROR_CODE;
	const status = 'status' in error ? error.status || DEFAULT_API_ERROR : DEFAULT_API_ERROR;

	return {
		code,
		status,
		message: error.message,
	};
};

export const apiErrorHandler = (res: Response) => (error: Error) => {
	const errorApiObject = errorToObject(error);
	res.status(errorApiObject.status);
	res.json(errorApiObject);
};

export const dateToCNBFormat = (dateString: string): { date: string; cnbFormat: string } => {
	const parsedDate = new Date(dateString);

	if (parsedDate.toString().toLocaleLowerCase() === 'invalid date') {
		throw new ApiError(KnownApiErrors['invalid-date'], `Invalid date ${dateString}. The format should be YYYY-MM-DD!`);
	}

	const { day, month, year } = dateToDateSegments(parsedDate);

	return {
		date: `${year}-${month}-${day}`,
		cnbFormat: `${day}.${month}.${year}`,
	};
};
