module.exports = function ensureRole( role ) {
	
	return function( req, res, next ) {
		if ( req.user.roles.indexOf( role ) !== -1 ) {
			next();
		}
		else {
			next({ code: 403, error: 'not authorized' });
		}
	};
	
};