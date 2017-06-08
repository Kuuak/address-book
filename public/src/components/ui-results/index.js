// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

// Components
import Preloader from 'components/ui-Preloader';
import ResultCustomer from 'components/ui-ResultCustomer';
import ResultSuggestion from 'components/ui-ResultSuggestion';

// Helpers
import isNil from 'lodash.isnil';

export default class Results extends React.Component {

	render() {
		return (
			<section className={'results' + ( !this.props.suggestions.items.length ? ' no-suggestions' : '' ) }>
				<div className="local-results">
					<h2>Clients enregistrés</h2>
					<Preloader active={this.props.customers.loading} />
					<CSSTransitionGroup component="ul" className="customers" transitionName="appears" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{ this.props.customers.items && this.props.customers.items.map( (customer, i) => <ResultCustomer key={customer._id} id={i} {...customer} /> ) }
					</CSSTransitionGroup>
				</div>
				<div className="remote-results">
					<h2>
						Suggestions
						{ !isNil(this.props.suggestions.totalResults) && <span className="new badge"><strong>{this.props.suggestions.totalResults}</strong> résultat{ ( 1 < this.props.suggestions.totalResults ? 's' : '' ) }</span> }
					</h2>
					<Preloader active={this.props.suggestions.loading} />
					<CSSTransitionGroup component="ul" className="suggestions" transitionName="appears" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
						{ this.props.suggestions.items && this.props.suggestions.items.map( (suggestion, i) => <ResultSuggestion key={i} id={i} {...suggestion}/>) }
					</CSSTransitionGroup>
				</div>
			</section>
		)
	}

}
