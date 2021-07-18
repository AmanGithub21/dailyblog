const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogerSchema = new Schema({
    blogername: String,
    fname: String,
    lname: String,
    password: String,
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

module.exports = mongoose.model("Bloger", blogerSchema);
