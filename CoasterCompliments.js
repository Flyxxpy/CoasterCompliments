"use strict";

// set minimum waiting time between compliments in seconds
var timer = 300;
// set the inverse probability of a compliment occuring every tick ("1 compliment per invProb")
var invProb = 4000;
// set the increase in guests that leads to a compliment
var peepCountIncrement = 100;


// put your compliments in here
const compliments = [
    "You're doing great!",
    "That looks amazing!",
    "Wow, you're such a great builder!",
    "This is such an awesome build!",
    "You're the best builder I've ever seen.",
    "That looks brilliant!",
    "That looks magnificent!",
    "What a beautiful build!",
    "That looks so cool!",
    "You're so creative!",
    "You make building great things look so easy!",
    "What an elegant way of building this!",
    "That looks fantastic!",
    "You're such a genius builder!",
    "That build is so gorgeous!",
    "What a great idea!",
    "Your build looks so impressive!",
    "What an innovative use of scenery pieces!",
    "That build fits in so well with its surroundings!",
    "That already looks perfect!",
    "That looks phenomenal!",
    "What a pretty build!",
    "You're such a skilled builder!",
    "That build looks stunning!",
    "What a terrific build!",
    "That build looks wonderful!"
];


// put your compliments for achieving a certain guest count in here    
const peepCompliments = [
    "Your park just keeps growing!",
    "There are already so many people in here!",
    "You've already accomplished a lot in this park!",
    "Your park is already really famous!",
    "Your park is thriving!",
    "Your park is so popular!",
    "You're making lots of progress in this park!",
    "Your park is really successful!",
    "The people just keep coming!",
    "What a huge amount of guests, that's amazing!"
];



// below is the code that provides the functionality of the plugin

function randomInt(maxValue) {
    return Math.floor(Math.random() * maxValue);
}

var main = function() {
    // the plugin works only in single player
    if (network.mode != "server" && network.mode != "client"){ 
        timer = timer * 40;
        var counter = timer;
        var formerPeepCount = park.guests + peepCountIncrement;
        var complimentIndex = randomInt(compliments.length);
        var prevComplimentIndex = compliments.length;
        var peepComplimentIndex = randomInt(peepCompliments.length);
        var prevPeepComplimentIndex = peepCompliments.length;

        subscription = context.subscribe('interval.tick', function() {
            // guest count compliment
            if (park.guests > formerPeepCount) {
                // avoid getting the same compliment two times in a row
                while (peepComplimentIndex == prevPeepComplimentIndex) {
                    peepComplimentIndex = randomInt(peepCompliments.length);
                }
                prevPeepComplimentIndex = peepComplimentIndex;

                try {
                    park.postMessage({
                        type: "award",
                        text: peepCompliments[peepComplimentIndex]
                    });
                } catch (error) {
                    console.log(error);
                }
                formerPeepCount = formerPeepCount + peepCountIncrement;
            }
            
            // compliment
            if (counter > 0) {
                counter = counter - 1;
            }
            else {
                var event = randomInt(invProb)
                if (!event) {
                    // avoid getting the same compliment two times in a row
                    while (complimentIndex == prevComplimentIndex) {
                        complimentIndex = randomInt(compliments.length);
                    }
                    prevComplimentIndex = complimentIndex;

                    try {
                        park.postMessage({
                            type: "award",
                            text: compliments[complimentIndex]
                        });
                    } catch (error) {
                        console.log(error);
                    }
                    counter = timer;
                }
            }  
        });
    }   
    else {
        console.log("This plugin works only in single player.");
    }
};



registerPlugin({
    name: 'CoasterCompliments',
    version: '1.0',
    authors: ['Flyxxpy'],
    type: 'remote',
    licence: 'MIT',
    targetApiVersion: 34,
    main: main
});