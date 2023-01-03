export function createRequest(url: string, successStatusCodes: number[] = [200]) {
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
}
