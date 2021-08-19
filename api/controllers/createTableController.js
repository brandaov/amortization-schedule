'use strict';


var mongoose = require('mongoose'),
  Table = mongoose.model('Tables');

exports.list_all_tables = function(req, res) {
  Table.find({}, function(err, table) {
    if (err)
      res.send(err);
    res.json(table);
  });
};


exports.create_a_table = function(req, res) {
  var new_table = new Table(req.body);
  new_table.save(function(err, table) {
    if (err)
      res.send(err);
    res.json(table);
  });
};


exports.read_a_table = function(req, res) {
  Table.findById(req.params.tableId, function(err, table) {
    if (err)
      res.send(err);
    res.json(table);
  });
};


exports.update_a_table = function(req, res) {
  Table.findOneAndUpdate({_id: req.params.tableId}, req.body, {new: true}, function(err, table) {
    if (err)
      res.send(err);
    res.json(table);
  });
};


exports.delete_a_table = function(req, res) {


  Table.remove({
    _id: req.params.tableId
  }, function(err, table) {
    if (err)
      res.send(err);
    res.json({ message: 'Table successfully deleted' });
  });
};
