const tokenChecker = require( './token' );

module.exports = function ensureAuth( req, res, next ) {
	const token = req.headers.token || req.query.token;

	//TODO: make query work
		
	if ( !token ) {
		return next({ code: 403, error: 'no token provided' });
	}
	
	tokenChecker.verify( token )
		.then( payload => {
			req.user = payload;
			next();
		})
		.catch( () => {
			next({ code: 403, error: 'invalid token' });
		});
	
};