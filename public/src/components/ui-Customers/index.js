// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Preloader from 'components/ui-Preloader';
import ResultCustomer from 'components/ui-ResultCustomer';

// Helpers
import isEmpty from 'lodash.isempty';

export default class Customers extends React.Component {

	constructor( props ) {
		super(props);

		this.state = {
			loading: true,
			customers: [],
		};
	}

	componentDidMount() {
		fetch( '/search/customer/' )
			.then( res => res.json() )
			.then( res => {
				this.setState({
					loading: false,
					customers: res.customers,
				})
			} );
	}

	render() {
		return (
			<div className="customer-all">
				<h1>Tous les clients</h1>
				<Preloader active={this.state.loading} />
				<CSSTransitionGroup component="ul" className="customers" transitionName="appears" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
					{ this.state.customers && this.state.customers.map( (customer, i) => <ResultCustomer key={i} id={i} {...customer} /> ) }
				</CSSTransitionGroup>
			</div>
		);
	}
}
