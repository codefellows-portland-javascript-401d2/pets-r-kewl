module.exports = function redirectToHttp( req, res, next ) {
	if ( req.header( 'x-forwarded-proto' ) == 'http' ) {
		return res.redirect( 301, `https://${process.env.HOST}${req.url}` );
	}
	next();
}