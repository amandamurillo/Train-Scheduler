// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate next arrival. Using difference between frequency and current time.
//    Then use moment.js formatting to set time in minutes.
// 5. Create a way to calculate the minutes away. Using difference between frequency and current time.


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAwOUlZN_34eR7LRgUsR05iKc_J4DreOLw",
    authDomain: "train-scheduler-9a7a3.firebaseapp.com",
    databaseURL: "https://train-scheduler-9a7a3.firebaseio.com",
    projectId: "train-scheduler-9a7a3",
    storageBucket: "",
    messagingSenderId: "430021765251"
  };

  firebase.initializeApp(config);

// database reference
  var database = firebase.database();

  // 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#dest-input").val().trim();
    var trainFirst = moment($("#first-train-input").val().trim(), "MM/DD/YYYY").format("X");
    var trainFreq = $("#freq-input").val().trim();
  
    // Creates local "temporary" object for holding train data
    var newTrain = {
      name: trainName,
      dest: trainDest,
      first: trainFirst,
      freq: trainFreq
    };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console checks
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.first);
  console.log(newTrain.freq);

  alert(newTrain.name + " successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#dest-input").val("");
  $("#first-train-input").val("");
  $("#freq-input").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = childSnapshot.val().freq;
  
    // train info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);
  
// var trainStartPretty = moment.unix(empStart).format("MM/DD/YYYY");
  
// next arrival- first train time, current time, frequency

var remainder = moment().diff(moment.unix(trainFirst), "minutes") % trainFreq;

var minAway = trainFreq - remainder;

var nextArrival = moment().add(minAway, "m").format("hh:mm A");

  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(nextArrival),
      $("<td>").text(minAway),
    );
  
    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

  });
  
