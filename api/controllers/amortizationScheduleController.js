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
  let n, tax, pv;
  let pmt;

  //calcula pmt (valor constante no tempo)
  if (req.body.n_periodo && req.body.tax && req.body.pv) {
    try {
      n = req.body.n_periodo;
      tax = req.body.tax / 100;
      pv = req.body.pv;

      pmt = (pv * (tax * Math.pow(1 + tax, n))) / (Math.pow(1 + tax, n) - 1);
      //console.log(pmt);
    } catch {
      throw "Erro ao calcular parcela";
    }
  } else {
    throw "Entre com um valor valído para a taxa, numero de meses e valor do financiamento";
  }

  //calcula vetores de amortização, juros e saldo que variam no tempo
  let juros = [pv * tax]; //inicializa juros e saldo no primeiro mês
  let amort = [pmt - juros[0]]; //inicializa amortização no primeiro mês
  let saldo = [pv - amort[0]];

  for (var i = 1; i < n; i++) {
    juros[i] = saldo[i-1] * tax;
    amort[i] = pmt - juros[i];
    saldo[i] = saldo[i-1] - amort[i];
  }

  saldo[saldo.length-1] = 0;

  //console.log({ ...req.body, pmt, saldo, juros, amort });

  const new_table = new Table({ ...req.body, pmt, saldo, juros, amort });

  new_table.save(function (err, table) {
    if (err) res.send(err);
    res.json(table);
  }); 
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
  console.log(req.params.tableId);
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
