/**
 * Remove the trailing slash if present
 *
 * @version 1.0.0
 * @author Felipe Paul Martins <felipe.paulmartins@outlook.com>
 *
 * @param		string	str		The string to remove the slash
 * @return	string
 */
export default function rmSlash( str ) {
	return str.replace(/\/$/, "");
}
