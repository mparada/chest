/**
 * scripts.js
 *
 * Generates random treasure.
 */

// Globals

var RARITY = []; // list of ITEMS array by rarity
RARITY[0] = [];
RARITY[1] = [];
RARITY[2] = [];

var CHEST = []; // array of items in chest

var BACKPACK = []; // array of items in backpack

// Buttons and other JS stuff

// clear panel
$(document).ready(function() {
    $(".clearButton").click(function(){
        // get which panel
        var panel = $(this).parent().attr("id");

        switch (panel) {

            case "chestPanel":
                var arr = CHEST;
                var name = "chest"
                break;

            case "backpackPanel":
                var arr = BACKPACK;
                var name = "backpack"
                break;
        }

        // empty array
        arr.length = 0;

        update(name);
    });

    update("chest");
    update("backpack");
});

// descriptions TODO: check this!
jQuery(function() {
        jQuery(".refbody").hide();
        jQuery(".refnum").click(function(event) {
          jQuery(this.nextSibling).toggle();
          event.stopPropagation();
        });
        jQuery("body").click(function(event) {
          jQuery(".refbody").hide();
        });
      });

// Functions

/**
 * Main generator of treasure.
 * Each generation adds to previous items in CHEST.
 * Input: amount. Number, either the number of items to be generated or 
 *        the total value of items to be generated.
 */
function generate(amount) {
    // get type. 1: per item, 2: per value.
    var type = $("input[type='radio'][name='amountType']:checked").val();

    // initialize output array
    var chest = [];

    // initialize total value
    var total = 0;

    // coin percentage
    var coinPct = 0.01;
    var coinsTotal = Math.max(50, amount * coinPct); // at least $50 in coins

    // generation loop, stops when the amount is reached (in number of items or in total value)
    while ((type == 1 && chest.length < amount) || (type == 2 && total < amount - coinsTotal)) 
    {
        // get random rarity
        var r = getRarity();

        // get a random item of given rarity
        var myItem = $.extend(true, {}, RARITY[r][roll(RARITY[r].length)]); // use extend() to copy by value

        // SM for weapons and armor
        if (myItem.type == "weapon" || myItem.type == "armor") {
            var tmp = getSM();
            myItem["SM"] = tmp.SM;
            myItem["CM"] = tmp.CM;
        }

        // quality
        getQuality(myItem);

        // put into chest
        chest.push(myItem);

        // increment total
        total += myItem.getValue();
    }

    // add items to global CHEST
    CHEST = CHEST.concat(chest);

    // put rest of $ in a bag of coins
    if (type == 2 && amount > total)
        CHEST.push({
            name: "Bag of coins",
            baseValue: amount - total,
            baseWeight: 0,
            getValue: function() {return this.baseValue;},
            getWeight: function() {return this.baseWeight;}
            }); 

    // update chest tab
    update("chest");
}

/**
 * Assigns up to 3 qualities (e.g. fine, balanced etc.) to item.
 */
function getQuality(item) {
    // qual: array of qualities
    if (!("qual" in item))
        item.qual = [];

    // check maximum number of item qualities
    if (item.qual.length > 3)
        return;
    
    // filter quality array according to item's already assigned qualities
    var filtered = wepQualArr;
    
    // if item already has cheap, normal, fine or very fine quality, filter 
    // these from the possibilities
    if (intersect_safe(["cheap", "fine", "normal", "very fine"], item.qual.sort()).length != 0) {
        var filtered = filtered.filter(function(n) { return n != "cheap" &&
                                                              n != "fine" &&
                                                              n != "normal" &&
                                                              n != "very fine"
                                                     });
    }
    
    // check if item is already balanced, filter from possibilities if yes
    if ($.inArray("balanced", item.qual) != -1) {
        var filtered = filtered.filter(function(n) { return n != "balanced" });
    }

    // "very fine" only for swords
    if (item.subtype !== "sword"){
        var filtered = filtered.filter(function(n) { return n != "very fine" });
    }

    // get current quality
    var currQual = filtered[roll(filtered.length)];

    // for weapons
    if (item.type == "weapon"){
    
        switch (currQual) {

            case "cheap":
                item.qual.push("cheap");
                item.CF = item.CF - 0.6;
                break;

            case "normal":
                break; // normal quality, do nothing

            case "fine":
                item.qual.push("fine");
                
                // for each type of weapon (item subtype) a different cost factor
                // see quality.js for the CF
                if ($.inArray(item.subtype, fineCF3) > -1)
                    item.CF = item.CF + 3;
                else if ($.inArray(item.subtype, fineCF9) > -1)
                    item.CF = item.CF + 9;
                else
                    item.CF = item.CF + 2;
                break;

            case "very fine": // only valid for swords
                item.qual.push("very fine");
                item.CF = item.CF + 19;
                break;
               
            case "balanced": 
                item.qual.push("balanced");
                item.CF = item.CF + 4;
                break;

            case "magic":
                item.qual.push("magic");
                break;

            case "extra": // two qualities
                getQuality(item);
                getQuality(item);
                break;
            default:
console.log("Error in switch for weapon quality");
        }
    }
}

/**
 * Returns a value of the rarity array (see probabilities.js).
 */
function getRarity() {
    return rarityArr[roll(rarityArr.length)];
}

/**
 * Returns SM and cost modifier based on SM (see probabilities.js).
 */
function getSM() {
    // pick SM from SMArr (in probabilities.js)
    SM = SMArr[roll(SMArr.length)];

    //cost modifier
    if (SM == 0)
        return {SM : SM, CM : 1}
    else if (SM == 1)
        return {SM : SM, CM : 1.5}
}

/**
 * Loads the RARITY array with the items filtered by rarity.
 */
function loadLists() {
    for (var i = 0, len = ITEMS.length; i < len; i++) {
        RARITY[ITEMS[i].rarity].push(ITEMS[i]);  
    }
}

/**
 * Returns a random integer between 0 and max.
 */
function roll(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Update chest and backpack.
 */
function update(string) {
    // prepare input
    switch (string){
        case "chest":
            var arr = CHEST;
            var otherName = "backpack";
            var other = BACKPACK;
            break;

        case "backpack":
            var arr = BACKPACK;
            var otherName = "chest";
            var other = CHEST;
            break;
    }

    // total value and weight
    var totalValue = 0;
    var totalWeight = 0;

    // get element from DOM
    var ul = document.getElementById(string);

    // empty list
    $(ul).empty();

    // for each item in array
    for (var i = 0, len = arr.length; i < len; i++) {
        // update value and weight
        totalValue += arr[i].getValue();
        totalWeight += arr[i].getWeight();

        // create li
        var li = $("<li/>")
            .attr("value", i)
            .appendTo(ul);

        // item display text
        if (arr[i].SM == 0 || typeof arr[i].SM === "undefined") {
            var textSM = [];
        } else {
            var textSM = " (SM " + arr[i].SM + ")";
        }
        var text = arr[i].qual.join(", ") + " " + arr[i].name + textSM + ": $" + arr[i].getValue() + ", " + arr[i].getWeight() + "lbs.";
        text = text.charAt(0).toUpperCase() + text.slice(1); // capitalizes first word
       
        // create anchor tag to have a clickable text
        var a = $("<a/>")
            .text(text)
            .click(function() {
                // find out if we are in chest or backpack
                var origin = $(this).closest("ul").attr("id"); // ul's id is either "chest" or "backpack"
                switch (origin){
                    case "chest":
                        var arr = CHEST;
                        var otherName = "backpack";
                        var other = BACKPACK;
                        break;

                    case "backpack":
                        var arr = BACKPACK;
                        var otherName = "chest";
                        var other = CHEST;
                        break;
                }

                // push item to other array
                other.push(arr.splice($(this).closest("li").attr("value"), 1)[0]);

                update(origin);
                update(otherName);
            })
            .mouseover(function(){
                $("#description" + i).dialog();
            })
            .appendTo(li)

        // create button to delete line
        var button = $("<button/>")
            .text("x")
            .click(function() {
                // find out if we are in chest or backpack
                var origin = $(this).closest("ul").attr("id"); // ul's id is either "chest" or "backpack"
                switch (origin){
                    case "chest":
                        var arr = CHEST;
                        break;

                    case "backpack":
                        var arr = BACKPACK;
                        break;
                }

                // remove element from array
                arr.splice($(this).closest("li").attr("value"), 1);

                update(origin);
            })
            .insertAfter(a);

        // item description div TODO: check this!!!
        var desc = $("<span class=\"ref\"></span>");
        var descText = $("<span class=\"refbody\"></span>")
            .text(arr[i].ref)
            .appendTo(desc);
        desc.insertAfter(a);

    }

    // print total value and weight
    $("<li><b>Value: $" + totalValue + ", weight: " + totalWeight + "lbs.</b></li>").appendTo(ul);
}

