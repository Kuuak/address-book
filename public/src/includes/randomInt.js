/**
 * Getting a random integer between two values
 * The value is no lower than `min`, and is less than (but not equal to) `max`.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
 *
 * @version 1.0.0
 * @author Felipe Paul Martins <felipe.paulmartins@outlook.com>
 *
 * @param		int	min	The minimum value.
 * @param		int	max	The max value.
 * @return	int			Random int between min & max.
 */
export default function randomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min)) + min;
}
