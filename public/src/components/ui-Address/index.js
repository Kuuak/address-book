// Assets depedencies (Style & images)
import 'styles/fade.css';
import './index.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

// Helpers
import rmSlash from 'includes/rmSlash';
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';

class Address extends React.Component {
	constructor( props ) {
		super( props );

		this.handleClick = this.handleClick.bind( this );
		this.handleChange = this.handleChange.bind( this );
	}

	handleClick( event ) {
		if ( isFunction(this.props.onClick) ) {
			this.props.onClick( event, this.props.id );
		}
	}

	handleChange( event ) {
		if ( isFunction(this.props.onChange) ) {
			this.props.onChange( event, this.props.id );
		}
	}

	render() {
		return (
			<li className={ 'address collection-item'+ ( this.props.selected ? ' selected' : '' ) }>
				<div className="details">
					<div>
						<span className="street">{this.props.street}</span>&nbsp;
						<span className="number">{this.props.number}</span>
					</div>
					<div>
						<span className="postcode">{this.props.postcode}</span>&nbsp;
						<span className="city">{this.props.city}</span>
					</div>
					<div className="actions">
							<Route path="/customer" render={ () => (
								<div>
									<Link to={ `/order/customer/${this.props.custId}/address/${this.props.id}/` } rel="address-shipping" onClick={ this.handleClick } className="material-icons shipping">local_shipping</Link>
									<Link to={`${rmSlash(this.props.location)}/address/${this.props.id}/directions/`} rel="address-directions" onClick={ this.handleClick } className="material-icons direction">directions</Link>
									<Link to={`${rmSlash(this.props.location)}/address/${this.props.id}/edit/`} rel="address-edit" onClick={ this.handleClick } className="material-icons edit">edit</Link>
									<Link to={`${rmSlash(this.props.location)}/address/${this.props.id}/delete/`} rel="address-delete" onClick={ this.handleClick } className="material-icons delete">delete</Link>
								</div>
							) } />
							<Route path="/order" render={ () => (
								<div className="input-chk">
									<input type="radio" id={ `addr_${this.props.id}` } name="addr" value={ this.props.id } onChange={ this.handleChange } defaultChecked={ this.props.selected } />
									<label htmlFor={ `addr_${this.props.id}` }></label>
								</div>
							) } />
					</div>
				</div>
				<div className="extra">
					{ ( ! isEmpty(this.props.doorcode) ) && <div><strong>Code de porte:</strong> <span>{this.props.doorcode}</span></div> }
					{ ( ! isEmpty(this.props.floor) ) && <div><strong>Étage:</strong> <span>{this.props.floor}</span></div> }
					{ ( ! isEmpty(this.props.notes) ) && <div><strong>Information:</strong> <span>{this.props.notes}</span></div> }
				</div>
			</li>
		);
	}
}
Address.propTypes = {
	id			: PropTypes.number.isRequired,
	custId	: PropTypes.number.isRequired,
	street	: PropTypes.string.isRequired,
	number	: PropTypes.string.isRequired,
	postcode: PropTypes.string.isRequired,
	city		: PropTypes.string.isRequired,
	doorcode: PropTypes.string,
	floor		: PropTypes.string,
	note		: PropTypes.string,
	selected: PropTypes.bool,
	onClick	: PropTypes.func,
	onChange: PropTypes.func,
	location: PropTypes.string.isRequired,
};
Address.defaultProps = {
	selected: false,
};

export default Address;
