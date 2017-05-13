// Assets depedencies (Style & images)
import './index.css';

// React
import React from 'react';
import DebounceInput from 'react-debounce-input';

import isEmpty from 'lodash.isempty';

class SearchBar extends React.Component {

	constructor( props ) {
		super( props );

		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		document.getElementById('search_input').focus()
	}

	handleChange( event ) {
		this.props.onChange( event.target.value )
	}

	render() {
		return (
			<div className='search-bar'>
				<DebounceInput id="search_input" name="search-input" value={this.props.searchValue} placeholder='saisir un numéro' onChange={this.handleChange} debounceTimeout={500} />
			</div>
		)
	}
}
export default SearchBar;
