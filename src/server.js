var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Table = require('../api/models/amortizationScheduleModel'); //created model loading here

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tabledb', { useNewUrlParser: true }); 

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

var routes = require('../api/routes/amortizationScheduleRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Amortization schedule RESTful API server started on: ' + port);