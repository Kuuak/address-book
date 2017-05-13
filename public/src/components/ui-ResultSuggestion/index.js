// Assets depedencies (Style & images)
import './index.css';
import 'styles/appears.css';

// React
import React from 'react';
import { Link } from 'react-router-dom';

class ResultSuggestion extends React.Component {

	render() {

		return (
			<li className="card result-suggestion" style={{transitionDelay: (this.props.id*75) +'ms'}}>
				<div className="card-content">
					<div className="card-header">
						<div className="card-title phone">{this.props.phone}</div>
						<Link to={`/customer/add/${this.props.id}`} className="btn-floating halfway-fab waves-effect waves-light red">
							<i className="material-icons">add</i>
						</Link>
					</div>
					<div className="title">{this.props.title}</div>
					<address>
						<div className="street">{this.props.street}</div>
						<div className="postcode-city-region">
							<span className="postcode">{this.props.postcode}</span>&nbsp;
							<span className="city">{this.props.city}</span>
						</div>
					</address>
				</div>
			</li>
		)
	}

}

export default ResultSuggestion
