const chai = require( 'chai' );
const chaiHttp = require( 'chai-http' );
chai.use( chaiHttp );
const assert = chai.assert;

const mongoose = require( '../lib/mongoose-connect' );

const app = require( '../lib/app' );

describe( 'Pet API', () => {
	
	const request = chai.request( app );
	
	it( 'requires name -callback', done => {
		request.get( '/pets' )
			.then( pets => {
				assert.ok( pets.length > 1 );
				done();
			});
	});
	
});