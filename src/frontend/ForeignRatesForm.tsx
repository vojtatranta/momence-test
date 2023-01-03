import * as React from 'react';

import styled from 'styled-components';

import type { CNBRatesObject, CountryExchangeRate } from '../common/api-types';
import { Maybe } from '../common/utils/monads';

const ForeignRatesFormH = styled.h2``;
const ForeignRatesFormEl = styled.form``;
const FormLabel = styled.label``;
const FormInput = styled.input``;
const FormInputError = styled.p``;
const FormInputResult = styled.p``;
const RatesSelect = styled.select``;
const RatesOption = styled.option``;

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

	return 0;
};

const formatMoney = (amount: string | number, currency: string) => {
	return `${Number(amount).toFixed(2)}\u00A0${currency}`;
};

function ForeignRatesForm({ data }: { data: CNBRatesObject }) {
	const [rateToConvert, setRateToConvert] = React.useState<CountryExchangeRate | undefined>(data.rates[0]);
	const [inputValue, setInputValue] = React.useState<string | number>(rateToConvert?.amount || 1);

	const inputValueForCalculation = normalizeInputValueForCalculation(inputValue);

	return (
		<ForeignRatesFormEl onSubmit={(e) => e.preventDefault()}>
			<ForeignRatesFormH>Zjistěte, kolik korun získáte za cizí měnu</ForeignRatesFormH>
			<FormLabel>
				Za:{' '}
				<FormInput
					value={inputValue}
					type='number'
					onFocus={(event) => event.currentTarget.select()}
					min={1}
					onChange={(event) => {
						setInputValue(normalizeInputValue(event.currentTarget.value));
					}}
				/>
			</FormLabel>
			{Maybe.of<CountryExchangeRate>(rateToConvert)
				.map((actualRateToConvert) => (
					<>
						<FormLabel>
							<RatesSelect
								value={actualRateToConvert.code}
								onChange={(e) => {
									Maybe.of(data.rates.find((rate) => rate.code === e.currentTarget.value)).map((value) => {
										setRateToConvert(value);
										setInputValue(value.amount);
									});
								}}
							>
								{data.rates.map((rate) => (
									<RatesOption key={rate.code} value={rate.code}>{`${rate.code} - ${rate.country}`}</RatesOption>
								))}
							</RatesSelect>
						</FormLabel>
						<FormInputResult>
							Za {formatMoney(inputValueForCalculation, actualRateToConvert.code)} dostanete{' '}
							<strong>
								{formatMoney((inputValueForCalculation * actualRateToConvert.rate) / actualRateToConvert.amount, 'CZK')}
							</strong>
						</FormInputResult>
					</>
				))
				.andThenWithDefault(<FormInputError>Bohužel, nejsou známy žádné kurzy.</FormInputError>)}
		</ForeignRatesFormEl>
	);
}

export default React.memo(ForeignRatesForm);
