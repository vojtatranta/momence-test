import { exchangeRatesStringToJSObject } from './cnb-parser';

describe('CNB data Parser', () => {
	describe('Happy path', () => {
		test('should return a sorted object from valid CNB data', () => {
			const validFixutures = `02 Jan 2023 #1
  Country|Currency|Amount|Code|Rate
  Australia|dollar|1|AUD|15.400
  Brazil|real|1|BRL|4.237
  Bulgaria|lev|1|BGN|12.385
  Canada|dollar|1|CAD|16.668
  China|renminbi|1|CNY|3.281
  Denmark|krone|1|DKK|3.250
  EMU|euro|1|EUR|24.175
  Hongkong|dollar|1|HKD|2.899
  Hungary|forint|100|HUF|6.028
  Iceland|krona|100|ISK|15.936
  IMF|SDR|1|XDR|30.118
  India|rupee|100|INR|27.341
  Indonesia|rupiah|1000|IDR|1.453
  Israel|new shekel|1|ILS|6.447
  Japan|yen|100|JPY|17.317
  Malaysia|ringgit|1|MYR|5.137
  Mexico|peso|1|MXN|1.160
  New Zealand|dollar|1|NZD|14.317
  Norway|krone|1|NOK|2.299
  Philippines|peso|100|PHP|40.541
  Poland|zloty|1|PLN|5.164
  Romania|leu|1|RON|4.894
  Singapore|dollar|1|SGD|16.878
  South Africa|rand|1|ZAR|1.330
  South Korea|won|100|KRW|1.781
  Sweden|krona|1|SEK|2.165
  Switzerland|franc|1|CHF|24.496
  Thailand|baht|100|THB|65.491
  Turkey|lira|1|TRY|1.209
  United Kingdom|pound|1|GBP|27.272
  USA|dollar|1|USD|22.630`;

			const result = exchangeRatesStringToJSObject(validFixutures, '2023-01-02');

			expect(result).toEqual({
				date: '2023-01-02',
				rates: [
					{ country: 'Australia', currency: 'dollar', amount: 1, code: 'AUD', rate: 15.4 },
					{ country: 'Bulgaria', currency: 'lev', amount: 1, code: 'BGN', rate: 12.385 },
					{ country: 'Brazil', currency: 'real', amount: 1, code: 'BRL', rate: 4.237 },
					{ country: 'Canada', currency: 'dollar', amount: 1, code: 'CAD', rate: 16.668 },
					{ country: 'Switzerland', currency: 'franc', amount: 1, code: 'CHF', rate: 24.496 },
					{ country: 'China', currency: 'renminbi', amount: 1, code: 'CNY', rate: 3.281 },
					{ country: 'Denmark', currency: 'krone', amount: 1, code: 'DKK', rate: 3.25 },
					{ country: 'EMU', currency: 'euro', amount: 1, code: 'EUR', rate: 24.175 },
					{ country: 'United Kingdom', currency: 'pound', amount: 1, code: 'GBP', rate: 27.272 },
					{ country: 'Hongkong', currency: 'dollar', amount: 1, code: 'HKD', rate: 2.899 },
					{ country: 'Hungary', currency: 'forint', amount: 100, code: 'HUF', rate: 6.028 },
					{ country: 'Indonesia', currency: 'rupiah', amount: 1000, code: 'IDR', rate: 1.453 },
					{ country: 'Israel', currency: 'new shekel', amount: 1, code: 'ILS', rate: 6.447 },
					{ country: 'India', currency: 'rupee', amount: 100, code: 'INR', rate: 27.341 },
					{ country: 'Iceland', currency: 'krona', amount: 100, code: 'ISK', rate: 15.936 },
					{ country: 'Japan', currency: 'yen', amount: 100, code: 'JPY', rate: 17.317 },
					{ country: 'South Korea', currency: 'won', amount: 100, code: 'KRW', rate: 1.781 },
					{ country: 'Mexico', currency: 'peso', amount: 1, code: 'MXN', rate: 1.16 },
					{ country: 'Malaysia', currency: 'ringgit', amount: 1, code: 'MYR', rate: 5.137 },
					{ country: 'Norway', currency: 'krone', amount: 1, code: 'NOK', rate: 2.299 },
					{ country: 'New Zealand', currency: 'dollar', amount: 1, code: 'NZD', rate: 14.317 },
					{ country: 'Philippines', currency: 'peso', amount: 100, code: 'PHP', rate: 40.541 },
					{ country: 'Poland', currency: 'zloty', amount: 1, code: 'PLN', rate: 5.164 },
					{ country: 'Romania', currency: 'leu', amount: 1, code: 'RON', rate: 4.894 },
					{ country: 'Sweden', currency: 'krona', amount: 1, code: 'SEK', rate: 2.165 },
					{ country: 'Singapore', currency: 'dollar', amount: 1, code: 'SGD', rate: 16.878 },
					{ country: 'Thailand', currency: 'baht', amount: 100, code: 'THB', rate: 65.491 },
					{ country: 'Turkey', currency: 'lira', amount: 1, code: 'TRY', rate: 1.209 },
					{ country: 'USA', currency: 'dollar', amount: 1, code: 'USD', rate: 22.63 },
					{ country: 'IMF', currency: 'SDR', amount: 1, code: 'XDR', rate: 30.118 },
					{ country: 'South Africa', currency: 'rand', amount: 1, code: 'ZAR', rate: 1.33 },
				],
			});
		});

		test('should trim new lines from the beginning', () => {
			const invalidFixtures = `

      02 Jan 2023 #1
      Country|Currency|Amount|Code|Rate
      Australia|dollar|1|AUD|15.400
      Brazil|real|1|BRL|4.237
      Bulgaria|lev|1|BGN|12.385`;

			expect(() => exchangeRatesStringToJSObject(invalidFixtures, '2023-01-02')).not.toThrow();
		});
	});

	describe('unahppy path', () => {
		test('should throw and error when header format doesnt match due missing date line', () => {
			const invalidFixtures = `
      Country|Currency|Amount|Code|Rate
      Australia|dollar|1|AUD|15.400
      Brazil|real|1|BRL|4.237
      Bulgaria|lev|1|BGN|12.385`;

			expect(() => exchangeRatesStringToJSObject(invalidFixtures, '2023-01-02')).toThrow(
				'The ČNB file should first contain a valid date information.'
			);
		});

		test('should throw and error when header format doesnt match due header date line', () => {
			const invalidFixtures = `02 Jan 2023 #1
      Brazil|real|1|BRL|4.237
      Australia|dollar|1|AUD|15.400
      Bulgaria|lev|1|BGN|12.385`;

			expect(() => exchangeRatesStringToJSObject(invalidFixtures, '2023-01-02')).toThrow(
				'The headers of the ČNB list contains incomplete values. Some necesarry values are missing.'
			);
		});

		test('should throw and error when header format doesnt match due to missing required headers', () => {
			const invalidFixtures = `02 Jan 2023 #1
      Country|Code|Rate
      Brazil|real|1|BRL|4.237
      Australia|dollar|1|AUD|15.400
      Bulgaria|lev|1|BGN|12.385`;

			expect(() => exchangeRatesStringToJSObject(invalidFixtures, '2023-01-02')).toThrow(
				'The headers of the ČNB list contains incomplete values. Some necesarry values are missing.'
			);
		});

		test('should filter out incomplete data with missing properties', () => {
			const invalidFixtures = `02 Jan 2023 #1
      Country|Currency|Amount|Code|Rate
      Australia|dollar|1|AUD|15.400
      Canada|dollar|1|CAD|16.668
      China|renminbi|1|CNY|3.281`;

			expect(exchangeRatesStringToJSObject(invalidFixtures, '2023-01-02')).toEqual({
				date: '2023-01-02',
				rates: [
					{
						amount: 1,
						code: 'AUD',
						country: 'Australia',
						currency: 'dollar',
						rate: 15.4,
					},
					{
						amount: 1,
						code: 'CAD',
						country: 'Canada',
						currency: 'dollar',
						rate: 16.668,
					},
					{
						amount: 1,
						code: 'CNY',
						country: 'China',
						currency: 'renminbi',
						rate: 3.281,
					},
				],
			});
		});
	});
});
