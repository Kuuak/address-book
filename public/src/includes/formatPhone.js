/**
 * Format the given phone number into the Swiss format
 * @see http://jsfiddle.net/kaleb/Dm4Jv/
 *
 * @version 1.0.0
 * @author Felipe Paul Martins <felipe.paulmartins@outlook.com>
 *
 * @param		string	phone		The string to format
 * @return	string
 */
export default function formatPhone( phone ) {
	const numbers = phone.replace(/\D/g, ''),
				char = { 3:' ', 6:' ', 8:' ' };

	let formated = '';

	for (var i = 0; i < numbers.length; i++) {
		formated += ( char[i] || '' ) + numbers[i];
	}

	return formated;
}
