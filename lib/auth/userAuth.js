const verifier = require( './token' );

module.exports = function ensureAuth( req, res, next ) {
	const token = req.headers.token;
	// TODO: make query work:
	// || req.query && req.query.token;
	
	verifier.verify( token )
		.then( payload => {
			req.user = payload;
			next();
		})
		.catch( error => {
			next({ code: 403, error })
		});

};