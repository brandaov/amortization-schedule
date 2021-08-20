'use strict';
module.exports = function(app) {
  var createTable = require('../controllers/createTableController');

  // createTable Routes
  app.route('/tables')
    .get(createTable.list_all_tables)
    .post(createTable.create_a_table);


  app.route('/tables/:tableId')
    .get(createTable.read_a_table)
    .put(createTable.update_a_table)
    .delete(createTable.delete_a_table);
};