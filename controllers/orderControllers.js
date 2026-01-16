import SSLCommerzPayment from 'sslcommerz-lts';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { getSingleAddressModel } from '../models/addressModel.js';
import { clearCartByUserId, getAllCartModel } from '../models/cartModel.js';
import {
	addProductIntoOrderItems,
	createOrderModel,
	getAllOrderByUserModel,
	getAllOrderForAdminModal,
	getAllOrderItemModel,
	getOrderByIdModel,
	getOrderByOrderNumberModal,
	getOrderByTransactionId,
	getOrderItemsByOrderId,
	getSingleOrderModel,
	updateOrderPaymentStatus,
	updateOrderStatusModal,
	updateOrderTransactionId,
} from '../models/orderModel.js';
import { decreaseProductStock } from '../models/productsModel.js';

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
		shipping_email: address.email,
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
			item.price,
			item.name,
			item.sku,
			item.image
		);
	}

	const data = { order_id, order_number };

	handelResponse(res, 200, true, 'Order created successfully', data);
});

export const createPayment = catchAsyncError(async (req, res, next) => {
	const { order_id } = req.params;

	const order = await getSingleOrderModel(order_id);

	if (!order) return next(new ErrorHandler('Order not found', 404));

	const tran_id = `TXN-BD-${Date.now()}-${Math.random()
		.toString(36)
		.substr(2, 6)
		.toUpperCase()}`;

	await updateOrderTransactionId(order_id, tran_id);

	const store_id = process.env.SSLCOMMERZ_STORE_ID;
	const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;
	const is_live = false;

	const data = {
		total_amount: Number(order.total_amount),
		currency: 'BDT',
		tran_id: tran_id,
		success_url: 'http://localhost:5000/api/v1/order/payment_success',
		fail_url: 'http://localhost:5000/payment-fail',
		cancel_url: 'http://localhost:5000/payment-cancel',
		cus_name: `${order.shipping_first_name} ${order.shipping_last_name}`,
		cus_email: order.shipping_email,
		cus_add1: order.shipping_address,
		cus_city: order.shipping_city,
		cus_postcode: order.shipping_postal_code,
		cus_country: order.shipping_country,
		cus_phone: order.shipping_phone,
		ship_name: 'Customer Name',
		ship_add1: 'Dhaka',
		ship_add2: 'Dhaka',
		ship_city: 'Dhaka',
		ship_state: 'Dhaka',
		ship_postcode: 1000,
		ship_country: 'Bangladesh',
		product_name: 'Your Products',
		product_category: 'E-commerce',
		product_profile: 'general',
		shipping_method: 'Courier',
	};

	const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

	const apiResponse = await sslcz.init(data);

	if (!apiResponse?.GatewayPageURL) {
		return next(new ErrorHandler('Failed to initiate payment', 500));
	}

	res.status(200).json({
		success: true,
		payment_url: apiResponse.GatewayPageURL,
	});
});

export const paymentSuccess = catchAsyncError(async (req, res, next) => {
	try {
		const { tran_id, val_id } = req.body;

		if (!tran_id || !val_id) {
			return next(new ErrorHandler('Invalid payment data', 400));
		}

		const store_id = process.env.SSLCOMMERZ_STORE_ID;
		const store_passwd = process.env.SSLCOMMERZ_STORE_PASS;

		const verifyUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

		const response = await fetch(verifyUrl);
		const paymentData = await response.json();

		if (paymentData.status !== 'VALID') {
			return next(new ErrorHandler('Payment not valid', 400));
		}

		const order = await getOrderByTransactionId(tran_id);

		if (!order) {
			return next(new ErrorHandler('Order not found', 404));
		}

		if (order.status === 'paid') {
			return handelResponse(res, 200, true, 'Already processed');
		}

		await updateOrderPaymentStatus({
			orderId: order.id,
			payment_status: 'paid',
			payment_method: paymentData.card_type,
			bank_tran_id: paymentData.bank_tran_id,
		});

		const items = await getOrderItemsByOrderId(order.id);

		for (let item of items) {
			await decreaseProductStock(item.product_id, item.quantity);
		}

		await clearCartByUserId(order.user_id);

		res.redirect(`${process.env.FRONTEND_URL}/thanks-you?order_id=${order.id}`);
	} catch (error) {
		return next(new ErrorHandler(error.message, 400));
	}
});

export const getOrderById = catchAsyncError(async (req, res, next) => {
	const { order_id } = req.params;

	const result = await getOrderByIdModel(order_id);

	if (result) {
		handelResponse(res, 200, true, 'Get order info', result);
	}
});

export const getAllOrderByUser = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;

	const orders = await getAllOrderByUserModel(user_id);

	if (orders) {
		handelResponse(res, 200, true, 'Get all order.', orders);
	}
});

export const getAllOrderItem = catchAsyncError(async (req, res, next) => {
	const { order_id } = req.params;

	const orderItems = await getAllOrderItemModel(order_id);

	if (orderItems) {
		handelResponse(res, 200, true, 'Get all order item.', orderItems);
	}
});

export const getOrderByOrderNumber = catchAsyncError(async (req, res, next) => {
	const { orderNumber } = req.params;

	const order = await getOrderByOrderNumberModal(orderNumber);

	if (order) {
		handelResponse(res, 200, true, 'Get order', order);
	}
});

// for admin

export const getAllOrderForAdmin = catchAsyncError(async (req, res, next) => {
	const result = await getAllOrderForAdminModal();

	if (result) {
		handelResponse(res, 200, true, 'Get all Order', result);
	}
});

export const updateOrderStatus = catchAsyncError(async (req, res, next) => {
	const { orderId } = req.params;
	const { status } = req.body;

	console.log(status);

	if (!orderId || !status) {
		return next(new ErrorHandler('All input needed', 400));
	}

	const result = await updateOrderStatusModal(orderId, status);

	if (result) {
		handelResponse(res, 200, true, 'Order status changed.');
	}
});
