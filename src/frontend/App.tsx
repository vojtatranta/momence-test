import React from 'react';
import { useQuery } from 'react-query';
import { createCNBDataUrl, dateToUrlFormat } from '../common/utils/urls';
import { ApiErrorResponse, CNBRatesObject, CountryExchangeRate } from '../common/api-types';
import styled from 'styled-components';
import RatesForm from './ForeignRatesForm';
import RatesTable from './RatesTable';
import DomesticRatesForm from './DomesticRatesForm';
import { createRequest } from './api';

const Container = styled.section`
	max-width: 1024px;
	margin: 0 auto;
	padding: 0 0 50px 0;
`;

const RatesTableHeader = styled.header`
	margin: 2rem 0;
`;

function App({ initialDate }: { initialDate: Date }) {
	const [dateString, setDate] = React.useState(dateToUrlFormat(initialDate));

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

	if (isLoading) return <>Loading...</>;
							<NoResultCodeP>Chyba:</NoResultCodeP>
							<NoResultCodeSection>
								Kód: {actualError.code}
								{'\n'}
								Status: {actualError.status}
								{'\n'}
								Zpráva: {actualError.message}
								{'\n'}
							</NoResultCodeSection>

	if (error || !data) return <>An error has occurred</>;

	return (
		<Container>
			<RatesTableHeader>
				Zobrazujeme kurzování lístek pro den: {dateString}
				<DomesticRatesForm data={data} />
				<RatesForm data={data} />
			</RatesTableHeader>
			<RatesTable data={data} />
		</Container>
	);
}

export default App;
