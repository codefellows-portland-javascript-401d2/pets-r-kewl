const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const petSchema = new Schema({
	name: { 
		type: String, 
		required: true 
	},
	type: { 
		type: String, 
		default: 'bird' 
	}
});

petSchema.statics.query = function ( query, cb ) {
	const validated = {};
	if ( query.type ) validated.type = query.type;
	return this.model('Pet').find( query, cb );
};

module.exports = mongoose.model( 'Pet', petSchema );
