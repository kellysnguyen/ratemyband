(function(window) {
  "use strict";

  //form selectors
  var FORM_SELECTOR_COMMENTS = "[data-user-comment=\"form\"]";
  var FORM_SELECTOR_LOGIN_MODAL = "[data-signin=\"form\"]";
  var FORM_SELECTOR_SIGNUP_MODAL = "[data-signup=\"form\"]";

  //selectors for DOM manipulation
  var VOTECOUNT_SECTION_SELECTOR = "[data-vote-count=\"display\"]";
  var USERINFO_SELECTOR = "[data-user-info=\"display-username\"]";
  var LOGIN_BUTTONS_SELECTOR = "[data-login-buttons=\"buttons\"]";
  var COMMENT_SECTION_SELECTOR = "[data-user-comment=\"comment\"]";
  var CURRENTVIDEO_SECTION_SELECTOR = "[data-current-video=\"current\"]";

  //importing
  var App = window.App;
  var $ = window.jQuery;
  var databaseHandler = App.databaseHandler;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var ChangeDom = App.ChangeDom;

  //instantiating
  var remoteDSComments = new RemoteDataStore("http://localhost:2403/user-comments");
  var remoteDSLogin = new RemoteDataStore("http://localhost:2403/users/login");
  var mydatabaseHandlerComments = new databaseHandler("comments", remoteDSComments);
  var mydatabaseHandlerLogin = new databaseHandler("users", remoteDSLogin);
  window.mydatabaseHandlerComments = mydatabaseHandlerComments;
  window.mydatabaseHandlerLogin = mydatabaseHandlerLogin;
  var changeDomComments = new ChangeDom(COMMENT_SECTION_SELECTOR);
  var changeDomUser = new ChangeDom(USERINFO_SELECTOR);
  var changeDomButton = new ChangeDom(LOGIN_BUTTONS_SELECTOR);
  var changeDomCurrentVideo = new ChangeDom(CURRENTVIDEO_SECTION_SELECTOR);
  var formHandlerComments = new FormHandler(FORM_SELECTOR_COMMENTS);
  var formHandlerLoginModal = new FormHandler(FORM_SELECTOR_LOGIN_MODAL);
  var formHandlerSignupModal = new FormHandler(FORM_SELECTOR_SIGNUP_MODAL);

  //display new comment without page reload
  var currentUser;
  formHandlerComments.addSubmitHandler(function(data) {
    data.username = currentUser;
    data.videoId = currentVideoId;
    mydatabaseHandlerComments.createOrder(data);
    changeDomComments.addComment(data);
  });

  //Login Buttons Click Handler
  $("#LoginButton, #LoginButton2").click(function(){
    //Open Login Modal Form
    $("#login-modal").modal();
  });

  //Signup Buttons Click Handler
  $("#SignupButton, #SignupButton2").click(function(){
    //Open Login Modal Form
    $("#signup-modal").modal();
  });

  //Signup Form Handler
  formHandlerSignupModal.addSubmitHandler(function(data) {
    $.ajax({
      url: "http://localhost:2403/users",
      type: "POST",
      data: {"username": data.username, "password":  data.password},
      cache: false,
      xhrFields:{
        withCredentials: true
      },
      success: //location.reload(),
      function () {

        $.ajax({
          url: "http://localhost:2403/users/login",
          type: "POST",
          data: {username: data.username, password: data.password},
          cache: false,
          xhrFields:{
            withCredentials: true
          },
          success: function () {
            location.reload("index.html");
          },
          error: function(xhr) {
            console.log(xhr.responseText);
            //error message modal
            $("#badcredentials-modal").modal();
          }
        });

      },
      error: function(xhr) {
        console.log(xhr.responseText);
      }
    });
  });

  //Login Form Handler
  formHandlerLoginModal.addSubmitHandler(function(data) {
    //LOGGING IN
    $.ajax({
      url: "http://localhost:2403/users/login",
      type: "POST",
      data: {username: data.username, password: data.password},
      cache: false,
      xhrFields:{
        withCredentials: true
      },
      success: function () {
        location.reload();
      },
      error: function(xhr) {
        console.log(xhr.responseText);
        //error message modal
        $("#badcredentials-modal").modal();
      }
    });
  });

  //WHO AM I
  $.ajax({
    url: "http://localhost:2403/users/me",
    type: "GET",
    cache: false,
    xhrFields:{
      withCredentials: true
    },
    success: function(result) {
      if(result != undefined) {
        changeDomUser.addUserInfoText(result.username);
        currentUser = result.username;
        changeDomUser.delete("LoginButton");
        changeDomUser.delete("SignupButton");
        //ADD LOGOUT BUTTON
        changeDomButton.addButton("Logout","LogoutButton");
        //ADD LOGOUT BUTTON EVENT LISTENER
        document.getElementById("LogoutButton").addEventListener("click", function(){
          $.ajax({
            url: "http://localhost:2403/users/logout",
            type: "POST",
            data: {},
            cache: false,
            xhrFields:{
              withCredentials: true
            },
            success: function () {
              //location.reload();
              window.location.href="http://localhost:3000/";


            },
            error: function(xhr) {
              console.log(xhr.responseText);
            }
          });
        });
      }
    },
    error: function(xhr) {
      console.log(xhr.responseText);
    }
  });

  //display the current video and corresponding comments + votes
  var currentVideoIdCookie = document.cookie;
  var remove = "currentVideoId=";
  var currentVideoId = currentVideoIdCookie.substring(remove.length);

  //get the video tuple using id
  $.ajax({
    url: "http://localhost:2403/videos",
    type: "GET",
    data: {id: currentVideoId},
    cache: false,
    xhrFields:{
      withCredentials: true
    },
    success: function(result) {
      changeDomCurrentVideo.addCurrentVideo(result);
    },
    error: function(xhr) {
      console.log(xhr.responseText);
    }
  });

  //display comments corresponding to video on page reloads
  remoteDSComments.getAll(function(response){
    var i = response.length;
    var numUpvotes = 0;
    var numDownvotes = 0;

    for(var j = 0; j < i; j++) {
      if (response[j].videoId == currentVideoId) {
        changeDomComments.addComment(response[j]);
        if(response[j].vote == "upvote") numUpvotes++;
        if(response[j].vote == "downvote") numDownvotes++;
      }
    }
    var changeDomVotes = new ChangeDom(VOTECOUNT_SECTION_SELECTOR);
    changeDomVotes.updateVoteCount(numUpvotes, numDownvotes);
  });

})(window);
