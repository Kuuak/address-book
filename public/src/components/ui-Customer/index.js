// Assets depedencies (Style & images)
import './index.css';

// APP settings
import config from '../../../../config';

// React
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';


// Components
import Preloader from 'components/ui-Preloader';

// Helpers
import isNull from 'lodash.isnull';
import isEmpty from 'lodash.isempty';

class Customer extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			gender			: null,
			firstname		: '',
			lastname		: '',
			email				: null,
			addresses		: [],
			selectedAddr: this.props.addr,
			showMap			: false,
			loadingMap	: false,
		};

		this.closeMap = this.closeMap.bind( this );
		this.handleChangeAddr = this.handleChangeAddr.bind( this );

		this.map = null;
		this.directionsService = null;
		this.directionsRenderer = null;
	}

	componentDidMount() {

		fetch( `/search/customer/${this.props.phone}/` )
			.then( res => res.json() )
			.then ( res => {
				if ( 1 === res.customers.length && !isEmpty(res.customers[0]) ) {
					this.setState( res.customers[0] );

					if ( ! isEmpty(this.state.selectedAddr) ) {
						this.changeAddr( this.state.selectedAddr );
					}
				}
			} );
	}

	handleChangeAddr( event ) {
		if ( this.state.selectedAddr !== event.target.value ) {
			this.changeAddr( event.target.value );
		}
	}

	initMap( addr ) {

		this.map = new google.maps.Map(document.getElementById('mapWrapper'), {
			center: config.map.latlng,
			zoom: config.map.zoom,
		});

		this.directionsService = new google.maps.DirectionsService;
		this.directionsRenderer = new google.maps.DirectionsRenderer();

		this.directionsRenderer.setMap( this.map );

		// Wait the init's end before to render direction
		this.map.idleListener = this.map.addListener( 'idle', () => {
			this.map.idleListener.remove(); // remove the event listener

			// Add new listener for when direction is rendered
			this.map.addListener( 'idle', () => this.setState({ loadingMap: false }) );

			// render the direction
			this.setMapDirection( addr );
		} );

	}

	changeAddr( addrId ) {

		let addr = this.state.addresses[addrId];

		if ( this.state.showMap ) {
			this.setMapDirection( addr );
		}
		else {
			setTimeout( () => {
				if ( isNull(this.map) ) {
					this.initMap( addr );
				}
				else {
					this.setMapDirection( addr );
				}
			}, 400 );
		}

		this.setState({
			showMap			: true,
			loadingMap	: true,
			selectedAddr: addrId,
		});
	}

	setMapDirection( addr ) {

		this.directionsService.route( {
			origin: config.map.address,
			destination: `${addr.street} ${addr.number},${addr.postcode} ${addr.city}`,
			travelMode: 'DRIVING',
			provideRouteAlternatives: true,
		}, (response, status) => {

			if (status === 'OK') {
				this.directionsRenderer.setDirections(response);
				this.setState({
					route: {
						duration: response.routes[0].legs[0].duration.text,
						distance: response.routes[0].legs[0].distance.text,
					}
				});
			}
			else {
				this.props.addAlerts( {
					icon		: 'error',
					status	: 'error',
					title		: 'Oups',
					message	: 'Une erreur est apparue lors du chargement de l\'itinéraire. Merci de contacter l\'administrateur si cela persiste.',
				} );
				this.setState({ loadingMap: false });
			}
		} );

	}

	closeMap() {

		document.getElementById(`addr_${this.state.selectedAddr}`).checked = false;

		this.setState({
			showMap: false,
			loadingMap: true,
			selectedAddr: 0,
			route: null,
		});

		setTimeout( () => this.setState({ loadingMap: false }), 400 );
	}

	render() {
		return (
			<div className="customer">
				<div className="customer-details">
					<div className="wrap">
						<h1>{ this.props.phone }</h1>
						<h2>
							{ `${this.state.firstname} ${this.state.lastname}`  }
							{ ( !isEmpty(this.state.gender) ) && <small>({( 'mr' === this.state.gender ? 'Monsieur' : 'Madame' )})</small> }
						</h2>
						{ !isEmpty(this.state.email) && <p className="email"><a href={`mailto:${this.state.email}`}>{ this.state.email }</a></p> }
						<h3>Adresses</h3>
						<ul className="addresses collection">{
							this.state.addresses.map( (addr, i) => (
								<li className="collection-item" key={i}>
									<address>
										<div>
											<span className="street">{addr.street}</span>&nbsp;
											<span className="number">{addr.number}</span>
										</div>
										<div>
											<span className="postcode">{addr.postcode}</span>&nbsp;
											<span className="city">{addr.city}</span>
										</div>
										{ ( ! isEmpty(addr.doorcode) ) && <div><strong>Code de porte</strong> : <span>{this.doorcode}</span></div> }
										{ ( ! isEmpty(addr.floor) ) && <div><strong>Étage</strong> : <span>{this.floor}</span></div> }
										{ ( ! isEmpty(addr.note) ) && <div><strong>information complémentaire</strong> : <span>{this.note}</span></div> }
										<div className="input-rdio">
											<input defaultChecked={ this.state.selectedAddr == i } type="radio" id={ `addr_${i}` } value={i} name="addr" onChange={ this.handleChangeAddr }/>
											<label htmlFor={ `addr_${i}` }><i htmlFor={ `addr_${i}` } className="material-icons tiny">local_shipping</i></label>
										</div>
									</address>
								</li>
							) )
						}</ul>
					</div>
				</div>
				<div className={ 'address-map'+ ( this.state.showMap ? ' open' : '' ) + ( this.state.loadingMap ? ' loading' : '' ) }>
					<CSSTransitionGroup component="div" transitionName="loading" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
						{ this.state.loadingMap && <div className="veil"></div> }
						{ this.state.loadingMap && <Preloader center={true} active={true} /> }
					</CSSTransitionGroup>
					<div id="mapWrapper" className="map-wrapper"></div>
					{ this.state.route && <i className="close-map material-icons small" onClick={ this.closeMap }>close</i> }
					{ this.state.route && <button className="btn red">{`Temps de trajet: ${this.state.route.duration} (${this.state.route.distance})`}</button> }
				</div>
			</div>
		);
	}
}
Customer.propTypes = {
	addr			: PropTypes.string,
	phone			: PropTypes.string.isRequired,
	addAlerts	: PropTypes.func.isRequired,
};

export default Customer;
