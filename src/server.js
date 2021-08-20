var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Table = require('../api/models/createTableModel'); //created model loading here
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tabledb', { useNewUrlParser: true }); 


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


var routes = require('../api/routes/createTableRoutes'); //importing route
routes(app); //register the route

app.listen(port);

console.log('Amortization schedule RESTful API server started on: ' + port);

let tax, n_periodo, pv;  //inputs
let pmt;  //output

tax = 0.0056541;
n_periodo = 120;
pv = 120000;

function getUserInput(){
}

function calculaParcela(){
  return pv*(tax*Math.pow(1+tax, n_periodo))/(Math.pow(1+tax, n_periodo)-1);
}

function main(){
  pmt = calculaParcela();
  console.log(pmt);
}