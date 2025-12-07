export const authorizeRoles = (...allowedRoles) => {
	return (req, res, next) => {
		const user = req.user;

		if (!user) {
			return res.status(401).json({
				success: false,
				message: 'Unauthorized: User not found',
			});
		}

		if (!allowedRoles.includes(user.role)) {
			return res.status(403).json({
				success: false,
				message: 'Forbidden: You are not allowed to access this route',
			});
		}

		next();
	};
};
