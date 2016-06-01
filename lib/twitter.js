const Twitter = require( 'twitter' );
const User = require( '../models/user' );

function getClient( userId ) {
	return User.findById( userId )
		.select( 'twitterProfile' )
		.lean()
		.then( ({ twitterProfile }) => {
			return new Twitter({
				consumer_key: process.env.TWITTER_CONSUMER_KEY,
				consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
				access_token_key: twitterProfile.access_token,
				access_token_secret: twitterProfile.access_secret
			});
		});
}

module.exports = {
	postTweet( userId, status ) {
		return getClient( userId )
			.then( client => {
				return new Promise( ( resolve, reject ) => {
					client.post( 'statuses/update', { status }, ( error, tweet ) => {
						if ( error ) reject( error );
						else resolve( tweet );
					});
				});
			});
	},
	getTweets( userId ) {
		return getClient( userId )
			.then( client => {
				return new Promise( ( resolve, reject ) => {
					client.get( 'statuses/user_timeline', ( error, tweets ) => {
						if ( error ) reject( error );
						else resolve( tweets );
					});
				});
			});		
	}
};