/**
 * Format the given timestamp to local (fr-CH) date and time (without seconds)
 *
 * @since 1.0.0
 *
 * @param		number	timestamp		Timestamp to convert to date & time format
 * @return	string							Date and time
 */
export default function formatDate( timestamp ) {
	let d = new Date( timestamp );
	return d.toLocaleDateString( 'fr-CH' ) +' '+ d.toLocaleTimeString( 'fr-CH' ).replace( /\:\d{2}$/, '' );
}
