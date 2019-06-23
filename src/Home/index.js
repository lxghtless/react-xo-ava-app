import React from 'react';
import gravatarUrl from 'gravatar-url';

class Home extends React.Component {
	render() {
		return (
			<div className="page">
				<img
					src={gravatarUrl('lxghtl3ss@gmail.com', {size: 100})}
					style={{height: 100, width: 100}}
					alt="@lxghtless"
				/>
			</div>
		);
	}
}

export default Home;
