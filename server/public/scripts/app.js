// Weekend Challenge 02
// Welcome to your second weekend challenge!
//
// When pulling down this file, open it up in terminal and run 'npm install' in the terminal.
//
// Don't forget, to test an application with a node server, you will need to enter 'npm start'
//  (as defined in the package.json file).
//
// To shut down a server, hold down control and press 'C'.
//
// I created a new JSON data file, inside it, you will find an array of objects. Each object,
//  is each one of you!
//
// You first task is to make an AJAX call from the client side app.js, using the .ajax method,
//  which will be set to GET, and access the '/data' url. When successful, it should bring the data
//   back down. You will then need to combine that with what you learned today about making a carousel.
//
// What I would like to see on the DOM, is one person represented. A series of 22
// (or the number of people in the cohort) index points with the first person's index
// highlighted or called out in style differently than the others. Also on the DOM should be a 'next'
//  and 'prev' button. Clicking on the next button should navigate to the next person, clicking on
//  the prev button should navigate to the previous person. The highlighted index point should update
//   also as you click next and prev.
//
// When a person is displayed, show their name, their city, and their piece of shoutout feedback.
//  Only one person should be show cased at any given time.
//
// You will need to combine everything you learned this week to accomplish this task, and each of
//  the challenges you have completed this week play a part in this task.
//
// I posted an example from Zeta that I did here, so you can see the functionality (Its ugly however),
// just know I minified the code (no cheating!):
//
// https://polar-ravine-37299.herokuapp.com/
//
// HARD MODE
//
// Include a fade out and fade in animation in-between transitioning people.
//
// PRO MODE
//
// Include a timer that moves to the next person if the user is not clicking on next or prev.
// If the user clicks on next or prev, the timer should be reset. The timer should transition
// between people every 10 seconds.

$(document).ready(function(){

    //  on success of getting the data object from the server,
    // call initialize to start things up, passing it the retrieved data
    $.ajax({
      type: "GET",
      url: "/data",
      success: function(data){
        initialize(data);
      }
    });
});

// declare variables arrKappa and personIndex global to work with in a bunch of
// functions, "con"- variables to act as constants until I learn to declare actual
// constants
var arrKappa;
var timer;
var conUpdateInterval = 10000;
var personIndex = 0;
var conIndexCap;
var conFadeTime = 500;

function initialize(data){

    // populate the array of kappans
    // set / reset the timer
    // draw the Index donuts static
    // update the index

    // draw the person static
    // update the person elements that will change
    // setup event listeners

    popArray(data);
    resetTime();
    drawIndex();
    updateIndex();
    drawPerson();
    updatePerson();
    setListeners();
}

function update(){
    // console.log("in function update");
    // console.log("person index = ", personIndex);

    // console.log("check index against bounds");

    // check if person index is within bounds, rollover either way
    if (personIndex<0){
        personIndex=conIndexCap;
    }
    if (personIndex>conIndexCap){
        personIndex=0;
    }
    // console.log("after bounds check person index = ", personIndex);
    //reset timer if needed
    resetTime();
    // console.log("timer", timer);
    //repaint person
    updatePerson();
    //repaint index dots
    updateIndex();
}
function updateIndex(){

    //
    // // adding display name for click on donuts
    // var rowKappan = arrKappa[personIndex];
    // $("#donutName").text(rowKappan.name);



        $('.donut').removeClass('donutOn');
        $('.donut'+personIndex).toggleClass('donutOn');

        //$('.donut'+personIndex).fadeIn(1000);
    //});
}
function drawIndex(){

    //draw the index once at start, to update only changes dynamically later

        $('.container').append('<div class = "index"></div>');
         var $el = $('.container').children().last();

         for (var i=0; i<conIndexCap+1; i++){
             $el.append('<div class = "donut donut' + i + '"></div>');
         }
}

function updatePerson(){

    // get the object for a specific person into a local array from the global array
    var rowKappan = arrKappa[personIndex];

    //callback function on fadeout and fadein
    $('.person').fadeOut(conFadeTime, function() {

        // change the sources for existing elements



        $("#name").text(rowKappan.name);
        $("#location").text(rowKappan.location);


        $("#spirit_url").attr("src",'/views/images/' + rowKappan.spirit_url);


        $("#spirit_animal").text(rowKappan.spirit_animal);
        $("#shoutout").text(rowKappan.shoutout);


        $('.person').fadeIn(conFadeTime);
    });



}

function drawPerson(){

    // dynamically draw the perseon display elements to the DOM. These will be updated on
    // person change, but all these elements will persist.

    $('.container').append('<div class = "person"></div>');

     var $el = $('.container').children().last();

    //  $el.append('<button class = "prev"><</button>');
    //  $el.append('<button class = "next">></button>');
     $el.append('<p>Name: <span id = "name"></span></p>');


     $el.append('<img class = "spirit_pic" alt = "spirit animal" id="spirit_url" src = ""></img>')

     $el.append('<p>Hometown: <span id = "location"><span></p>');
     $el.append('<p>Spirit Animal: <span id = "spirit_animal"></span></p>');
     $el.append('<p>Shoutout: <span id = "shoutout"></span></p>');

}

function setListeners(){
    // set listeners for prev and next buttons

    $('.prev').on('click', prevPerson);
    $('.next').on('click', nextPerson);

    // experiment with adding click to donuts
    $('.container').on('click', '.donut', donutPerson);


}

function donutPerson(){

    // on click of circle in index set the index to that person and update


    var newIndex = $(this).attr("class");

    newIndex = newIndex.replace("donut donut","");
    newIndex = parseInt(newIndex);
    personIndex = newIndex;

    // console.log("new donut index = ", newIndex)

    // once we have a number from the donut set the person index to it
    // then update
    update();
}

function prevPerson(){

    // move index to the previous person
    personIndex--;
    // console.log("index = " + personIndex);
    // person changed update all displays
    update();
}

function nextPerson(){

    // move index to the next person
    personIndex++;
    // console.log("index = " + personIndex);
    // person changed update all displays

    update();
}

function popArray(data){
    // stick the retrieved array, Kappa, from the data object, into the globally
    // declared arrKappa array
    arrKappa = data.kappa
    conIndexCap = arrKappa.length-1;
}

function resetTime(){
    // nuke the current timer and reset
    window.clearInterval(timer);
    timer = window.setInterval(timerTrigger, conUpdateInterval);
    // console.log("reset time");
}

function timerTrigger(){

    // timer elapsed without a click, advance the index and update all
    // console.log("the clock is ticking", timer);
    personIndex++;
    update();
}
