(function(window) {
  "use strict";

  var App = window.App || {};
  var $ = window.jQuery;

  function ChangeDom(selector) {
    this.$element = $(selector);
  }

  ChangeDom.prototype.addComment = function(comment) {
    var newComment = new Comment(comment);
    this.$element.append(newComment.$element);
  };

  ChangeDom.prototype.delete = function(id) {
    document.getElementById(id).remove();
  };

  function Comment(data) {
    var $div = $("<div></div>", {
      "data-user-comment": "comment"
    });
    var $label = $("<label></label>");
    var description = "<font color=\"gray\"> <i> \"" + data.comment + "\"</i></font><br />";
    description += "<p>-" + data.username + "<br />";
    $label.append(description);
    $div.append($label);
    this.$element = $div;
  }

  ChangeDom.prototype.addUserInfoText = function(username) {
    var $paragraph = $("<p></p>", {
      "data-user-logged-in": "username",
      "id": "currentUser"
    });
    var description = "Logged in as <font color=\"gray\"> <i> \"" + username + "\"</i></font><br />";
    $paragraph.append(description);
    this.$element.append($paragraph);
  };

  ChangeDom.prototype.updateVoteCount = function (upvotes, downvotes) {
    var $paragraph = $("<p></p>", {
      "data-vote-count": "current"
    });
    var description = "<br>This performance has <font color=\"gray\"> <i>" + upvotes + "</i></font> upvotes and "
                      + "<font color=\"gray\"> <i> " + downvotes + "</i></font> downvotes.<br />";
    $paragraph.append(description);
    this.$element.append($paragraph);
  };

  ChangeDom.prototype.addButton = function (buttonName, buttonID) {
    var $button = $("<button></button>", {
      "type": "button",
      "class": "btn btn-default",
      "id": buttonID
    });
    var description = buttonName;
    $button.append(description);
    this.$element.append($button);

    var $div = "<div class=\"kellys-divider\"></div>";
    this.$element.append($div);
  };

  function Video(data) {
    var $a= $("<a></a>", {
      "data-videos-list": "listelement",
      "class": "listelement",
      "href": "index2.html",
      "id": data.id
    });

    var $label = $("<label></label>", {
    });
    //remove the fixed heigh and width
    var remove = "<iframe width=\"560\" height=\"315\"";
    var video = data.videoLink.substring(remove.length);
    var add = "<iframe width=\"359\" height=\"202\"";
    add += video;
    $label.append(add);

    var description = "<br>Performance by <font color=\"black\"> <i> \"" + data.bandName + "\" </i></font><br>In <font color=\"black\"> <i>" + data.performanceLocation + "</i></font><br />" + data.performanceDate + "<br>";
    $label.append(description);
    $a.append($label);
    this.$element = $a;

    $(".listelement").click(function() {
      var currentVideoId = $(this).attr("id");
      document.cookie = "currentVideoId=" + currentVideoId;
    });
  }

  ChangeDom.prototype.addVideo = function(data) {
    var newVideo = new Video(data);
    this.$element.append(newVideo.$element);
    var $div = "<div class=\"kellys-divider\"></div>";
    this.$element.append($div);
  };

  ChangeDom.prototype.addCurrentVideo = function (data) {
    var $label = $("<label></label>");
    var bandName = data.bandName;
    $label.append(bandName);
    this.$element.append($label);

    var $p1 = $("<p></p>");
    var performanceLocation = data.performanceLocation;
    $p1.append(performanceLocation);
    this.$element.append($p1);

    var $p2 = $("<p></p>");
    var performanceDate = data.performanceDate;
    $p2.append(performanceDate);
    this.$element.append($p2);

    var $video = $("<div></div>", {
      "class": "videowrapper"
    });
    $video.append(data.videoLink);
    this.$element.append($video);
  };

  App.ChangeDom = ChangeDom;
  window.App = App;
})(window);
