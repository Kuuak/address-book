// Assets depedencies (Style & images)
import './index.css';
import 'styles/appears.css';

// React
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Helpers
import formatPhone from 'includes/formatPhone';

export default class ResultSuggestion extends React.Component {

	render() {

		return (
			<li className="card result-suggestion" style={{transitionDelay: (this.props.id*75) +'ms'}}>
				<div className="card-content">
					<div className="card-header">
						<div className="card-title phone">{ formatPhone(this.props.phone) }</div>
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
				<div className={ 'card-action'+ ( this.props.extra ? ' green lighten-4' : '') }>
					<Link className={( this.props.extra && 'black-text' )} to={`/add/customer/${this.props.id}`}>Enregistrer</Link>
				</div>
			</li>
		)
	}

}
ResultSuggestion.propTypes = {
	phone		: PropTypes.string,
	title		: PropTypes.string,
	street	: PropTypes.string,
	postcode: PropTypes.string,
	city		: PropTypes.string,
	extra		: PropTypes.bool,
};
ResultSuggestion.defaultProps = {
	phone		: null,
	title		: null,
	street	: null,
	postcode: null,
	city		: null,
	extra		: false,
}
