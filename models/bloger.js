const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLoaclMongoose = require('passport-local-mongoose');

const blogerSchema = new Schema({
    fname: String,
    lname: String,
    blogs: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
});

blogerSchema.plugin(passportLoaclMongoose, { usernameField: 'blogername' });

module.exports = mongoose.model("Bloger", blogerSchema);
