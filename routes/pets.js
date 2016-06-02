const router = require( 'express' ).Router();
const bodyParser = require( 'body-parser' ).json();
const Pet = require( '../models/pet' );
const Type = require( '../models/type' );

const twitter = require( '../lib/twitter' );

var byId = ( req ) => ({_id: req.params.id});

router
	.get( '/', ( req, res, next ) => {
		Pet.query( req.query ).select( 'name type' )
			.lean()
			.then( pets => res.json( pets ) );
	})
	.get( '/types', ( req, res, next ) => {
		Type.find().lean()
			.then( types => {
				const hash = types.reduce( ( obj, type ) => {
					obj[type._id] = type.name;
					return obj;
				}, {});
				res.json( hash ) 
			})
			.catch( next );
	})
	.get( '/:id', ( req, res, next ) => {
		Pet.findById( req.params.id )
			.lean()
			.then( pets => res.json( pets ) )
			.catch( next );
	})
	.delete( '/:id', ( req, res, next ) => {
		Pet.findByIdAndRemove( req.params.id )
			.then( result => res.json( result ) )
			.catch( next );
	})
	.put( '/:id', bodyParser, ( req, res, next ) => {
		Pet.findOneAndUpdate( byId( req ), { $set: req.body }, { new: true } )
			.then( pet => res.json( pet ) )
			.catch( next );
	})
	.post( '/', bodyParser, ( req, res, next ) => {
		new Pet( req.body ).save()
			.then( pet => res.send( pet ) )
			.catch( next );
	});
	
module.exports = router;