require( './lib/mongoose-connect' );

const app = require( './lib/app' );
const chat = require( './lib/chat' );
const port = process.env.PORT || 3000;
const http = require( 'http' );

const server = http.createServer( app );

chat( server );

server.listen( port );
server.on( 'listening', () => console.log( 'server listening:', server.address() ) );
server.on( 'error', err => console.error( `server error: ${err}` ) );