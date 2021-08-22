"use strict";

var mongoose = require("mongoose"),
  Schedule = require("../models/amortizationScheduleModel"); // carregamento do modelo criado aqui

exports.list_all_schedules = function (req, res) {
  Schedule.find({}, function (err, schedule) {
    if (err) res.send(err);
    res.json(schedule);
  });
};

exports.create_a_schedule = function (req, res) {
  var n, tax, pv;

  if (req.body.n_periodo && req.body.tax && req.body.pv) {
    n = req.body.n_periodo;
    tax = req.body.tax;
    pv = req.body.pv;
  } else {
    throw "Entre com um valor valído para a taxa, numero de meses e valor do financiamento";
  }

  var parcela = calculateSchedule(pv, n, tax);

  const new_schedule = new Schedule({
    ...req.body,
    parcela: parcela,
  });

  new_schedule.save(function (err, schedule) {
    if (err) res.send(err);
    res.json(schedule);
  });
};

exports.read_a_schedule = function (req, res) {
  Schedule.findById(req.params.scheduleId, function (err, schedule) {
    console.log(schedule);
    if (err) res.send(err);
    res.json(schedule);
  });
};

exports.renegotiate_a_schedule = function (req, res) {
  Schedule.findById(req.params.scheduleId, function (err, schedule) {
    if(err) throw "Cant find schedule by given id" 
  }).then(
    (oldSchedule) => {
      console.log(oldSchedule);
     Schedule.updateOne(
        { _id: req.params.scheduleId },
        renegotiate(oldSchedule, req.body.adjust_month - 1),
        { new: true },
        function (err, schedule) {
          if (err) res.send(err);
          res.json("Schedule successfully updated");
        }
      );
       
    }
  );
};

exports.delete_a_schedule = function (req, res) {
  console.log(req.params.scheduleId);
  Schedule.remove(
    {
      _id: req.params.scheduleId,
    },
    function (err, schedule) {
      if (err) res.send(err);
      res.json({ message: "Schedule successfully deleted" });
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
