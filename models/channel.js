// The Channel model

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let channelSchema = new Schema({
    _id: String,
    _email: String, //for access recovering
    _password: String,
    _name: String,
    _image: String,
    _lists: [{ type: Schema.Types.ObjectId, ref: 'List' }],
    _saved_lists: [{ type: Schema.Types.ObjectId, ref: 'List' }]
});

module.exports = mongoose.model('Channel', channelSchema);
