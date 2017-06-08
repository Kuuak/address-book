// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import DebounceInput from 'react-debounce-input';

// Helpers
import isEmpty from 'lodash.isempty';
import formatPhone from 'includes/formatPhone';

export default class SearchBar extends React.Component {

	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind(this);
		this.handleClickClear = this.handleClickClear.bind(this);
	}

	componentDidMount() {
		document.getElementById('search_input').focus()
	}

	handleChange( event ) {
		this.props.onChange( event.target.value.replace( /\D/g, '' ) );
	}

	handleClickClear() {
		this.props.onChange( '' );
	}

	render() {
		return (
			<div className="search-bar">
				<DebounceInput id="search_input" name="search-input" value={ formatPhone(this.props.searchValue) } placeholder='saisir un numéro' onChange={this.handleChange} debounceTimeout={500} />
				<button className={ 'clear-input material-icons'+ ( isEmpty(this.props.searchValue) ? '' : ' show' ) } onClick={ this.handleClickClear }>backspace</button>
			</div>
		)
	}
}
