require('dotenv').config();
const express = require("express");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const globalRoutes = require('./routes/globalRoutes');

const app = express();
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get("/",async function(req, res){
  res.send('Server running on port 3000');
});

app.use('/global', globalRoutes);

app.listen(3000, function(){
  console.log("Server running on port 3000");
});