/**
 * Format the given price number into the Swiss format
 *
 * @version 1.0.0
 * @author Felipe Paul Martins <felipe.paulmartins@outlook.com>
 *
 * @param		string	price		The string to format
 * @return	string
 */
export default function formatPrice( price ) {
	price = price || '';

	let formated = price.replace( /\D/, '' );

	if ( 2 < formated.length ) {
		const decimal = formated.slice(-2);
		formated = formated.slice( 0, formated.length-decimal.length ) +'.'+ decimal;
	}

	return formated;
}
