import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { act } from 'react-dom/test-utils';
import { QueryClient } from 'react-query';
import { CompleteApiContext } from './api';
import { createApiMock } from './mocks/api-mock';
import { CNBRatesObject } from '../common/api-types';

const defaultTime = 1672848311374;

describe('App container', () => {
	const renderContainer = (props: Parameters<typeof App>[0]) => {
		const mock = createApiMock();
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		return {
			...mock,
			renderApp: () =>
				render(
					<CompleteApiContext client={queryClient} createRequest={mock.createRequest}>
						<App {...props} />
					</CompleteApiContext>
				),
		};
	};

	test('should request an ČNB exchange rate list with a correct date', () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const endPromise = new Promise((resolve) => {
			requestEmitter.onRequest(({ url }) => {
				expect(url.match(/daily-exchange-rate\/2023-01-04/)?.length).toBe(1);
				resolve({});
			});
		});

		renderApp();
		return endPromise;
	});

	test('should render a loading state by default', () => {
		const { renderApp } = renderContainer({ initialDate: new Date(defaultTime) });

		const app = renderApp();

		const loadingElement = app.getByText(/Stahuji kurzování lístek ČNB/i);
		expect(loadingElement).toBeInTheDocument();
	});

	test('should render an error state', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		requestEmitter.onRequest(async ({ reject }) => {
			act(() => {
				reject(new Error());
			});
		});

		act(() => {
			renderApp();
		});

		await waitFor(async () => {
			expect(await screen.getByText(/Nedaří se stáhnout kurzování lístek/i)).toBeInTheDocument();
		});
	});

	test('should state of heading with downloaded data', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve({
					date: '2023-01-04',
					rates: [],
				});
			});
		});

		renderApp();

		await waitFor(async () => {
			expect(screen.getByText('Zjistěte kurz koruny podle ČNB')).toBeInTheDocument();
			expect(screen.getByText('4. 1. 2023')).toBeInTheDocument();
		});
	});

	test('should pass downloaded data and render a table', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const expectedData: CNBRatesObject = {
			date: '2023-01-04',
			rates: [
				{
					country: 'Czech Republic',
					amount: 1,
					rate: 1,
					code: 'CZK',
					currency: 'Česká koruna',
				},
			],
		};

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve(expectedData);
			});
		});

		renderApp();

		await waitFor(async () => {
			const table = await screen.findByTestId('rates-table');
			expect(await within(table).getByText('Česká koruna')).toBeInTheDocument();
		});
	});

	test('should calculate initial exchange rate', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const expectedData: CNBRatesObject = {
			date: '2023-01-04',
			rates: [
				{
					country: 'Rich country',
					amount: 11111,
					rate: 1,
					code: 'RCH',
					currency: 'Rich dollar',
				},
			],
		};

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve(expectedData);
			});
		});

		renderApp();

		await waitFor(async () => {
			const result = await screen.findByTestId('calculation-result');
			expect(await within(result).getByText('123 454 321,00 RCH')).toBeInTheDocument();
		});
	});

	test('should recalculate initial exchange rate when value changes', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const expectedData: CNBRatesObject = {
			date: '2023-01-04',
			rates: [
				{
					country: 'Rich country',
					amount: 1,
					rate: 1000,
					code: 'RCH',
					currency: 'Rich dollar',
				},
			],
		};

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve(expectedData);
			});
		});

		renderApp();

		await waitFor(async () => {
			const input = await screen.findByTestId('czk-amount-input');
			const submit = await screen.findByTestId('rates-submit');
			act(() => {
				fireEvent.change(input, { target: { value: 1000 } });
				fireEvent.click(submit);
			});

			const result = await screen.findByTestId('calculation-result');
			expect(within(result).getByText('1,00 RCH')).toBeInTheDocument();
		});
	});

	test('should NOT recalculate just on an input change', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const expectedData: CNBRatesObject = {
			date: '2023-01-04',
			rates: [
				{
					country: 'Rich country',
					amount: 1,
					rate: 1000,
					code: 'RCH',
					currency: 'Rich dollar',
				},
			],
		};

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve(expectedData);
			});
		});

		renderApp();

		await waitFor(async () => {
			const input = await screen.findByTestId('czk-amount-input');
			await act(() => fireEvent.change(input, { target: { value: 1000 } }));

			const result = await screen.findByTestId('calculation-result');

			expect((await screen.findByTestId('czk-amount-input')).getAttribute('value')).toBe('1000');
			expect(await within(result).getByText('0,00 RCH')).toBeInTheDocument();
		});
	});

	test('should recalculate to a different currency', async () => {
		const { renderApp, requestEmitter } = renderContainer({ initialDate: new Date(defaultTime) });

		const expectedData: CNBRatesObject = {
			date: '2023-01-04',
			rates: [
				{
					country: 'Rich country',
					amount: 1,
					rate: 1000,
					code: 'RCH',
					currency: 'Rich dollar',
				},
				{
					country: 'Poorer country',
					amount: 1,
					rate: 10,
					code: 'USD',
					currency: 'Poor dollar',
				},
			],
		};

		requestEmitter.onRequest(({ resolve }) => {
			act(() => {
				resolve(expectedData);
			});
		});

		renderApp();

		await waitFor(async () => {
			const ratesSelect = await screen.findByTestId('rates-select');
			const submit = await screen.findByTestId('rates-submit');
			act(() => {
				fireEvent.change(ratesSelect, { target: { value: 'USD' } });
				fireEvent.click(submit);
			});

			const result = await screen.findByTestId('calculation-result');
			expect(within(result).getByText('0,10 US$')).toBeInTheDocument();
		});
	});
});
