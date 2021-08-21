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
  var n, tax, pv;
  var pmt;

  //calcula pmt (valor constante no tempo)
  if (req.body.n_periodo && req.body.tax && req.body.pv) {
    n = req.body.n_periodo;
    tax = req.body.tax;
    pv = req.body.pv;
  } else {
    throw "Entre com um valor valído para a taxa, numero de meses e valor do financiamento";
  }

  //console.log({ ...req.body, pmt, saldo, juros, amort });
  //calculateSchedule()

  var schedule = calculateSchedule(pv, n, tax);

  const new_table = new Table({
    ...req.body,
    pmt: schedule.pmt,
    saldo: schedule.saldo,
    juros: schedule.juros,
    amort: schedule.amort,
  });

  new_table.save(function (err, table) {
    if (err) res.send(err);
    res.json(table);
  });
};

exports.read_a_table = function (req, res) {
  Table.findById(req.params.tableId, function (err, table) {
    console.log(table);
    if (err) res.send(err);
    res.json(table);
  });
};

exports.renegotiate_a_table = function (req, res) {
  Table.findOneAndUpdate(
    { _id: req.params.tableId },
    req.body,
    { new: true },
    function (err, table) {
      var schedule = renegotiate(table, req.body.adjust_month - 1);
      console.log(schedule);
      table.pv = schedule.pv;
      table.n_periodo = schedule.n;
      table.pmt = schedule.pmt;
      table.tax = schedule.tax;
      table.saldo = schedule.saldo;
      table.juros = schedule.juros;
      table.amort = schedule.amort;

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

function calculateSchedule(pv, n, tax) {
  try {
    tax = tax/100;
    var pmt = (pv * (tax * Math.pow(1 + tax, n))) / (Math.pow(1 + tax, n) - 1);
    console.log(pmt);
  } catch {
    throw "Erro ao calcular parcela";
  }
  try {
    //calcula vetores de amortização, juros e saldo que variam no tempo
    var juros = [pv * tax]; //inicializa juros e saldo no primeiro mês
    var amort = [pmt - juros[0]]; //inicializa amortização no primeiro mês
    var saldo = [pv - amort[0]];

    for (var i = 1; i < n; i++) {
      juros[i] = saldo[i - 1] * tax;
      amort[i] = pmt - juros[i];
      saldo[i] = saldo[i - 1] - amort[i];
    }

    saldo[saldo.length - 1] = 0;
  } catch {
    throw "Erro ao calcular saldo devedor/amortização/juros";
  }

  return { pmt, saldo, juros, amort };
}

function renegotiate(old, m) {
  var pv = old.saldo[m],
    n = old.n_periodo,
    tax = old.tax;
  var partialSchedule = calculateSchedule(pv, n, tax);

  return {
    pv,
    n,
    tax,
    pmt: partialSchedule.pmt,
    saldo: partialSchedule.saldo,
    juros: partialSchedule.juros,
    amort: partialSchedule.amort,
  };
}
