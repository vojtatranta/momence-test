import { createUrlWithBase } from '../api-types';
import { dateToDateSegments } from './date-utils';

export const CNB_DATA_JSON_SCHEME = '/daily-exchange-rate/:date';

export const dateToUrlFormat = (date: Date) => {
	const { day, month, year } = dateToDateSegments(date);

	return `${year}-${month}-${day}`;
};

export const createCNBDataUrl = (formattedDate: string) => {
	return createUrlWithBase(CNB_DATA_JSON_SCHEME.replace(':date', formattedDate));
};
