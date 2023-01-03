import * as React from 'react';

import styled from 'styled-components';

import type { CNBRatesObject } from '../common/api-types';

const RatesTableEl = styled.table``;
const RatesTBody = styled.tbody``;
const RatesTR = styled.tr``;
const RatesTD = styled.td``;

function RatesTable(props: { data: CNBRatesObject }) {
	return (
		<RatesTableEl>
			<RatesTBody>
				{props.data.rates.map((rate) => (
					<RatesTR key={rate.country}>
						{Object.entries(rate).map(([key, value]) => (
							<RatesTD key={key}>{value}</RatesTD>
						))}
					</RatesTR>
				))}
			</RatesTBody>
		</RatesTableEl>
	);
}

export default React.memo(RatesTable);
