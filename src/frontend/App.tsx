import React from 'react';
import { useQuery } from 'react-query';
import { createCNBDataUrl, dateToUrlFormat } from '../common/utils/urls';
import { ApiErrorResponse, CNBRatesObject, CountryExchangeRate } from '../common/api-types';
import styled from 'styled-components';
import RatesTable from './RatesTable';
import DomesticRatesForm from './DomesticRatesForm';
import { Maybe } from '../common/utils/monads';
import { createRequest } from './api';

const Container = styled.section`
	max-width: 960px;
	margin: 0 auto;
	padding: 0 15px 50px 15px;
`;
const RatesTableMaiNHeading = styled.h1`
	text-align: center;
`;
const RatesTableHeader = styled.header`
	margin: 2rem 0;
`;
const NoResultSection = styled.section`
	margin: 40px 0;
	text-align: center;
`;
const NoResultCodeSection = styled.code`
	display: block;
	white-space: pre-wrap;
	padding: 10px;
`;
const NoResultCodeP = styled.p`
	padding: 10px;
`;

const czechFormatter = new Intl.DateTimeFormat('cs-CZ');

function App({ initialDate }: { initialDate: Date }) {
	const [dateString, setDate] = React.useState(dateToUrlFormat(initialDate));
	const [rateToConvert, setRateToConvert] = React.useState<CountryExchangeRate | undefined>(undefined);

	React.useEffect(() => {
		const animationCallaback = () => {
			setDate(dateToUrlFormat(new Date(Date.now())));
			requestId = window.requestAnimationFrame(animationCallaback);
		};

		let requestId = window.requestAnimationFrame(() => {
			animationCallaback();
		});

		return () => {
			window.cancelAnimationFrame(requestId);
		};
	}, [setDate]);

	const { isLoading, error, data } = useQuery<CNBRatesObject, ApiErrorResponse>(['cnbRates', dateString], () =>
		createRequest(createCNBDataUrl(dateString))
	);

	if (isLoading) {
		return (
			<Container>
				<NoResultSection>Stahuji kurzování lístek ČNB...</NoResultSection>
			</Container>
		);
	}

	if (error || !data) {
		return (
			<Container>
				<NoResultSection>Nedaří se stáhnout kurzování lístek.</NoResultSection>
				{Maybe.of(error)
					.map((actualError) => (
						<>
							<NoResultCodeP>Chyba:</NoResultCodeP>
							<NoResultCodeSection>
								Kód: {actualError.code}
								{'\n'}
								Status: {actualError.status}
								{'\n'}
								Zpráva: {actualError.message}
								{'\n'}
							</NoResultCodeSection>
							<NoResultCodeP>Jste si jistí, že jste spustili server?</NoResultCodeP>
							<NoResultCodeSection>$ yarn server</NoResultCodeSection>
							<NoResultCodeP>
								A pokud nevíte, jak dál, tak otevřete{' '}
								<a href='https://github.com/vojtatranta/momence-test/issues/new'>issue na Githubu</a> a já se na to
								podvám.{' '}
							</NoResultCodeP>
						</>
					))
					.andThenWithDefault(null)}
			</Container>
		);
	}

	const selectedExchangeRate = rateToConvert || data.rates[0];

	return (
		<Container>
			<RatesTableMaiNHeading>Zjistěte kurz koruny podle ČNB</RatesTableMaiNHeading>
			<RatesTableHeader>
				Používáte kurzování lístek pro den: <strong>{czechFormatter.format(new Date(dateString))}</strong>
				<DomesticRatesForm rateToConvert={selectedExchangeRate} data={data} onRateToConvertSet={setRateToConvert} />
			</RatesTableHeader>
			<RatesTable selectedCode={selectedExchangeRate?.code} data={data} onRateToConvertSet={setRateToConvert} />
		</Container>
	);
}

export default App;
