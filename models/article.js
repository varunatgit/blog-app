let mongoose = require('mongoose');

// article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: 1
    },
    author: {
        type: String,
        required: 1
    },
    body: {
        type: String,
        required: 1
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);