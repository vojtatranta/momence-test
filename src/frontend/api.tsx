import * as React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';

export type ApiFn = <T>(url: string, successStatusCodes?: number[]) => Promise<T>;

export const createRequest = (url: string, successStatusCodes: number[] = [200]) => {
	return fetch(url).then((res) => {
		if (successStatusCodes.indexOf(res.status) === -1) {
			return res.json().then((result) =>
				Promise.reject({
					...result,
					status: result.status || res.status,
				})
			);
		}

		return res.json();
	});
};

export const ApiContext = React.createContext<ApiFn>(createRequest);

export const useReactQueryApi = <Success, Error>(url: string, cacheKeys: string[]) => {
	const createRequestContextFn = React.useContext(ApiContext);
	return useQuery<Success, Error>(cacheKeys, () => createRequestContextFn<Success>(url));
};

export const CompleteApiContext = (
	props: Parameters<typeof QueryClientProvider>[0] & {
		createRequest: ApiFn;
		children: React.ReactNode;
	}
) => {
	return (
		<QueryClientProvider client={props.client}>
			<ApiContext.Provider value={createRequest}>{props.children}</ApiContext.Provider>
		</QueryClientProvider>
	);
};
