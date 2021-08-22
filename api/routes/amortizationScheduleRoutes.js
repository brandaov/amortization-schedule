"use strict";
module.exports = function (app) {
  var amortizationSchedule = require("../controllers/amortizationScheduleController");

  // amortizationSchedule Routes
  app
    .route("/schedules")
    .get(amortizationSchedule.list_all_schedules)
    .post(amortizationSchedule.create_a_schedule);

  app
    .route("/schedules/:scheduleId")
    .get(amortizationSchedule.read_a_schedule)
    .put(amortizationSchedule.renegotiate_a_schedule)
    .delete(amortizationSchedule.delete_a_schedule);
};
