// Assets depedencies (Style & images)
import './form.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';
import formatPrice from 'includes/formatPrice';
import formData2UrlEncoded from 'includes/formData2UrlEncoded';


export default class DishForm extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			name: '',
			price: ''
		};

		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleChangeName = this.handleChangeName.bind( this );
		this.handleChangePrice = this.handleChangePrice.bind( this );
	}

	handleSubmit( event ) {
		event.preventDefault();

		let form = event.target,
				data = new FormData( form );

		for( let field of form.querySelectorAll( '.invalid' ) ) {
			field.classList.remove( 'invalid' );
		}

		fetch( form.action, {
			method: 'POST',
			body: formData2UrlEncoded( data ),
			headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' }),
		} )
		.then( res => res.json() )
		.then( res => {

			if ( ! isEmpty(res.alerts) ) {
				this.props.addAlerts( res.alerts );
			}

			if ( ! isEmpty(res.fields) ) {
				for (let fieldName of res.fields) {
					form.querySelector( `[name="${fieldName}"]` ).classList.add( 'invalid' );
				}
			}


			if ( res.success ) {

				this.setState({
					name: '',
					price: '',
				});
				form.elements[0].focus();

				if ( isFunction( this.props.onSubmitSuccess ) ) {
					this.props.onSubmitSuccess({
						id		: res.dish._id,
						name	: res.dish.name,
						price	: res.dish.price,
						desc	: res.dish.desc,
					});
				}
			}
		} );
	}

	handleChangeName( event ) {
		this.setState({ name: event.target.value });
	}

	handleChangePrice( event ) {
		this.setState({ price: formatPrice( event.target.value ) });
	}

	render() {
		return (
			<form method="POST" action="/dish/" className="add-dish-form" onSubmit={ this.handleSubmit }>
				<input type="text" name="name" className="name" placeholder="Ajouter un plat" value={ this.state.name } onChange={ this.handleChangeName } autoComplete="off" />
				<input type="text" name="price" className="price" placeholder="Prix" value={ this.state.price } pattern="\d+(\.\d{1,2})?" onChange={ this.handleChangePrice } autoComplete="off" />
				<button type="submit" className="btn blue">Ajouter</button>
			</form>
		);
	}
}
DishForm.PropTypes = {
	onSubmitSuccess: PropTypes.func,
};
