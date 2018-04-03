(function(window) {
  "use strict";
  var App = window.App || {};
  var $ = window.jQuery;

  function RemoteDataStore(url) {
    this.serverUrl = url;
  }

  RemoteDataStore.prototype.add = function(key, val) {
    $.post(this.serverUrl, val);
  };
  RemoteDataStore.prototype.getAll = function(cb) {
    $.get(this.serverUrl, function(serverResponse) {
      cb(serverResponse);
    });
  };
  RemoteDataStore.prototype.get = function(key, cb) {
    $.get(this.serverUrl + "?emailAddress=" + key, function(serverResponse) {
      cb(serverResponse);
    });
  };
  RemoteDataStore.prototype.remove = function(key) {
    $.get(this.serverUrl + "?username=" + key, function(serverResponse) {
      var myID = (serverResponse[0].id);
      $.ajax(this.serverUrl + "/" + myID, {
        type: "DELETE"
      }, function() {
      });
    }.bind(this));
  };
  App.RemoteDataStore = RemoteDataStore;
  window.App = App;
})(window);
