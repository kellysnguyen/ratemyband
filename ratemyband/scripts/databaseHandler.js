(function(window) {
  "use strict";
  var App = window.App || {};

  function databaseHandler(databaseHandlerId, db) {
    this.databaseHandlerId = databaseHandlerId;
    this.db = db;
  }

  databaseHandler.prototype.createOrder = function(order) {
    this.db.add(order.emailAddress, order);
  };

  App.databaseHandler = databaseHandler;
  window.App = App;

})(window);
