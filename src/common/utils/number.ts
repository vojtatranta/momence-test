import { DEFAULT_LANGUAGE, DEFAULT_LOCATION } from '../constants';

export const normalizeDecimalInput = (mixedValue: string): string | number | undefined => {
	const originalValue = mixedValue.replace(',', '.');
	if (originalValue === '') {
		return originalValue;
	}

	if (!originalValue || !originalValue.match(/^(-)?\d{1,}(\.\d{0,10})?$/)) {
		return undefined;
	}

	return originalValue;
};

export const formatMoney = (amount: string | number, currency: string) => {
	const moneyFormatter = new Intl.NumberFormat(`${DEFAULT_LANGUAGE}-${DEFAULT_LOCATION}`, {
		style: 'currency',
		currency: currency,
	});

	return moneyFormatter.format(Number(amount));
};
