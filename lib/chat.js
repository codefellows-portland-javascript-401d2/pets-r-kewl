const IO = require( 'socket.io' );
const verifier = require( './auth/token' );

module.exports = function configure( http ) {
	
	const io = IO( http );
	
	const messages = [];
	const maxLength = 10;
	
	io.on( 'connection', socket => {
		
		console.log('a user connected');
		
		const timeout = setTimeout( () => {
			socket.conn.close();
		}, 5000 );
		
		socket.on( 'token', token => {
			
			verifier.verify( token )
				.then( user => {
					clearTimeout( timeout );
					socket.username = user.username;
					console.log( socket.username, 'joined' );
					
					socket.emit( 'messages', messages );
					
					socket.on( 'message', message => {
						message.user = socket.username;
						messages.push( message );
						if ( messages.length > maxLength ) messages.shift();
						io.emit( 'message', message );
					});
				})
				.catch( error => {
					socket.emit( 'invalid', error );
				});
		});
		
		
		socket.on('disconnect', () => {
			console.log('user disconnected');
		});
		
	});
};

