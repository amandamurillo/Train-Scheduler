
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
    var trainFreq = childSnapshot.val().freq;

    // train info
    console.log(trainName);
    console.log(trainDest);
    console.log(trainFirst);
    console.log(trainFreq);


    var timeArr = trainFirst.split(":");
    var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);

    //if first train is later than the current time
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;


    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    }
    else {
        var diffTime = moment().diff(trainTime, "minutes");
        var tRemainder = diffTime % trainFreq;
        tMinutes = trainFreq - tRemainder;

        tArrival = moment().add(tMinutes, "m").format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    $("#train-table > tbody").append(
        $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDest),
            $("<td>").text(trainFreq),
            $("<td>").text(tArrival),
            $("<td>").text(tMinutes)
        )
    );
})





