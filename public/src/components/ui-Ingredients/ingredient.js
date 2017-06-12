// Assets depedencies (Style & images)
import './ingredient.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Helpers
import isFunction from 'lodash.isfunction';

export default class Ingredient extends React.Component {

	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
	}

	handleClick( event ) {
		event.preventDefault();

		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( event.target.rel, {
				id		: this.props._id,
				name	: this.props.name,
				price	: this.props.price,
			});
		}
	}

	render() {
		return (
			<li className="ingredient collection-item">
				<span className="collection-item-action">
					<a onClick={ this.handleClick } rel="add" className="extra material-icons" title="Supplément">add_circle_outline</a>
					<a onClick={ this.handleClick } rel="remove" className="delete material-icons" title="Sans">remove_circle_outline</a>
				</span>
				{ this.props.name }
				{ this.props.price && <span className="secondary-content black-text">{ this.props.price.toFixed(2) }</span> }
			</li>
		);
	}
}
Ingredient.PropTypes = {
	_id			: PropTypes.number.isRequired,
	name		: PropTypes.string.isRequired,
	price		: PropTypes.number.isRequired,
	onClick	: PropTypes.func,
};
