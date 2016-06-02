module.exports = function serverError( err, req, res, next ) {
	console.error( err );
	res.status( err.code || 500 ).json({ 
		error: err.error || 'Server error' 
	});
}