/**
 * Arrays for the probability calculations.
 */

// Weapon quality array
wepQualArr = fillArray("cheap", 12).concat(
             fillArray("normal", 50),
             fillArray("fine", 12), 
             fillArray("very fine", 6),
             fillArray("balanced", 12),
             fillArray("magic", 4),
             fillArray("extra", 4)
             );

// Rarity array
rarityArr = fillArray(0, 65).concat(
            fillArray(1, 30),
            fillArray(2, 5)
            );

// SM array
SMArr = fillArray(0, 70).concat(
        fillArray(1, 30)
        );

// Helper functions

/**
 * Function to create array with repeated elements.
 *
 * from: Guffa
 * at:   http://stackoverflow.com/questions/12503146/create-an-array-with-same-element-repeated-multiple-times-in-javascript
 */
function fillArray(value, len) {
  var arr = [];
  for (var i = 0; i < len; i++) {
    arr.push(value);
  }
  return arr;
}

