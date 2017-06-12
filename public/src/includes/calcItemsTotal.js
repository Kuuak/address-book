/**
 * Calculate total price of given items including extras
 *
 * @version 1.0.0
 *
 * @param		array		items		Items to calculate total price
 * @return	number					Total price
 */
export default function calcItemsTotal( items ) {
	let totalPrice = 0;

	items.forEach( item => {
		let itemPrice = item.price;

		item.extras.forEach( extra => {
			if ( 'add' == extra.type ) { itemPrice += extra.price; }
			else { itemPrice -= extra.price; }
		} );

		totalPrice += itemPrice;
	} );

	return totalPrice;
}
