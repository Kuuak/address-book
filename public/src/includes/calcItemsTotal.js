/**
 * Round the given number to the scale wanted
 *
 * @param		{Number}	n				pass in any number
 * @param		{Number}	scale		Rounding wanted i.e. .05
 * @return	{Number}					Rounded number
 */
function roundToScale( n, scale ) {
	return Math.round(n / scale) * scale;
};

/**
 * Calculate total price of given items including extras
 *
 * @version 1.0.0
 *
 * @param		{array}		items			Items to calculate total price
 * @param		{int}			discount	Discount rate
 * @return	{object}						Total, subtotal and discount values
 */
export default function calcItemsTotal ( items, discountRate = 0 ) {
	let total			= 0,
			subtotal	= 0,
			discount	= 0;

	items.forEach( item => {
		let itemPrice = item.price;

		item.extras.forEach( extra => {
			if ( 'add' == extra.type ) { itemPrice += extra.price; }
			else { itemPrice -= extra.price; }
		} );

		subtotal += itemPrice;
	} );

	if ( 0 < discountRate ) {
		discount = roundToScale( subtotal * ( discountRate / 100 ), .05 );
		total = subtotal - discount;
	}
	else {
		total = subtotal;
	}

	return { total, subtotal, discount };
}
