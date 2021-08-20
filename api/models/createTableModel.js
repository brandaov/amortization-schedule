'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TableSchema = new Schema({
  pv: {
    type: Number,
    required: 'Entre com o valor de financiamento'
  },
  tax: {
    type: Number,
    required: 'Entre com o valor da taxa de juros'
  },
  n_periodo: {
    type: Number,
    required: 'Entre com o período em meses'
  },
  pmt: {
    type: Number
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tables', TableSchema);