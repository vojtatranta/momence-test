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
