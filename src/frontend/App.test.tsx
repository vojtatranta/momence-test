import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from 'react-query';

const defaultTime = 10000000;

describe('App container', () => {
	test('renders learn react link', () => {
		const renderApp = (props: Parameters<typeof App>[0]) => {
			const queryClient = new QueryClient({
				defaultOptions: {
					queries: {
						retry: false,
					},
				},
			});

			return render(
				<QueryClientProvider client={queryClient}>
					<App {...props} />
				</QueryClientProvider>
			);
		};

		const app = renderApp({ initialDate: new Date(defaultTime) });
		const linkElement = app.getByText(/Stahuji/i);
		expect(linkElement).toBeInTheDocument();
	});
});
