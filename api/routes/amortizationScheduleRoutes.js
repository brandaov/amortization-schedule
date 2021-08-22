"use strict";
module.exports = function (app) {
  var amortizationSchedule = require("../controllers/amortizationScheduleController");

  // amortizationSchedule Routes
  app
    .route("/tables")
    .get(amortizationSchedule.list_all_tables)
    .post(amortizationSchedule.create_a_table);

  app
    .route("/tables/:tableId")
    .get(amortizationSchedule.read_a_table)
    .put(amortizationSchedule.renegotiate_a_table)
    .delete(amortizationSchedule.delete_a_table);
};
