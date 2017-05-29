/**
 * Convert a FormData object into a x-www-form-urlencoded string to send in the HTTP body
 * @see https://developer.mozilla.org/en-US/docs/Learn/HTML/Forms/Sending_forms_through_JavaScript#Building_an_XMLHttpRequest_manually
 *
 * @version 1.0.0
 * @author Felipe Paul Martins <felipe.paulmartins@outlook.com>
 *
 * @param		FormData object		formData	The FormData to convert.
 * @return	string											The form-urlencoded string.
 */
export default function formData2UrlEncoded( formData ) {

	let urlEncodedData = "",
			urlEncodedDataPairs = [];

	// Turn the data object into an array of URL-encoded key/value pairs.
	for ( let pair of formData.entries() ) {
		urlEncodedDataPairs.push( encodeURIComponent(pair[0]) + '=' + encodeURIComponent(pair[1]) );
	}

	// Combine the pairs into a single string and replace all %-encoded spaces to
	// the '+' character; matches the behaviour of browser form submissions.
	urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

	return urlEncodedData;
}
