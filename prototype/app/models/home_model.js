var mongoose = require('mongoose');

Schema = mongoose.Schema;


homeSchema = new Schema({
	name: { type: String, required: true},
	//administrator: {type : mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	administrator : { type: Number, ref: 'User'},
	users: [{ type : mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Home', homeSchema);