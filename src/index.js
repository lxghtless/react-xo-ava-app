import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

// eslint-disable-next-line import/no-unassigned-import
import './styles.styl';

const entryPoint = document.querySelector('#root');

ReactDOM.render(
	<App/>,
	entryPoint
);

if (module.hot) {
	module.hot.accept('./app', () => {
		const NextApp = require('./app').default;
		ReactDOM.render(
			<NextApp/>,
			entryPoint
		);
	});
}
