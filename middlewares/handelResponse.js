export const handelResponse = (
	res,
	status,
	success = true,
	message,
	data = null
) => {
	res.status(status).json({
		success,
		message,
		data,
	});
};
