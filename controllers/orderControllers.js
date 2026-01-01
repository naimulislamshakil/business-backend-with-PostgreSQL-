import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { getSingleAddressModel } from '../models/addressModel.js';
import { getAllCartModel } from '../models/cartModel.js';
import {
	addProductIntoOrderItems,
	createOrderModel,
} from '../models/orderModel.js';

const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;
const is_live = false;

export const makeOrder = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { shipping_address_id, payment_method } = req.body;

	const address = await getSingleAddressModel(shipping_address_id, user_id);

	const items = await getAllCartModel(user_id);

	const order_number = `ORD-BD-${Date.now()}-${Math.random()
		.toString(36)
		.substr(2, 6)
		.toUpperCase()}`;

	const subtotal = items
		.reduce((total, item) => {
			return total + item.quantity * parseFloat(item.price);
		}, 0)
		.toFixed(2);
	let shipping_cost = 0;

	if (address.city === 'Dhaka') {
		shipping_cost = 60.0;
	} else {
		shipping_cost = 120.0;
	}

	const tax = subtotal * 0.12;

	const total_amount = Number(subtotal) + Number(shipping_cost) + Number(tax);

	const result = await createOrderModel({
		order_number,
		user_id,
		subtotal,
		shipping_cost,
		tax,
		total_amount,
		payment_method,
		shipping_first_name: address.first_name,
		shipping_last_name: address.last_name,
		shipping_phone: address.phone,
		shipping_address: address.address,
		shipping_city: address.city,
		shipping_postal_code: address.postal_code,
		shipping_country: address.country,
	});

	const order_id = result.id;

	for (let item of items) {
		await addProductIntoOrderItems(
			order_id,
			item.product_id,
			item.color,
			item.quantity,
			item.price
		);
	}

	const data = { order_id, order_number };

	handelResponse(res, 200, true, 'Order created successfully', data);

	// const tran_id = `TXN-BD-${Date.now()}-${Math.random()
	// 	.toString(36)
	// 	.substr(2, 6)
	// 	.toUpperCase()}`;
	// const data = {
	// 	total_amount: 100,
	// 	currency: 'BDT',
	// 	tran_id: tran_id, // use unique tran_id for each api call
	// 	success_url: 'http://localhost:3030/success',
	// 	fail_url: 'http://localhost:3030/fail',
	// 	cancel_url: 'http://localhost:3030/cancel',
	// 	ipn_url: 'http://localhost:3030/ipn',
	// 	shipping_method: 'Courier',
	// 	product_name: 'Computer.',
	// 	product_category: 'Electronic',
	// 	product_profile: 'general',
	// 	cus_name: 'Customer Name',
	// 	cus_email: 'customer@example.com',
	// 	cus_add1: 'Dhaka',
	// 	cus_add2: 'Dhaka',
	// 	cus_city: 'Dhaka',
	// 	cus_state: 'Dhaka',
	// 	cus_postcode: '1000',
	// 	cus_country: 'Bangladesh',
	// 	cus_phone: '01711111111',
	// 	cus_fax: '01711111111',
	// 	ship_name: 'Customer Name',
	// 	ship_add1: 'Dhaka',
	// 	ship_add2: 'Dhaka',
	// 	ship_city: 'Dhaka',
	// 	ship_state: 'Dhaka',
	// 	ship_postcode: 1000,
	// 	ship_country: 'Bangladesh',
	// };
	// console.log(data);
});
