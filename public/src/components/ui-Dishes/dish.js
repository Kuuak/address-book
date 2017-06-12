// Assets depedencies (Style & images)
import './dish.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Helpers
import isFunction from 'lodash.isfunction';

export default class Dish extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( event ) {
		event.preventDefault();

		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( {
				id		: this.props._id,
				name	: this.props.name,
				price	: this.props.price,
				desc	: this.props.desc,
			} );
		}
	}

	render() {
		return (
			<li className="dish collection-item">
				<Link to={`/dish/${this.props._id}/`} onClick={ this.handleClick } >
					{ this.props.name }
					<span className="secondary-content black-text">{ this.props.price.toFixed(2) }</span>
				</Link>
			</li>
		);
	}
}
Dish.PropTypes = {
	_id			: PropTypes.number.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	desc		: PropTypes.string,
	onClick	: PropTypes.func,
};
