let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const snippetSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    codesnippet: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    language: {
        type: String,
        required: true
    },
    privacy: {
        type: String,
        required: true
    },
    tags: {
        type: Array
    },
    user: {
        type: String,
        required: true
    },
    authorname: {
        type: String,
        required: true
    }
},{timestamps: true});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = {
    Snippet: Snippet
};
