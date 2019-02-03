
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCyNkXZ3jSs_kgYM412HLir0mZ5esK7Hl0",
    authDomain: "train-schedule-cfed3.firebaseapp.com",
    databaseURL: "https://train-schedule-cfed3.firebaseio.com",
    projectId: "train-schedule-cfed3",
    storageBucket: "train-schedule-cfed3.appspot.com",
    messagingSenderId: "481809130631"
};
firebase.initializeApp(config);

// put the firebase database into a variable
var database = firebase.database();



// button to add a new train to the schedule
$("#addTrainButton").on("click", function (event) {

    // prevent the form from redirecting
    event.preventDefault();

    // grab the new train information
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#train-destination").val().trim();
    var trainStart = $("#start-time").val().trim();
    var trainFreq = $("#train-frequency").val().trim();

    // put new train info into an object to send to database
    var newTrain = {
        name: trainName,
        dest: trainDest,
        start: trainStart,
        freq: trainFreq
    };

    // push the new train information into the database
    database.ref().push(newTrain);

    // clear the text-boxes
    $("#train-name-input").val("");
    $("#train-destination").val("");
    $("#start-time").val("");
    $("#train-frequency").val("");


}); // end addTrainButton click function


// firebase event that adds a new row to the train schedule when a new train is added to the database
database.ref().on("child_added", function (newTrain) {

    // put each value into a variable
    var trainName = newTrain.val().name;
    var trainDest = newTrain.val().dest;
    var trainStart = newTrain.val().start;
    var trainFreq = newTrain.val().freq;

    // use moment for grabbing time and calculating arrival times
    // convert the submitted start time
    var trainStartConverted = moment(trainStart, "hh:mm");

    // get the difference between current time and train start time in minutes
    var timeDif = moment().diff(moment(trainStartConverted), "minutes");

    // remainder will give us how many minutes have passed since last train
    var timePassed = timeDif % trainFreq;

    console.log("minutes since last train: " + Math.abs(timePassed));

    // use the frequency and time passed to calculate minutes until the next train
    var nextTrainMinutes = trainFreq - Math.abs(timePassed);
    console.log("minutes until next train: " + nextTrainMinutes);

    // calculate next arrival time by adding current time to next train minutes
    var nextTrain = moment().add(nextTrainMinutes, "minutes").format("hh:mm A");

    console.log(`Train Name: ${trainName}`);
    console.log(`Train Destination: ${trainDest}`);
    console.log(`Frequency: ${trainFreq}`);
    console.log(`Next Arrival: ${nextTrain}`);
    console.log(`ETA: ${nextTrainMinutes}`);


    // create a new row and append all of the new train information
    var newRow = $("<tr>");
    newRow.append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrain),
        $("<td>").text(nextTrainMinutes)
    ); // end append

    // append the row to the table
    $("#trainTable > tbody").append(newRow);

}); // end child_added function