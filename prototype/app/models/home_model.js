var mongoose = require('mongoose');

Schema = mongoose.Schema;


homeSchema = new Schema({
	name: { type: String, required: true},
	administrator: {type : mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Home', homeSchema);