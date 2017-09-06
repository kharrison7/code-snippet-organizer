let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const snippetSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    notes: {
        type: String
    },
    lang: {
        type: String,
        required: true
    },
    privacy: {
        type: String,
        default: true
    },
    tags: {
        type: Array
    },
    user: {
        type: String,
        required: true
    }
},{timestamps: true});

const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = {
    Snippet: Snippet
};
