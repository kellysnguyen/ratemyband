(function(window) {
  "use strict";

  //FORM SELECTORS
  var FORM_SELECTOR_LOGIN_MODAL = "[data-signin=\"form\"]";
  var FORM_SELECTOR_SIGNUP_MODAL = "[data-signup=\"form\"]";
  var FORM_SELECTOR_UPLOAD_MODAL = "[data-upload=\"form\"]";

  //SELECTORS FOR MANIPULATING DOM
  var USERINFO_SELECTOR = "[data-user-info=\"display-username\"]";
  var LOGIN_BUTTONS_SELECTOR = "[data-login-buttons=\"buttons\"]";
  var LOFI_SECTION_SELECTOR = "[data-genre-type=\"Lofi\"]";
  var AGT_SECTION_SELECTOR = "[data-genre-type=\"AGT\"]";
  var VEVO_SECTION_SELECTOR = "[data-genre-type=\"Vevo\"]";
  var POP_SECTION_SELECTOR = "[data-genre-type=\"Pop\"]";

  //IMPORTING
  var App = window.App;
  var $ = window.jQuery;
  var databaseHandler = App.databaseHandler;
  var RemoteDataStore = App.RemoteDataStore;
  var FormHandler = App.FormHandler;
  var ChangeDom = App.ChangeDom;

  //CONSTRUCTING
  var remoteDSVideo = new RemoteDataStore("http://localhost:2403/videos");
  var remoteDSLogin = new RemoteDataStore("http://localhost:2403/users/login");
  var mydatabaseHandlerVideo = new databaseHandler("ncc-1701", remoteDSVideo);
  var mydatabaseHandlerLogin = new databaseHandler("users", remoteDSLogin);
  window.mydatabaseHandlerVideos = mydatabaseHandlerVideo;
  window.mydatabaseHandlerLogin = mydatabaseHandlerLogin;
  var changeDomUser = new ChangeDom(USERINFO_SELECTOR);
  var changeDomButton = new ChangeDom(LOGIN_BUTTONS_SELECTOR);
  var changeDomVideosLofi = new ChangeDom(LOFI_SECTION_SELECTOR);
  var changeDomVideosAGT = new ChangeDom(AGT_SECTION_SELECTOR);
  var changeDomVideosVevo = new ChangeDom(VEVO_SECTION_SELECTOR);
  var changeDomVideosPop = new ChangeDom(POP_SECTION_SELECTOR);
  var formHandlerUploadModal = new FormHandler(FORM_SELECTOR_UPLOAD_MODAL);
  var formHandlerLoginModal = new FormHandler(FORM_SELECTOR_LOGIN_MODAL);
  var formHandlerSignupModal = new FormHandler(FORM_SELECTOR_SIGNUP_MODAL);

  //Login + Signup button click handlers
  $("#LoginButton, #LoginButton2").click(function(){
    $("#login-modal").modal();
  });

  $("#SignupButton, #SignupButton2").click(function(){
    $("#signup-modal").modal();
  });

  //Signup form handler
  formHandlerSignupModal.addSubmitHandler(function(data) {
    $.ajax({
      url: "http://localhost:2403/users",
      type: "POST",
      data: {"username": data.username, "password":  data.password},
      cache: false,
      xhrFields:{
        withCredentials: true
      },
      success:
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
            location.reload();
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
        $("#badcredentials-modal").modal();
      }
    });
  });

  //Upload Form Handler
  formHandlerUploadModal.addSubmitHandler(function(data) {
    $.ajax({
      url: "http://localhost:2403/videos",
      type: "POST",
      data: {videoLink: data.videoLink, bandName: data.bandName, performanceDate: data.performanceDate, performanceLocation: data.performanceLocation, genre: data.genre},
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

  //GET CURRENT USER (WHO AM I)
  $.ajax({
    url: "http://localhost:2403/users/me",
    type: "GET",
    cache: false,
    xhrFields:{
      withCredentials: true
    },
    success: function(result) {
      if (result != undefined) {
        changeDomUser.addUserInfoText(result.username);
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
              location.reload();
            },
            error: function(xhr) {
              console.log(xhr.responseText);
            }
          });
        });

        changeDomButton.addButton("Upload","UploadButton");
        //ADD UPLOAD BUTTON EVENT LISTENER
        document.getElementById("UploadButton").addEventListener("click", function() {
          $("#upload-modal").modal();
        });
      }
    },
    error: function(xhr) {
      console.log(xhr.responseText);
    }
  });

  //display current videos on page reloads
  remoteDSVideo.getAll(function(response){
    var i = response.length;
    //count the number of votes in database
    for(var j = 0; j < i; j++) {
      if (response[j].genre === "Lo-Fi") changeDomVideosLofi.addVideo(response[j]);
      if (response[j].genre === "AGT") changeDomVideosAGT.addVideo(response[j]);
      if (response[j].genre === "Vevo") changeDomVideosVevo.addVideo(response[j]);
      if (response[j].genre === "Pop") changeDomVideosPop.addVideo(response[j]);
    }
  });

})(window);
