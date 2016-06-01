const express = require( 'express' );
const app = express();

const auth = require( '../routes/auth' );
const pets = require( '../routes/pets' );
const users = require( '../routes/users' );

const ensureAuth = require( './ensureAuth' );
const ensureRole = require( './ensureRole' );

const path = require( 'path' );
const publicDir = path.join( __dirname, '../public' );

const Grant = require( 'grant-express' );
const grantConfig = require( '../grant' );
const grant = new Grant( grantConfig );
const session = require( 'express-session' );

const isProd = process.env.NODE_ENV === 'production';

if ( isProd ) app.set('trust proxy', 1);

app.use( '/connect', session({ 
	secret: process.env.APP_SECRET, 
	resave: true, 
	saveUninitialized: true,
	cookie: { secure: isProd }
}));

app.use( grant );

app.use( express.static( publicDir ) );

app.use( '/auth', auth );
app.use( '/pets', ensureAuth, pets );
app.use( '/users', ensureAuth, ensureRole( 'admin' ), users );

app.use( ( err, req, res, next ) => {
	console.error( err );
	res
		.status( err.code || 500 )
		.json({ error: err.error || 'Server error' });
});

module.exports = app;