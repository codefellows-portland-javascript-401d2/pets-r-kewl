const IO = require( 'socket.io' );
const userAuth = require( './auth/userAuth' );

module.exports = function listen( http ) {
	const io = IO( http );
	
	// io.use(function(socket, next){
	// 	userAuth( socket.request, null, err => {
	// 		if (!err) next();
	// 		else next( new Error( 'Authentication error' ) );
	// 	});
	// });
	
	io.on('connection', function( socket ){
		console.log('a user connected');
		socket.on('disconnect', function(){
			console.log('user disconnected');
		});
	});
};

