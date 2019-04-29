import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import NavBar from './NavBar';
import Home from './Home';
import Mixes from './Mixes';
import Music from './Music';
import Tracks from './Tracks';
import Contact from './Contact';

// eslint-disable-next-line import/no-unassigned-import
import './styles.styl';

/*
	Routing Design and Descriptions

	Home:    / (a page for featured content, social media links, etc)
	Contact: /contact (a page containing contact info)
	Music:   /music (a catalog page containing all music types)
	Tracks:  /tracks (a page containing all tracks)
	Track:   /tracks/{trackId} (a page containing a specific track)
	Mixes:   /mixes (a page containing all mixes)
	Mix:   	 /mixes/{mixId} (a page containing a specific mix)
*/

const Root = props => (
	<div className="container" {...props}/>
);

const Content = props => (
	<div className="content" {...props}/>
);

class App extends React.Component {
	render() {
		return (
			<Root>
				<Router>
					<NavBar/>
					<Content>
						<Route exact path="/" component={Home}/>
						<Route exact path="/contact" component={Contact}/>
						<Route exact path="/mixes" component={Mixes}/>
						<Route exact path="/music" component={Music}/>
						<Route exact path="/tracks" component={Tracks}/>
					</Content>
				</Router>
			</Root>
		);
	}
}

ReactDOM.render(
	<App/>,
	document.querySelector('#root')
);
