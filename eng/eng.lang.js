(function() {

  "use strict";

  let Lang = {};
  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    Lang = require("../lang.js");
    module.exports = EngLang;
  }
  else {
    Lang = window.JsLingua.Cls.Lang;
    window.JsLingua.addService("Lang", "eng", EngLang);
  }

  /**
  * Contains English charsets and transformations
  * @class EngLang
  * @extends Lang
  * @constructor
  */
  function EngLang() {
    Lang.call(this, "eng");

    //
    Lang.addCharSet.call(this, "BasicLatin", 0x0000, 0x007F);

    Lang.addTransform.call(this, "minusculeToMajuscule", -0x0020, "BasicLatin", 0x0061, 0x007A);
    Lang.addTransform.call(this, "majusculeToMinuscule", 0x0020, "BasicLatin", 0x0041, 0x005A);
  }

  EngLang.prototype = Object.create(Lang.prototype);
  let Me = EngLang.prototype;
  Me.constructor = EngLang;

  //https://en.wikipedia.org/wiki/List_of_numbers
  const lookup = {
    0: "zero", 1: "one", 2: "two", 3:"three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine",

    10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
    14: "fourteen", 15: "fifteen",

    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",

    100: "hundred",
    1000: "thousand",
    1000000: "million",
    1000000000: "billion"
  },
  bigNbr = [
    100, 1000, 1000000, 1000000000
    //1000000000, 1000000, 1000, 100, 10
  ];

  /*
  * Write the Arabic number into English letters
  * @override
  */
  Me.pronounceNumber = toEnglishLetters;


  /**
  * Transform from Arabic numbers to English letters
  * @method toEnglishLetters
  * @private
  * @param {Number} nbr the integer number
  * @return {String} English writing of numbers
  */
  function toEnglishLetters(num) {
    return toEnglishLetters2(num, true);
  }

  /**
  * Transform from Arabic numbers to English letters
  * @method toEnglishLetters2
  * @private
  * @param {Number} nbr the integer number
  * @param {boolean} comma put a comma or not
  * @return {String} English writing of numbers
  */
  function toEnglishLetters2(num, comma) {

    if (isNaN(num)) return "";

    if(num < 0) return "minus " + toEnglishLetters2(-num, true);

    if (num < 10) return lookup[num];

    if (num < 100 ){
      let div = ~~(num/10),
      rem = ~~(num % 10);

      if (div == 1){
        if (rem < 6) return lookup[num];
        return lookup[rem] + "teen";
      }

      let tenth = "";

      if (div == 8) tenth = "eighty";
      else if (div < 6) tenth = lookup[div * 10];
      else tenth = lookup[div] + "ty";

      if (rem == 0) return tenth;

      return tenth + "-" + lookup[rem];

    }


    let bigIdx = bigNbr.length -1;
    while (bigIdx >= 0 && num < bigNbr[bigIdx]) bigIdx--;

    let div = ~~(num/bigNbr[bigIdx]),
    rem = ~~(num % bigNbr[bigIdx]);

    let pronounce = toEnglishLetters2(div, false) + " " + lookup[bigNbr[bigIdx]];

    //if (div > 1) pronounce += "s"; //plural

    if (rem > 0){
      if (comma) pronounce += ", " + toEnglishLetters2(rem, comma);
      else pronounce += " " + toEnglishLetters2(rem, comma);
    }

    return pronounce;

  }

}());
