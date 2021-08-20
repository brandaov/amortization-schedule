'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TableSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the Table'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tables', TableSchema);