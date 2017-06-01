// Assets depedencies (Style & images)
import './index.css';

// APP settings
import config from '../../../../config';

// React
import React from 'react'
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Preloader from 'components/ui-Preloader';

// Helpers
import isEmpty from 'lodash.isempty';

export default class Gmap extends React.Component {

	constructor( props ) {
		super( props );

		this.uniqueId = Date.now();

		this.state = {
			dest: null,
			isLoading: true,
		};

		this.initMap					= this.initMap.bind( this );
		this.setMapDirection	= this.setMapDirection.bind( this );
	}

	componentDidMount() {
		this.map = null;
		this.directionsService = null;
		this.directionsRenderer = null;

		// Wait for the sidebar to be fully openend before to init the map
		setTimeout( this.initMap, 300 );
	}

	componentDidUpdate( prevProps ) {

		// Update directions only if destination address has changed
		if ( prevProps.addrId !== this.props.addrId ) {
			this.setState({ isLoading: true })
			this.setMapDirection();
		}
	}

	initMap() {
		this.map = new google.maps.Map(document.getElementById( `gmap_${this.uniqueId}` ), {
			center: config.map.latlng,
			zoom: config.map.zoom,
		});

		this.directionsService = new google.maps.DirectionsService;
		this.directionsRenderer = new google.maps.DirectionsRenderer();

		this.directionsRenderer.setMap( this.map );

		// Wait the init's end before to render direction
		this.map.idleListener = this.map.addListener( 'idle', () => {

			// remove the current event listener
			this.map.idleListener.remove();

			// Add new listener for when direction is rendered
			this.map.addListener( 'idle', () => this.setState({ isLoading: false }) );

			// render the direction
			this.setMapDirection();
		} );
	}
	setMapDirection() {
		fetch( `/customer/${this.props.custId}/address/${this.props.addrId}/`, { headers: new Headers({ 'Accept': 'application/json' }) } )
			.then( res => res.json() )
			.then( res => {

				if ( ! isEmpty(res.alerts) ) {
					this.addAlerts( res.alerts );
				}

				if ( res.success ) {
					this.directionsService.route( {
						origin: `${config.address.street} ${config.address.number}, ${config.address.postcode} ${config.address.city}, ${config.address.country}`,
						destination: `${res.address.street} ${res.address.number}, ${res.address.postcode} ${res.address.city}`,
						travelMode: 'DRIVING',
						provideRouteAlternatives: true,
					}, (response, status) => {

						if (status === 'OK') {
							this.directionsRenderer.setDirections(response);
							this.setState({
								dest: {
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
							this.setState({ isLoading: false });
						}
					} );
				}
				else {
					this.setState({ isLoading: false });
				}
			});
	}

	render() {
		return (
			<div className={`gmap-wrapper`+ ( this.state.isLoading ? ' loading' : '' ) }>
				<CSSTransitionGroup component="div" transitionName="loading" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
					{ this.state.isLoading && <div className="veil"></div> }
					{ this.state.isLoading && <Preloader center={true} active={true} /> }
				</CSSTransitionGroup>
				<div id={ `gmap_${this.uniqueId}` } className="gmap"></div>
				{ this.state.dest && <div className="chip blue darken-3 white-text">{`Trajet: ${this.state.dest.duration.replace('minutes', 'min')} (${this.state.dest.distance})`}</div> }
			</div>
		);
	}
}
Gmap.propTypes = {
	custId		: PropTypes.number.isRequired,
	addrId		: PropTypes.number.isRequired,
	addAlerts	: PropTypes.func.isRequired,
};
