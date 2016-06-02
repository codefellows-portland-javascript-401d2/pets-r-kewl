const express = require( 'express' );
const app = express();

const redirectToHttps = require( './redirectToHttps' );
if ( process.env.NODE_ENV === 'production' ) {
	app.use( redirectToHttps );
}

require( './auth/grant' )( app );

const userAuth = require( './auth/userAuth' );
const hasRole = require( './auth/hasRole' );

const auth = require( '../routes/auth' );
const pets = require( '../routes/pets' );
const users = require( '../routes/users' );

app.use( '/auth', auth );
app.use( '/pets', userAuth, pets );
app.use( '/users', userAuth, hasRole( 'admin' ), users );

const path = require( 'path' );
const publicDir = path.join( __dirname, '../public' );
app.use( express.static( publicDir ) );

const serverError = require( './serverError' );
app.use( serverError );

module.exports = app;