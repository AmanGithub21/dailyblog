const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const dbUrl = process.env.DB_URL;
const dbUrl = "mongodb://localhost:27017/blogerDB";
mongoose.connect(dbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

const globalblogSchema = Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
});

module.exports = mongoose.model('Globalblog', globalblogSchema);