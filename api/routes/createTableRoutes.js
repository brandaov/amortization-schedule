'use strict';
module.exports = function(app) {
  var createTable = require('../controllers/createTableController');

  // createTable Routes
  app.route('/tasks')
    .get(createTable.list_all_tasks)
    .post(createTable.create_a_task);


  app.route('/tasks/:taskId')
    .get(createTable.read_a_task)
    .put(createTable.update_a_task)
    .delete(createTable.delete_a_task);
};