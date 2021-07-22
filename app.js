require('dotenv').config();
const express = require("express");
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const globalRoutes = require('./routes/globalRoutes');
const homeRoutes = require('./routes/homeRoutes');
const blogerRoutes = require('./routes/blogerRoutes');
const ExpressError = require('./utility/ExpressError');

const app = express();
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.use('/global', globalRoutes);
app.use('/bloger/:blogername', blogerRoutes);
app.use('/', homeRoutes);

app.all('*', function(req, res, next) {
  next(new ExpressError(404, 'Page Not Found'));
})

app.use(function(err, req, res, next){
  const { statusCode = 500, message} = err;
  if(!message) {
    err.message = 'Something is not right. Sorry!';
  }
  res.status(statusCode).send(message);
});

app.listen(3000, function(){
  console.log("Server running on port 3000");
});