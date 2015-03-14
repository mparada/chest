/**
 * items.js
 *
 * Array of items.
 *
 * After array is generated the functions of the item prototype are added. It
 * is inverted from the usual Class -> Object way of inheritance because not 
 * objects have the same fields, they are similar but not exactly the same.
 * Another solution would be multi-level prototype hierarchies, but I think it
 * is overkill.
 */

var ITEMS = [
    {
        name : "Shortsword",
        baseValue : 400,
        baseWeight : 2,
        rarity : 0,
        type : "weapon",
        subtype : "sword",
        ref : "B273"
    },
    {
        name : "Spear",
        baseValue : 40,
        baseWeight : 4,
        rarity : 0,
        type : "weapon",
        subtype : "spear",
        ref : "B273"
    },
    {
        name : "Short Bow",
        baseValue : 50,
        baseWeight : 2,
        rarity : 0,
        type : "weapon",
        subtype : "bow",
        ref : "B275"
    },
    {
        name : "Long Bow",
        baseValue : 150,
        baseWeight : 3,
        rarity : 1,
        type : "weapon",
        subtype : "bow",
        ref : "B275"
    },
    {
        name : "Gold Ring",
        baseValue : 4200,
        baseWeight : 0.25,
        rarity : 2,
        type : "jewel"
    }
]


// Methods of the items
for (var i = 0; i < ITEMS.length; i++) {
    // initialize CF, CA and CM
    ITEMS[i].CF = 1; // cost factor, for weapon/armor quality
    ITEMS[i].CA = 0; // cost added, for enchantments
    ITEMS[i].CM = 1; // cost multiplier, for SM

    // value calculation
    ITEMS[i].getValue = function() {
        return Math.round(100 * (this.baseValue * this.CF * this.CM + this.CA)) / 100;
    };

    // weight calculation
    ITEMS[i].getWeight = function() {
        return Math.round(100 * (this.baseWeight * this.CM)) / 100;
    };
};
