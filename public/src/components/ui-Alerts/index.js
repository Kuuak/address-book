// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Helpers
import isNull from 'lodash.isnull';

class Alerts extends React.Component {

	render() {
		return (
			<CSSTransitionGroup component="ul" className="alerts" transitionName="alert" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
				{ this.props.alerts.map( (alert, i) => <Alert key={i} {...alert} dismiss={this.props.dismiss} style={{ transitionDelay: (i*50) +'ms'}} /> ) }
			</CSSTransitionGroup>
		);
	}
}
Alerts.propTypes = {
	alerts	: PropTypes.array.isRequired,
	dismiss	: PropTypes.func.isRequired,
};


export class Alert extends React.Component {

	constructor(props) {
		super(props);

		this.handleCloseButton = this.handleCloseButton.bind(this);
	}

	componentDidMount() {

		if ( 0 < this.props.timeout ) {
			this.timeout = setTimeout( this.props.dismiss, this.props.timeout, this.props.id );
		}
	}

	handleCloseButton() {
		this.props.dismiss( this.props.id );
		if ( ! isNull(this.timeout) ) {
			clearTimeout( this.timeout );
		}
	}

	render() {
		return (
			<li className={ 'alert alert-'+ this.props.status } style={this.props.style}>
				{ this.props.closeButton && <button className="close" onClick={this.handleCloseButton}>x</button> }
				{ this.props.icon && <i className="material-icons">{this.props.icon}</i> }
				<strong>{this.props.title}</strong>
				<span>{this.props.message}</span>
				{ this.props.handleClick && <button className="btn red" onClick={this.props.handleClick}>{this.props.titleButton}</button> }
				{ this.props.linkButton && <Link to={this.props.linkButton} className="btn red" >{this.props.titleButton}</Link> }
			</li>
		);
	}
}
Alert.propTypes = {
	title				: PropTypes.string,
	timeout			: PropTypes.number,
	id					: PropTypes.number.isRequired,
	status			: PropTypes.string.isRequired,
	message			: PropTypes.string.isRequired,
	dismiss			: PropTypes.func.isRequired,
	closeButton	: PropTypes.bool.isRequired,
};
Alert.defaultProps = {
	status			: 'success',
	timeout			: 8000,
	icon				: null,
	closeButton	: true,
	handleClick	: null,
	titleButton	: 'Click',
}



export default Alerts;
