import * as React from 'react';

import styled from 'styled-components';

import { Maybe } from '../common/utils/monads';
import { formatMoney, normalizeDecimalInput } from '../common/utils/number';

import { DEFAULT_CURRENCY, DEFAULT_CURRENCY_CODE } from '../common/constants';

import type { CNBRatesObject, CountryExchangeRate } from '../common/api-types';

const DomesticRatesFormH = styled.h2``;
const DomesticRatesFormEl = styled.form``;
const DomesticRatesFormSubmitBtn = styled.button``;
const FormLabel = styled.label``;
const FormInput = styled.input`
	height: 22px;
	padding: 2px;
`;
const FormInputError = styled.p``;
const FormNoData = styled.p`
	font-size: small;
`;
const FormInputResult = styled.p``;
const RatesSelect = styled.select`
	height: 30px;
	padding: 4px 2px;
`;
const RatesOption = styled.option``;

const SUBMIT_BUTTON_TEXT = 'Přepočítat';

const normalizeInputValueForCalculation = (inputValue: string | number): number => {
	if (typeof inputValue === 'number') {
		return inputValue;
	}

	return parseFloat(inputValue);
};

function DomesticRatesForm({
	data,
	rateToConvert,
	onRateToConvertSet,
}: {
	data: CNBRatesObject;
	rateToConvert: CountryExchangeRate | undefined;
	onRateToConvertSet: React.Dispatch<React.SetStateAction<CountryExchangeRate | undefined>>;
}) {
	const [inputValue, setInputValue] = React.useState<string | number>(rateToConvert?.amount || 1);
	const [calculationState, setCalculationState] = React.useState<{
		countryExchangeRate: CountryExchangeRate;
		amount: number;
	} | null>(
		Maybe.of(rateToConvert)
			.map((existentExchangeRate) => ({
				countryExchangeRate: existentExchangeRate,
				amount: rateToConvert?.amount || 1,
			}))
			.andThenWithDefault(null)
	);

	const inputValueForCalculation = normalizeInputValueForCalculation(inputValue);

	return (
		<DomesticRatesFormEl
			onSubmit={(e) => {
				e.preventDefault();

				if (rateToConvert) {
					setCalculationState({
						countryExchangeRate: rateToConvert,
						amount: inputValueForCalculation,
					});
				}
			}}
		>
			<DomesticRatesFormH>Zjistěte, kolik cizí měny získáte za koruny</DomesticRatesFormH>
			<FormLabel>
				Převeďte:{' '}
				<FormInput
					value={inputValue}
					data-testid='czk-amount-input'
					type='text'
					onFocus={(event) => event.currentTarget.select()}
					onChange={(event) => {
						Maybe.of(normalizeDecimalInput(event.currentTarget.value)).map((value) => {
							if (typeof value === 'number') {
								setInputValue(Math.max(rateToConvert?.amount || 1, value));
							} else {
								setInputValue(value);
							}
						});
					}}
				/>
				&nbsp;{DEFAULT_CURRENCY}
			</FormLabel>
			{Maybe.of<CountryExchangeRate>(rateToConvert)
				.map((actualRateToConvert) => (
					<>
						<FormLabel>
							{' '}
							na{' '}
							<RatesSelect
								value={actualRateToConvert.code}
								data-testid='rates-select'
								onChange={(e) => {
									Maybe.of(data.rates.find((rate) => rate.code === e.currentTarget.value)).map(onRateToConvertSet);
								}}
							>
								{data.rates.map((rate) => (
									<RatesOption
										key={rate.code}
										value={rate.code}
									>{`${rate.code}-${rate.currency}-${rate.country}`}</RatesOption>
								))}
							</RatesSelect>
						</FormLabel>
					</>
				))
				.andThenWithDefault(<FormInputError>Bohužel, nejsou známy žádné kurzy.</FormInputError>)}

			{Maybe.of(calculationState)
				.map(({ amount, countryExchangeRate }) => (
					<FormInputResult data-testid='calculation-result'>
						Za <strong>{formatMoney(amount, DEFAULT_CURRENCY_CODE)}</strong> dostanete{' '}
						<strong>
							{formatMoney((amount * countryExchangeRate.amount) / countryExchangeRate.rate, countryExchangeRate.code)}
						</strong>
					</FormInputResult>
				))
				.andThenWithDefault(<FormNoData>Pro výpočet zadejte částku a klikněte na "{SUBMIT_BUTTON_TEXT}".</FormNoData>)}
			<DomesticRatesFormSubmitBtn type='submit' data-testid='rates-submit'>
				{SUBMIT_BUTTON_TEXT}
			</DomesticRatesFormSubmitBtn>
		</DomesticRatesFormEl>
	);
}

export default React.memo(DomesticRatesForm);
