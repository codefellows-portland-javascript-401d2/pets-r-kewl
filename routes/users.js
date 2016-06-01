const router = require( 'express' ).Router();
const User = require( '../models/user' );
const twitter = require( '../lib/twitter' );

router
	.get( '/:userId/tweets', ( req, res, next ) => {
		twitter.getTweets( req.user.id )
			.then( tweets => res.json( tweets ) )
			.catch( next );	
	})
	.post( '/:userId/roles/:role', ( req, res ) => {
		User.findById( req.params.userId )
			.then( user => {
				if ( !user ){
					throw { error: 'no user by that id' };
				}
				
				const role = req.params.role;
				if ( user.roles.indexOf( role ) !== -1 ) {
					return user;
				}
				else {
					user.roles.push( role );
					return user.save();
				}
			})
			.then( user => {
				res.json({
					id: user.id,
					roles: user.roles
				});
			})
			.catch( err => {
				res.status(500).json({
					msg: 'user role add fail',
					error: err
				});
			});
	});
	
	
module.exports = router;