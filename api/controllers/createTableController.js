"use strict";

var mongoose = require("mongoose"),
  Table = mongoose.model("Tables");

exports.list_all_tables = function (req, res) {
  Table.find({}, function (err, table) {
    if (err) res.send(err);
    res.json(table);
  });
};

exports.create_a_table = function (req, res) {
  let pmt;
  if (req.body.n_periodo && req.body.tax && req.body.pv) {
    try {
      const n = req.body.n_periodo,
        tax = req.body.tax/100,
        pv = req.body.pv;
      console.log(pv, n, tax);

      pmt =
        (pv * (tax * Math.pow(1 + tax, n))) /
        (Math.pow(1 + tax, n) - 1);
      console.log(pmt);
    } catch {
      throw "Erro ao calcular parcela";
    }
  }else{
    throw "Entre com um valor valído para a taxa, numero de meses e valor do financiamento"
  } 
  /* const new_table = new Table({...req.body, pmt});
  
  new_table.save(function (err, table) {
    if (err) res.send(err);
    res.json(table);
  }); */
};

exports.read_a_table = function (req, res) {
  Table.findById(req.params.tableId, function (err, table) {
    if (err) res.send(err);
    res.json(table);
  });
};

exports.update_a_table = function (req, res) {
  Table.findOneAndUpdate(
    { _id: req.params.tableId },
    req.body,
    { new: true },
    function (err, table) {
      if (err) res.send(err);
      res.json(table);
    }
  );
};

exports.delete_a_table = function (req, res) {
  Table.remove(
    {
      _id: req.params.tableId,
    },
    function (err, table) {
      if (err) res.send(err);
      res.json({ message: "Table successfully deleted" });
    }
  );
};
