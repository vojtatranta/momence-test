import * as React from 'react';

import styled from 'styled-components';

import type { CNBRatesObject, CountryExchangeRate } from '../common/api-types';
import { Maybe } from '../common/utils/monads';
import { normalizeDecimalInput } from '../common/utils/number';

const DomesticRatesFormH = styled.h2``;
const DomesticRatesFormEl = styled.form``;
const DomesticRatesFormSubmitBtn = styled.button``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const FormInputError = styled.p``;
const FormNoData = styled.p`
	font-size: small;
`;
const FormInputResult = styled.p``;
const RatesSelect = styled.select``;
const RatesOption = styled.option``;

const SUBMIT_BUTTON_TEXT = 'Přepočítat';

const normalizeInputValue = (rawInputValue: string) => {
	if (rawInputValue.length === 0) {
		return '';
	}

	return Math.abs(parseInt(rawInputValue));
};

const normalizeInputValueForCalculation = (inputValue: string | number): number => {
	if (typeof inputValue === 'number') {
		return inputValue;
	}

	return parseFloat(inputValue);
};

const formatMoney = (amount: string | number, currency: string) => {
	return `${Number(amount).toFixed(3)}\u00A0${currency}`;
};

function DomesticRatesForm({ data }: { data: CNBRatesObject }) {
	const [rateToConvert, setRateToConvert] = React.useState<CountryExchangeRate | undefined>(data.rates[0]);
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
				&nbsp;CZK
			</FormLabel>
			{Maybe.of<CountryExchangeRate>(rateToConvert)
				.map((actualRateToConvert) => (
					<>
						<FormLabel>
							{' '}
							na{' '}
							<RatesSelect
								value={actualRateToConvert.code}
								onChange={(e) => {
									Maybe.of(data.rates.find((rate) => rate.code === e.currentTarget.value)).map(setRateToConvert);
								}}
							>
								{data.rates.map((rate) => (
									<RatesOption key={rate.code} value={rate.code}>{`${rate.code} - ${rate.country}`}</RatesOption>
								))}
							</RatesSelect>
						</FormLabel>
					</>
				))
				.andThenWithDefault(<FormInputError>Bohužel, nejsou známy žádné kurzy.</FormInputError>)}
			{Maybe.of(calculationState)
				.map((calculationState) => (
					<FormInputResult>
						Za {formatMoney(calculationState.amount, 'CZK')} dostanete{' '}
						{formatMoney(
							(calculationState.amount * calculationState.countryExchangeRate.amount) /
								calculationState.countryExchangeRate.rate,
							calculationState.countryExchangeRate.code
						)}
					</FormInputResult>
				))
				.andThenWithDefault(<FormNoData>Pro výpočet zadejte částku a klikněte na "{SUBMIT_BUTTON_TEXT}".</FormNoData>)}
			<DomesticRatesFormSubmitBtn type='submit'>{SUBMIT_BUTTON_TEXT}</DomesticRatesFormSubmitBtn>
		</DomesticRatesFormEl>
	);
}

export default React.memo(DomesticRatesForm);
