const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
	first_name:String,
	last_name:String,
	email:String,
	password:String,
	phone:String,
	news_letter:String
});

module.exports = mongoose.model('Student', StudentSchema);