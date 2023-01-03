import * as React from 'react';

import styled from 'styled-components';

import { DEFAULT_CURRENCY } from '../common/constants';

import type { CNBRatesObject, CountryExchangeRate } from '../common/api-types';

const borderColor = '#bdbdbd';
const highlightedColor = '#FFF0F0';

const RatesTableEl = styled.table`
	width: 100%;
	border-collapse: collapse;
`;
const RatesTHead = styled.thead``;
const RatesTBody = styled.tbody``;
const RatesTR = styled.tr`
	background: ${(props: { selected?: boolean }) => props.selected && highlightedColor};
	cursor: ${(props: { selected?: boolean }) => (props.selected ? 'initial' : 'pointer')};
`;
const RatesTH = styled.th`
	text-align: left;
`;
const RatesTHAmount = styled.th`
	text-align: left;
	width: 150px;
`;
const RatesTHRate = styled.th`
	text-align: right;
	width: 120px;
`;
const RatesTD = styled.td`
	padding: 5px 4px;
	border: 1px solid ${borderColor};
`;
const RatesTDRight = styled(RatesTD)`
	text-align: right;
`;

function RatesTable(props: {
	data: CNBRatesObject;
	selectedCode: string | undefined;
	onRateToConvertSet: React.Dispatch<React.SetStateAction<CountryExchangeRate | undefined>>;
}) {
	return (
		<RatesTableEl>
			<RatesTHead>
				{[props.data.rates[0]].filter(Boolean).map((key) => (
					<RatesTR key={key.code}>
						<RatesTH>Název měny</RatesTH>
						<RatesTH>Kód měny</RatesTH>
						<RatesTH>Země</RatesTH>
						<RatesTHAmount>Množství cizí měny</RatesTHAmount>
						<RatesTHRate>Cena v {DEFAULT_CURRENCY}</RatesTHRate>
					</RatesTR>
				))}
			</RatesTHead>
			<RatesTBody>
				{props.data.rates.map((rate) => (
					<RatesTR
						key={rate.country}
						selected={props.selectedCode === rate.code}
						onClick={() => {
							props.onRateToConvertSet(rate);
						}}
					>
						<RatesTD>{rate.currency}</RatesTD>
						<RatesTD>{rate.code}</RatesTD>
						<RatesTD>{rate.country}</RatesTD>
						<RatesTDRight>{rate.amount}</RatesTDRight>
						<RatesTDRight>{rate.rate}</RatesTDRight>
					</RatesTR>
				))}
			</RatesTBody>
		</RatesTableEl>
	);
}

export default React.memo(RatesTable);
