import events from 'events';
import type { ApiFn } from '../api';

class RequestEmitter extends events.EventEmitter {
	public REQUEST_EVENT = 'test:onRequest';

	// eslint-disable-next-line @typescript-eslint/ban-types
	emitRequest<RS extends Function, RJ extends Function>(
		resolve: RS,
		reject: RJ,
		url: string,
		successStatusCodes?: number[]
	) {
		this.emit(this.REQUEST_EVENT, resolve, reject, url, successStatusCodes);
	}

	onRequest(
		// eslint-disable-next-line @typescript-eslint/ban-types
		cb: <RS extends Function, RJ extends Function>(params: {
			url: string;
			successStatusCodes?: number[];
			resolve: RS;
			reject: RJ;
		}) => void
	) {
		this.addListener(this.REQUEST_EVENT, (resolve, reject, url, successStatusCodes) => {
			cb({
				url,
				successStatusCodes,
				reject,
				resolve,
			});
		});
	}
}

export const createApiMock = (): {
	createRequest: ApiFn;
	requestEmitter: RequestEmitter;
} => {
	const requestEmitter = new RequestEmitter();
	const createRequest = <R>(url: string, successStatusCodes?: number[]): Promise<R> => {
		return new Promise((resolve, reject) => {
			requestEmitter.emitRequest(resolve, reject, url, successStatusCodes);
		});
	};

	return {
		createRequest,
		requestEmitter,
	};
};
