import React from 'react';
import ReactDOM from 'react-dom/client';
import './frontend/index.css';
import App from './frontend/App';
import reportWebVitals from './reportWebVitals';
import { QueryClient } from 'react-query';
import { CompleteApiContext, createRequest } from './frontend/api';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<CompleteApiContext client={queryClient} createRequest={createRequest}>
			<App initialDate={new Date(Date.now())} />
		</CompleteApiContext>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
