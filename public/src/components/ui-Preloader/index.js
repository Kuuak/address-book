// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';

class Preloader extends React.Component {

	render() {

		let classes = 'preloader-wrapper';

		if ( this.props.active ) {
			classes += ' active';
		}

		return (
			<div className={classes}>
				<div className="spinner-layer spinner-green-only">
					<div className="circle-clipper left">
						<div className="circle"></div>
					</div>
					<div className="gap-patch">
						<div className="circle"></div>
					</div>
					<div className="circle-clipper right">
						<div className="circle"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default Preloader;
