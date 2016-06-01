const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
chai.use( chaiHttp );
const assert = chai.assert;

const connection = require( '../lib/mongoose-connect' );

const app = require( '../lib/app' );

describe( 'Auth API', () => {
	
	const request = chai.request( app );
	
	before( done => {
		connection.on( 'open', ref => {
			connection.db.listCollections({ name: 'users' }).next(function(err, collinfo) {
				if (!collinfo) return done();
				connection.db.dropCollection( 'users', done );
			});
		});
	});
	
	const user = { username: 'user', password: 'abc' };
	
	it( 'signup a new user', done => {
		request.post( '/auth/signup' )
			.send( user )
			.then( res => {
				assert.isOk( res.body.token );
				done();
			})
			.catch( done );
	});
	
	it( 'error when signup same username', done => {
		request.post( '/auth/signup' )
			.send({ username: user.username, password: 'xyz' })
			.then( () => done( 'expected error' ) )
			.catch( err => {
				assert.equal( err.response.res.body.error, 'username already exists' );
				done();
			})
			.catch( done );
	});
	
	after( done => {
		connection.close( done );
	});
	
});