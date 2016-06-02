const express = require( 'express' );
const app = express();

if ( process.env.NODE_ENV === 'production' ) {
	app.use( ( req, res, next ) => {
		if ( req.header( 'x-forwarded-proto' ) == 'http' ) {
			return res.redirect( 301, `https://${process.env.HOST}${req.url}` );
		}
		next();
	});
}

require( './auth/grant' )( app );

const path = require( 'path' );
const publicDir = path.join( __dirname, '../public' );
app.use( express.static( publicDir ) );

const userAuth = require( './auth/userAuth' );
const hasRole = require( './auth/hasRole' );

const auth = require( '../routes/auth' );
const pets = require( '../routes/pets' );
const users = require( '../routes/users' );

app.use( '/auth', auth );
app.use( '/pets', userAuth, pets );
app.use( '/users', userAuth, hasRole( 'admin' ), users );

app.use( ( err, req, res, next ) => {
	console.error( err );
	res
		.status( err.code || 500 )
		.json({ error: err.error || 'Server error' });
});

module.exports = app;