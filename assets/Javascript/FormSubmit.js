 $(document).ready(function () {
    console.log("page loaded");
  var config = {
      apiKey: "AIzaSyAb-Eg8PzUPHvjSZbD9x6DwLEzUL9Ap_dM",
      authDomain: "partycrawlerpeople.firebaseapp.com",
      databaseURL: "https://partycrawlerpeople.firebaseio.com",
      projectId: "partycrawlerpeople",
      storageBucket: "partycrawlerpeople.appspot.com",
      messagingSenderId: "402396598323"
    };

    firebase.initializeApp(config);

    var database = firebase.database();
    console.log("test");
    $("#submitParty").on("click", function (event) {
      alert("hey are you working")
      console.log("testing Button");
      event.preventDefault();
      console.log("test2");
      partyName = $("#eventName").val().trim();
      eventType = $("#eventType").val().trim();
      attire = $("#attire").val().trim();
      partyTime = $("#datetime").val().trim();
      address = $("#address-input").val().trim();
      city = $("#city-input").val().trim();
      childern = $("#child").val().trim();
      host = $("#host").val().trim();
      state = $("#state-input").val().trim();
      description = $("#description").val().trim();
      addy = address + " " + city + " " + state;

      console.log("name " + partyName);

      //reset entry form
      $("#partyCrawlerInput")[0].reset();

      //push to firebase
      database.ref().push({
        Name: partyName,
        Location: addy,
        Description: description,
        Event_Type: eventType,
        Attire: attire,
        Kid_Friendly: childern,
        Time: partyTime,
        Host: host,
        Occurred: false,
        Items: []
      });
    });
});