const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = Schema({
    title: String,
    content: String,
    bloger: {
        type: Schema.Types.ObjectId,
        ref: 'Bloger',
    }
});

module.exports = mongoose.model('Blog', blogSchema);