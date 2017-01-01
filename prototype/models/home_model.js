var mangoose = require('mongoose');

Schema = mangoose.Schema;


homeSchema = new Schema({
	name: String
});

module.exports = mangoose.model('Home', homeSchema);