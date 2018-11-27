
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
    storageBucket: "train-scheduler-9a7a3.appspot.com",
    messagingSenderId: "430021765251"
  };

  firebase.initializeApp(config);

// database reference
var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#dest-input").val().trim();
    var trainFirst = $("#first-train-input").val().trim();
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
database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());
    // debugger;
    // Store everything into a variable.
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().dest;
    var trainFirst = childSnapshot.val().first;
    var trainFreq = parseInt(childSnapshot.val().freq);

    // train info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);


  // First Time (pushed back 1 year to make sure it comes before current time)
  var trainFirstConverted = moment(trainFirst, "HH:mm").subtract(1, "years");
  console.log(trainFirstConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between first train and current time
  var diffTime = moment().diff(moment(trainFirstConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  
  var diffTime = trainFirstConverted.diff(currentTime, "minutes")

  // Time apart (remainder)
  var tRemainder = diffTime % trainFreq;
  console.log(tRemainder);

  // Minute Until Train
  var timeLeft = trainFreq - tRemainder;
  console.log("MINUTES TILL TRAIN: " + timeLeft);

  // Next Train
  var nextArrival = moment().add(timeLeft, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
  var convertedArrival = moment(nextArrival).format("hh:mm");
    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(convertedArrival),
        $("<td>").text(timeLeft)
    );

    // Append the new row to the table
    $("#train-table").append(newRow);

}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

