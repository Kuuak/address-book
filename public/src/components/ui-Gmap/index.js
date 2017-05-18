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

class Gmap extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			dest: null,
			isLoading: true,
		};

		this.initMap					= this.initMap.bind( this );
		this.toggleLoading		= this.toggleLoading.bind( this );
		this.setMapDirection	= this.setMapDirection.bind( this );
	}

	componentDidMount() {
		this.map = null;
		this.directionsService = null;
		this.directionsRenderer = null;

		// Wait for the sidebar to be fully openend before to init the map
		setTimeout( this.initMap, 300 );
	}

	toggleLoading() {
		this.setState({ isLoading: ! this.state.isLoading })
	}

	initMap() {
		this.map = new google.maps.Map(document.getElementById('gmap'), {
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
			this.map.addListener( 'idle', this.toggleLoading );

			// render the direction
			this.setMapDirection();
		} );
	}
	setMapDirection() {
		this.directionsService.route( {
			origin: config.map.address,
			destination: `${this.props.addr.street} ${this.props.addr.number},${this.props.addr.postcode} ${this.props.addr.city}`,
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
				this.props.toggleLoading();
			}
		} );

	}

	render() {
		return (
			<div className="gmap-wrapper">
				<CSSTransitionGroup component="div" transitionName="loading" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
					{ this.state.isLoading && <div className="veil"></div> }
					{ this.state.isLoading && <Preloader center={true} active={true} /> }
				</CSSTransitionGroup>
				<div id="gmap" className="gmap"></div>
				{ this.state.dest && <button className="btn red">{`Temps de trajet: ${this.state.dest.duration} (${this.state.dest.distance})`}</button> }
			</div>
		);
	}
}
Gmap.propTypes = {
	addr			: PropTypes.object.isRequired,
	addAlerts	: PropTypes.func.isRequired,
};

export default Gmap;
