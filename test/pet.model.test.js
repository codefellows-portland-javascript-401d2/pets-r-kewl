const Pet = require( '../models/pet' );

describe( 'Pet model', () => {
	
	it( 'requires name -callback', done => {
		const pet = new Pet();
		pet.validate( err => {
			if ( !err ) done( 'expected validation error' );
			else done();
		});
	});
	
	it( 'requires name -promise', done => {
		const pet = new Pet();
		pet.validate()
			.then( () => done( 'expected validation error' ) )
			.catch( () => done() );
	});
	
	it( 'validates with required fields', done => {
		const pet = new Pet({ name: 'foo' });
		pet.validate()
			.then( done )
			.catch( done );
	});
});