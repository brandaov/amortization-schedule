"use strict";

var mongoose = require("mongoose"),
  Table = require("../models/amortizationScheduleModel"); // carregamento do modelo criado aqui

exports.list_all_tables = function (req, res) {
  Table.find({}, function (err, table) {
    if (err) res.send(err);
    res.json(table);
  });
};

exports.create_a_table = function (req, res) {
  var n, tax, pv;

  if (req.body.n_periodo && req.body.tax && req.body.pv) {
    n = req.body.n_periodo;
    tax = req.body.tax;
    pv = req.body.pv;
  } else {
    throw "Entre com um valor valído para a taxa, numero de meses e valor do financiamento";
  }

  var parcela = calculateSchedule(pv, n, tax);

  const new_table = new Table({
    ...req.body,
    parcela: parcela,
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
  Table.findById(req.params.tableId, function (err, table) {
    if(err) throw "Cant find schedule by given id" 
  }).then(
    (oldSchedule) => {
      console.log(oldSchedule);
     Table.updateOne(
        { _id: req.params.tableId },
        renegotiate(oldSchedule, req.body.adjust_month - 1),
        { new: true },
        function (err, table) {
          if (err) res.send(err);
          res.json("Schedule successfully updated");
        }
      );
       
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
    tax = tax / 100; //conversão % para decimal

    //calcula pmt (valor constante no tempo)
    var pmt = (pv * (tax * Math.pow(1 + tax, n))) / (Math.pow(1 + tax, n) - 1);
    pmt = pmt.toFixed(2);
  } catch {
    throw "Erro ao calcular parcela";
  }
  try {
    //calcula parcelas de amortização, juros e saldo que variam no tempo
    var juros = pv * tax; //inicializa juros no primeiro mês
    var amort = pmt - juros; //inicializa amortização no primeiro mês
    var saldo = pv - amort;

    var parcelas = [];

    for (var i = 1; i <= n; i++) {
      parcelas.push({
        mes: i,
        pmt: pmt,
        saldo: saldo.toFixed(2),
        juros: juros.toFixed(2),
        amort: amort.toFixed(2),
      });

      juros = saldo * tax;
      amort = pmt - juros;
      saldo = saldo - amort;
    }
    parcelas[parcelas.length - 1].saldo = 0;
  } catch {
    throw "Erro ao calcular saldo devedor/amortização/juros";
  }

  return parcelas;
}

function renegotiate(old, m) {
  //  realiza a renegociação do financiamento
  var pv = old.parcela[m].saldo,
    n = old.n_periodo,
    tax = old.tax;
  var parcela = calculateSchedule(pv, n, tax);

  return {
    pv,
    n,
    tax,
    parcela,
  };
}
