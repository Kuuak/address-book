// Assets depedencies (Style & images)
import './card.css';

// React
import React from 'react';
import { Link, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Address from 'components/ui-Address';

// Helpers
import rmSlash from 'includes/rmSlash';
import isEmpty from 'lodash.isempty';
import isFunction from 'lodash.isfunction';

export default class CustomerCard extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			addresses	: [],
			loading		: false,
		};

		this.uniqueId = Date.now();

		this.handleClick = this.handleClick.bind( this );
		this.handleClickAddress = this.handleClickAddress.bind( this );
		this.handleChangeAddress = this.handleChangeAddress.bind( this );
	}

	componentDidMount() {
		this.getCustomer();
	}

	getCustomer( callback ) {

		if ( this.state.loading ) {
			return;
		}

		this.setState({ loading: true });

		fetch( `/customer/${this.props.id}/`, { headers: new Headers({ 'Accept': 'application/json' }) } )
			.then( res => res.json() )
			.then ( res => {

				if ( res.alerts ) {
					this.props.addAlerts( res.alerts );
				}

				if ( res.success ) {
					this.setState( Object.assign(res.customer, { loading: false }) );

					if ( isFunction(callback) ) {
						callback();
					}
				}
			} );
	}

	handleClick( event ) {
		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( event, this.props.id );
		}
	}
	handleClickAddress( event, addrId ) {
		if ( isFunction( this.props.onClick ) ) {
			this.props.onClick( event, this.props.id, addrId );
		}
	}
	handleChangeAddress( event, addrId ) {
		if ( isFunction( this.props.onChange ) ) {
			this.props.onChange( event, this.props.id, addrId );
		}
	}

	render() {
		return (
			<div className={ 'customer-card card'+ ( this.state.loading ? ' loading' : '' ) }>
				<div className="card-content">
					<h1 className="card-title">{ this.state.phone }</h1>
					<h2>
						{ `${this.state.firstname} ${this.state.lastname}`  }
						<small> ({( 'mr' === this.state.gender ? 'Monsieur' : 'Madame' )})</small>
					</h2>
					{ !isEmpty(this.state.email) && <p className="email"><a href={`mailto:${this.state.email}`}>{ this.state.email }</a></p> }
					<h3>Adresses</h3>
					<CSSTransitionGroup component="ul" className="addresses collection" transitionName={{ enter: 'add', leave: 'delete' }} transitionEnterTimeout={300} transitionLeaveTimeout={300}>
						{ this.state.addresses.map( (addr) => <Address key={addr.id} custId={this.props.id} {...addr} selected={ addr.id == this.props.addrId } location={ this.props.location } onClick={ this.handleClickAddress } onChange={ this.handleChangeAddress } uniqueId={ this.uniqueId }/> ) }
					</CSSTransitionGroup>
				</div>
				<div className="card-action">
					<Link to={ `${rmSlash(this.props.location)}/edit` } rel="edit" onClick={ this.handleClick } >Modifier</Link>
					<Link to={ `${rmSlash(this.props.location)}/address/add/` } rel="add" onClick={ this.handleClick } >Ajouter une adresse</Link>
					<Route path="/customer/:custId" render={ () => ( <Link to={ `${rmSlash(this.props.location)}/delete/` } rel="delete" onClick={ this.handleClick } className="red-text right" >Supprimer</Link> ) } />
				</div>
			</div>
		);
	}
}
CustomerCard.propTypes = {
	id				: PropTypes.number.isRequired,
	addrId		: PropTypes.number,
	onClick		: PropTypes.func,
	onChange	: PropTypes.func,
	location	: PropTypes.string.isRequired,
	addAlerts	: PropTypes.func.isRequired,
};
