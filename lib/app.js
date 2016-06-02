const express = require( 'express' );
const app = express();

const auth = require( '../routes/auth' );
const pets = require( '../routes/pets' );
const users = require( '../routes/users' );

const userAuth = require( './auth/userAuth' );
const hasRole = require( './auth/hasRole' );

const path = require( 'path' );
const publicDir = path.join( __dirname, '../public' );

require( './auth/grant' )( app );

app.use( express.static( publicDir ) );

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