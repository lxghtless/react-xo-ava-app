import React, {Component} from 'react';
import {Link} from 'react-router-dom';

// eslint-disable-next-line import/no-unassigned-import
import './styles.styl';

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.onNavToggle = this.onNavToggle.bind(this);
		this.state = {
			active: false
		};
	}

	onNavToggle() {
		const currentState = this.state.active;
		this.setState({active: !currentState});
	}

	render() {
		return (
			<nav className={this.state.active ? 'navbar navbar-active' : 'navbar'}>
				<span className="navbar-brand" onClick={this.onNavToggle}>
					Hype
				</span>
				<ul className={this.state.active ? 'main-nav main-nav-active' : 'main-nav'}>
					<li>
						<Link to="/" className="nav-links">Home</Link>
					</li>
					<li>
						<Link to="/music" className="nav-links">Music</Link>
					</li>
					<li>
						<Link to="/mixes" className="nav-links">Mixes</Link>
					</li>
					<li>
						<Link to="/tracks" className="nav-links">Tracks</Link>
					</li>
					<li>
						<Link to="/contact" className="nav-links">Contact</Link>
					</li>
				</ul>
			</nav>
		);
	}
}

export default NavBar;
