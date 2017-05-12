// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Preloader from 'components/ui-Preloader';
import ResultCustomer from 'components/ui-ResultCustomer';

// Helpers
import isNil from 'lodash.isnil';

class Results extends React.Component {

	render() {
		return (
			<section className="results">
				<div className="local-results">
					<h2>Clients enregistrés</h2>
					<Preloader active={this.props.customers.loading} />
					<CSSTransitionGroup component="ul" className="customers" transitionName="appears" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{ this.props.customers.items && this.props.customers.items.map( (customer, i) => <ResultCustomer key={i} id={i} {...customer} /> ) }
					</CSSTransitionGroup>
				</div>
			</section>
		)
	}

}
export default Results;
