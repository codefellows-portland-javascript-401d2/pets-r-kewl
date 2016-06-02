const router = require( 'express' ).Router();
const jsonParser = require( 'body-parser' ).json();
const User = require( '../models/user' );
const token = require( '../lib/auth/token' );
const userAuth = require( '../lib/auth/userAuth' );

router.get( '/validate', userAuth, ( req, res ) => {
	res.json({ valid: true });
});

router.post('/signup', jsonParser, ( req, res, next ) => {
	const { username, password } = req.body;
	delete req.body.password;
	
	if ( !username || !password ) return next({ code: 400, error: 'Invalid request. Username and Password required' });
	
	User.findOne({ username }).count()
		.then( count => {
			if ( count ) throw { code: 400, error: 'username already exists' };
			
			const user = new User( req.body );
			user.generateHash( password );
			return user.save();
		})
		.then( user => token.sign( user ) )
		.then( token => res.json({ token }) )
		.catch( next );
});


router.get( '/twitter/callback', ( req, res, next ) => {
	
	const profile = req.query;
	const twitterId = profile.raw.user_id;
	
	User.findOne( { twitterId } )
		.then( user => {
			if ( user ) return user;
			return new User({
				username: profile.raw.screen_name,
				twitterId,
				twitterProfile: profile,
				roles: []
			}).save();
		})
		.then( user => token.sign( user ) )
		// this is browser page request, not an ajax callback
		// so we don't want to send a json response:
		// .then( token => res.json({ token }) )
		
		// instead send back html response with <script>
		// to set token in local storage and redirect client
		.then( token => res.send(
			`<script>
				window.localStorage.token='${token}';
				window.location.assign('/');
			 </script>`
		))
		.catch( next );
});

router.post('/signin', jsonParser, ( req, res, next ) => {
	const { username, password } = req.body;
	delete req.body;
	
	User.findOne({ username })
		.then( user => {
			if ( !user || !user.compareHash( password ) ) {
				throw { code: 400, error: 'invalid credentials' };
			}
			return token.sign( user );
		})
		.then( token => res.json({ token }) )
		.catch( next );
	
});

module.exports = router;