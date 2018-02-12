function initMap() {
  console.log("google API Loaded");
  // this is where the map will start
  var charlotte = {
    coordinates: { lat: 35.2271, lng: -80.8431 }
  };


  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: charlotte.coordinates
  });


  function addMarker(location) {
    var marker = new google.maps.Marker({
      position: location.coordinates,
      map: map,
      title: Location.eventName
    });

    var infoWindow = new google.maps.InfoWindow({
      content: location.eventName
    })
    marker.addListener('click', function () {
      infoWindow.open(map, marker);
    });

  };



  $(document).ready(function () {
    console.log("page loaded");
    var partyName;
    var partyTime;
    var eventType;
    var address;
    var city;
    var state;
    var host;
    var who;
    var what;
    var stuff;
    var attire;
    var addy;
    var timeTill;
    var partyID;
    var counter;
    var timer;
    var childern;
    var stuff;
    var description;
    var key;
    var reference;

    //will hold information gathered from firebase to be used in both geocode and map
    var addressArray = [];
    var eventNameArray = [];
    var addressToSearch;
    var tempCoords = {
      eventName: "",
      address: "",
      coordinates: "",
    };
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

    // Create Firebase event for adding events to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {

      partyID = childSnapshot.key;
      console.log("partyID: " + partyID);
      host = childSnapshot.val().Host;
      partyName = childSnapshot.val().Name;
      addy = childSnapshot.val().Location;
      partyTime = childSnapshot.val().Time;

      //pushes to relevant array
      addressArray.push(addy);
      eventNameArray.push(partyName);

      var currentTime = moment();

      var timeTill = moment(partyTime).diff(currentTime, "days");
      console.log(moment(partyTime).format("MM/DD/YYYY hh:mm:ss"));
      console.log("time until party: " + timeTill);

      //refresh page every 24 hours
      setTimeout(function () {
        console.log("is it working?");
        setInterval(decrement, 86400000);

        function decrement() {
          var number = timeTill;
          number--;
          location.reload();
          console.log("Timer" + number);

          if (timeTill === -1) {
            $(".key").val("");
          };
        }
      });

      //posts events to the DOM
      $("#pendingEvents > tbody").append("<tr class='rowID' data-key='" + partyID + "'><td class=partyTime'>" + (moment(partyTime).format("MM/DD/YYYY hh:mm:ss")) + "</td><td class='partyName'>" + partyName + "</td><td class=address>" +
        addy + "</td><td class=host>" + host + "</td><td class='minutesTill'>" + timeTill + "</td></tr>");
    });

    //populates the Who brings what section of the form
    var table = $("#pendingEvents");//deleted .DataTable()
    $("#pendingEvents tbody").on("click", "tr", function () {
      //remove items the were in the table previously
      $("#whoWhat tbody tr").remove();
      //gets the key from the row that is clicked so it can retrieve data from firebase
      key = $(this).data("key");
      console.log("Key Updated: " + key);
      //retrieves clicked record from database
      updateTable(key);
    });

    //updates the whoWhat table when value are added or updated 
    function updateTable() {
      console.log("Update function called" + " key is: "+key);
      $("#whoWhat tbody tr").remove();
      reference = database.ref('/' + key);
      reference.child("Items").once('value', gotData);
      // function that loops through items
      function gotData(snapshot) {
        snapshot.forEach(function (itemSnapshot) {
          var I = itemSnapshot.key;
          var person = itemSnapshot.val().Who;
          var stuff = itemSnapshot.val().What;
          console.log("add item back");
          $("#whoWhat > tbody").append("<tr class='itemID' data-key='" + I + "'><td class=who'>" + person + "</td><td class='what'>" + stuff + "</td></tr>");
        });
      };
    };

    //add new data to party item
    $("#itemAdd").on("click", function (event) {
      $("#whoWhat tbody tr").remove();
      //assign variables from HTML
      who = $("#who").val().trim();
      what = $("#what").val().trim();
      // check to ensure values arent null
      if (who === "" || what === "") {
        clearItems();
      } else {
        //follow path in firebase to items
        reference = database.ref('/' + key + '/Items');
        reference.push({
          Who: who,
          What: what,
        });
        clearItems();
      };
    });

    //clear input for new items
    function clearItems(){
      $("#who").val("");
      $("#what").val("");
      updateTable();
    }

    //listens for value updates in the items fields of the party selected
    database.ref('/' + key+"/Items").on("child_added", function(childSnapshot, prvChildName) {
      console.log("child changed");
      var I= childSnapshot.key;
      var person = childSnapshot.val().Who;
      var stuff = childSnapshot.val().What;
      $("#whoWhat > tbody").append("<tr class='itemID' data-key='" + I + "'><td class=who'>" + person + "</td><td class='what'>" + stuff + "</td></tr>");
    });

    //function to pull back type of cloths
    function attireFun(cloths) {
      console.log("cloths: " + cloths);
      if (cloths == 1) {
        return "Casual";
      } else if (cloths == 2) {
        return "Dressy Casual";
      } else if (cloths == 3) {
        return "Business Casual";
      } else if (cloths == 4) {
        return "Semiformal";
      } else if (cloths == 5) {
        return "Black Tie";
      } else if (cloths == 6) {
        return "White Tie";
      } else {
        "Other"
      };
    };

    //function to pull back type of party
    function eventTypeFunc(type) {
      console.log("event Type: " + type);
      if (cloths == 1) {
        return "Block Party";
      } else if (cloths == 2) {
        return "Birthday Party";
      } else if (cloths == 3) {
        return "Shhhh! Surprise Birthday Party";
      } else if (cloths == 4) {
        return "Cocktail Party";
      } else if (cloths == 5) {
        return "Dinner Party";
      } else if (cloths == 6) {
        return "Housewarming Party";
      } else {
        "Other"
      };
    };

    function kidsFunc(kids) {
      console.log("kids: " + kids);
      if (cloths == 1) {
        return "Children allowed";
      } else {
        return "No Kids!";
      };
    };

    // For Google Apis
    // waits for all children to be added to array

    var count = 0;
    setInterval(function () {
      if (count < eventNameArray.length) {
        eventName = eventNameArray[count];
        addressToSearch = addressArray[count];

        searchAndAdd();
      }
      count++;
    }, 1000);

    function searchAndAdd() {
      tempCoords.eventName = eventName;
      tempCoords.address = addressToSearch;
      findCoordinates();
    };

    function findCoordinates() {

      var queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + addressToSearch + "&key=AIzaSyCWa5eHnMAMi6rkFWh1pg_Ssxz8lTN6lQk";

      $.ajax({
        url: queryURL,
        method: "GET"
      }).done(function (response) {

        var eventLat = response.results[0].geometry.location.lat;
        var eventLng = response.results[0].geometry.location.lng;

        var formatLocation = {
          lat: eventLat,
          lng: eventLng
        };
        console.log("lat: " + eventLat + ", lng: " + eventLng);


        tempCoords.coordinates = formatLocation;
        addMarker(tempCoords);


      });
    } //function findCoordinates ends
  }); //on ready ends


};//in it map closing
