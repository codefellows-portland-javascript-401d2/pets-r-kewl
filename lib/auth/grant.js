const Grant = require( 'grant-express' );
const session = require( 'express-session' );
const isProd = process.env.NODE_ENV === 'production';
const config = {
	server: {
		protocol: isProd ? 'https' : 'http',
		host: process.env.HOST
	},
	twitter: {
		key: process.env.TWITTER_CONSUMER_KEY,
		secret: process.env.TWITTER_CONSUMER_SECRET,
		callback: '/auth/twitter/callback'
	}
};


module.exports = function configure( app ) {
	
	const grant = new Grant( config );
	
	if ( isProd ) app.set('trust proxy', 1);
	
	app.use( '/connect', session({ 
		secret: process.env.APP_SECRET, 
		resave: true, 
		saveUninitialized: true,
		cookie: { secure: isProd }
	}));

	app.use( grant );
}