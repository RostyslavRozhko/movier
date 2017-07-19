// The Film model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var filmSchema = new Schema({
    _id: Number,
    _title: String,
    _title_original: String,
    _poster: String,
    _year: Number,
    _country: [String],
    _genre: [String],
    _director: [Number],
    _actors: [Number]
});

module.exports = mongoose.model('Film', filmSchema);
