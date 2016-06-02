const jwt = require( 'jsonwebtoken' );
const sekrit = process.env.APP_SECRET;

module.exports = {
	sign ( user ) {
		return new Promise( ( resolve, reject ) => {
			
			jwt.sign({ 
				id: user.id,
				username: user.username,
				roles: user.roles  
			}, sekrit, null, ( err, token ) => {
				if ( err ) return reject( err );
				resolve( token );
			});
		
		});
	},
	
	verify ( token ) {
		
		if ( !token ) {
			return Promise.reject('no token provided');
		}
		
		return new Promise( ( resolve, reject ) => {
			jwt.verify( token, sekrit, ( err, payload ) => {
				if ( err ) return reject( 'invalid token' );
				resolve( payload );
			});
		});
	}
};