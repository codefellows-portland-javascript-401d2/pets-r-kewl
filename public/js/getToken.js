function getToken( request ) {
	
	return new Promise( ( resolve, reject ) => {
		
		const token = localStorage.token;
		if ( !token ) reject( 'no token found' );
		else {
			request.get( '/auth/validate')
				.set( 'token', token )
				.end( function( err ) {
					if ( err ) reject( 'invalid token' );
					else resolve( token );
				});
		}
	});
	
}