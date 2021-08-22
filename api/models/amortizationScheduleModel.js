"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  pv: {
    type: Number,
    required: "Entre com o valor de financiamento",
  },
  tax: {
    type: Number,
    required: "Entre com o valor da taxa de juros",
  },
  n_periodo: {
    type: Number,
    required: "Entre com o período em meses",
  },

  parcela: [
    {
      mes: Number,
      pmt: Number,
      saldo: Number,
      juros: Number,
      amort: Number,
    },
  ],

  Created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Schedules", ScheduleSchema);
