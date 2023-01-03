import express from 'express';
import cors from 'cors';

import { exchangeRatesStringToJSObject } from '../common/utils/cnb-parser';
import { apiErrorHandler, createCNBUrl, dateToCNBFormat } from './server-utils';
import { API_PORT } from '../common/api-types';
import { CNB_DATA_JSON_SCHEME } from '../common/utils/urls';

const app = express();
app.use(cors());

app.get(CNB_DATA_JSON_SCHEME, (req, res) => {
	new Promise<ReturnType<typeof dateToCNBFormat>>((resolve, reject) => {
		try {
			const result = dateToCNBFormat(req.params.date);
			resolve(result);
		} catch (error) {
			reject(error);
		}
	})
		.then(({ date, cnbFormat }) =>
			fetch(createCNBUrl(cnbFormat))
				.then((cnbResponse) => cnbResponse.text())
				.then((cnbTxtResponse) => exchangeRatesStringToJSObject(cnbTxtResponse, date))
				.then((result) => res.json(result))
		)
		.catch(apiErrorHandler(res));
});

app.listen(API_PORT, () => {
	console.log(`App is listening on port: ${API_PORT}`);
});
