const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/blogerDB", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

const blogSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
});

module.exports = mongoose.model('Globalblog', blogSchema);