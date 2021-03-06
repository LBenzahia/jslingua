(function () {

  "use strict";

  //TODO see https://en.wikipedia.org/wiki/English_irregular_verbs#List
  let Morpho = {};
  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    Morpho = require("../morpho.js");
    module.exports = EngMorpho;
  } else {
    Morpho = window.JsLingua.Cls.Morpho;
    window.JsLingua.addService("Morpho", "eng", EngMorpho);
  }

  //Different global features
  let F = Morpho.Feature,
  Tense = F.Tense,
  Mood = F.Mood,
  Voice = F.Voice,
  GNumber = F.Number,
  Aspect = F.Aspect,
  Gender = F.Gender,
  Person = F.Person;

  let g;

  function EngMorpho() {
    Morpho.call(this, "eng");
    Morpho.newStemmer.call(this, "porterStemmer", "English proter stemmr", porterStemmer);
    Morpho.newStemmer.call(this, "lancasterStemmer", "English Lnacaster stemmer", lancasterStemmer);
    g = this.g;
  }

  EngMorpho.prototype = Object.create(Morpho.prototype);
  let Me = EngMorpho.prototype;

  Me.constructor = EngMorpho;

  Me.getPronounOpts = function() {
    return [
        {person:Person.F, number: GNumber.S}, //I
        {person:Person.S},//You
        {person:Person.T, number: GNumber.S, gender: Gender.M},//He
        {person:Person.T, number: GNumber.S, gender: Gender.F},//She
        {person:Person.T, number: GNumber.S, gender: Gender.N},//It
        {person:Person.F, number: GNumber.P}, //We
        {person:Person.T, number: GNumber.P}//They
    ];
  };


  Me.getPronounName = function(opts) {
    switch (opts.person) {
      case Person.F:
      if (opts.number === GNumber.S) return "I";
      else return "We";

      case Person.S:
      return "You";

      case Person.T:
      if (opts.number == GNumber.S) {
        switch (opts.gender) {
          case Gender.M: return "He";
          case Gender.F: return "She";
          default: return "It";
        }
      }
      else return "They";

    }
    return "";
  };


  Me.getForms = function() {
    //super doesn't work here
    let superFrm = Morpho.prototype.getForms.call(this);
    const engForms =  {
      "Indicative present perfect": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.P
      },
      "Indicative past perfect": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.P
      },
      "Indicative future perfect": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.P
      },
      "Indicative present continuous": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.C
      },
      "Indicative past continuous": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.C
      },
      "Indicative future continuous": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.C
      },
      "Indicative present perfect continuous": {
        mood: Mood.Ind,
        tense: Tense.Pr,
        aspect: Aspect.PC
      },
      "Indicative past perfect continuous": {
        mood: Mood.Ind,
        tense: Tense.Pa,
        aspect: Aspect.PC
      },
      "Indicative future perfect continuous": {
        mood: Mood.Ind,
        tense: Tense.Fu,
        aspect: Aspect.PC
      }
    };

    return Object.assign({}, superFrm, engForms);
  };

  //let C = Object.freeze;

  //=================
  //Conjugation zone
  //=================

  //https://en.wikipedia.org/wiki/List_of_English_irregular_verbs
  //TODO will, can, shall

  const beHave = {
    "be":  {
      Pr: ["am", "is", "are"],
      Pa: ["was", "was", "were"],
      Pp: "been"
    },
    "have":  {
      Pr: ["have", "has", "have"],
      Pa: ["had", "had", "had"],
      Pp: "had"
    }
  },
  irregular0 = {
    "bet": 1, "bid": 1, "broadcast": 1, "burst": 1,  "cast": 1, "clad": 1,
    "clearcut": 1, "cost": 1, "crosscut": 1, "cut": 1, "fit": 1, "handset": 1,
    "hit": 1, "hurt": 1, "intercut": 1, "let": 1, "lipread": 1, "podcast": 1,
    "precast": 1, "proofread": 1, "put": 1, "quit": 1, "read": 1, "retrofit": 1,
    "set": 1, "shed": 1, "shut": 1, "simulcast": 1, "slit": 1, "spit": 1,
    "split": 1, "spread": 1, "sublet": 1, "telecast": 1, "thrust": 1,
    "typecast": 1, "typeset": 1, "webcast": 1, "wed": 1
  },
  irregular1 = {
    "babysit": "babysat", "bend": "bent", "beseech": "besought",
    "besprenge": "besprent", "bind": "bound", "bleed": "bled",
    "breastfeed": "breastfed", "breed": "bred", "bring": "brought",
    "build": "built", "buy": "bought", "catch": "caught",
    "cling": "clung", "creep": "crept", "deal": "dealt",
    "dig": "dug", "feed": "fed", "feel": "felt",
    "fight": "fought", "find": "found", "flee": "fled",
    "fling": "flung", "forthlead": "forthled", "forthtell": "forthtold",
    "get": "got", "hamstring": "hamstrung", "handspring": "handsprung",
    "hang": "hung", "hear": "heard", "hold": "held",
    "housesit": "housesat", "interbreed": "interbred", "interlay": "interlaid",
    "keep": "kept", "lay": "laid", "lead": "led", "leave": "left",
    "lend": "lent", "lose": "lost", "make": "made", "mean": "meant",
    "meet": "met", "naysay": "naysaid", "onlay": "onlaid", "onlead": "onled",
    "pay": "paid", "rend": "rent", "say": "said", "seek": "sought",
    "sell": "sold", "send": "sent", "shrink": "shrunk", "shoot": "shot",
    "sink": "sunk", "sit": "sat", "sleep": "slept", "slide": "slid",
    "sling": "slung", "slit": "slit", "soothsay": "soothsaid", "spend": "spent",
    "spin": "spun", "sprenge": "sprent","spring": "sprung", "stand": "stood",
    "stick": "stuck", "sting": "stung", "stink": "stunk", "strike": "struck",
    "string": "strung", "sweep": "swept", "swing": "swung", "teach": "taught",
    "tell": "told", "think": "thought", "tread": "trod", "understand": "understood",
    "waylay": "waylaid", "win": "won", "wind": "wound", "wring": "wrung"
  },
  irregular2 = {
    "acknow":  ["acknew", "1n"], "ake":  ["oke", "1n"], "arise":  ["arose", "1n"],
    "awake":  ["awoke", "2n"], "bear":  ["bore", "born"], "beat":  ["1", "1en"],
    "bedo":  ["bedid", "1ne"], "begin":  ["began", "begun"], "bego":  ["bewent", "1ne"],
    "bite":  ["bit", "2ten"], "blow":  ["blew", "1n"], "break":  ["broke", "2n"],
    "browbeat":  ["1", "1en"], "choose":  ["chose", "2n"], "come":  ["came", "1"],
    "cowrite":  ["cowrote", "1-ten"], "do":  ["did", "1ne"], "downdraw":  ["downdrew", "1n"],
    "draw":  ["drew", "1n"], "drink":  ["drank", "drunk"], "drive":  ["drove", "1n"],
    "eat":  ["ate", "1en"], "fall":  ["fell", "1en"], "fly":  ["flew", "flown"],
    "forbid":  ["1", "1den"], "forego":  ["forewent", "1ne"], "forgo":  ["forwent", "1ne"],
    "forlend":  ["forlent", "forlen"], "freeze":  ["froze", "2n"],
    "frostbite":  ["frostbit", "2ten"], "ghostwrite":  ["ghostwrote", "1-ten"],
    "give":  ["gave", "1n"], "go":  ["went", "gone"], "grow":  ["grew", "1n"],
    "handwrite":  ["handwrote", "1-ten"], "hide":  ["hid", "2den"],
    "interweave":  ["interwove", "2n"], "know":  ["knew", "1n"],
    "lie":  ["lay", "lain"], "misdo":  ["misdid", "1ne"], "outdo":  ["outdid", "1ne"],
    "overdo":  ["overdid", "1ne"], "partake":  ["partook", "1n"],
    "redo":  ["redid", "1ne"], "ride":  ["rode", "ridden"], "ring":  ["rang", "rung"],
    "rise":  ["rose", "1n"], "run":  ["ran", "run"], "see":  ["saw", "1n"],
    "shake":  ["shook", "1n"], "sightsee":  ["sightsaw", "1n"],
    "sing":  ["sang", "sung"], "smite":  ["smote", "1-ten"],
    "speak":  ["spoke", "2n"], "steal":  ["stole", "2n"],
    "stride":  ["strode", "1-den"], "swear":  ["swore", "2-n"],
    "swim":  ["swam", "swum"], "swink":  ["swonk", "2en"],
    "take":  ["took", "1n"], "tear":  ["tore", "torn"], "throw":  ["threw", "1-n"],
    "toswink":  ["toswank", "toswunken"], "underdo":  ["underdid", "1ne"],
    "undergo":  ["underwent", "1ne"], "undo":  ["undid", "1ne"],
    "wake":  ["woke", "2n"], "wear":  ["wore", "worn"], "weave":  ["wove", "2n"],
    "withgo":  ["withwent", "1ne"], "write":  ["wrote", "1-ten"]
  };

  function beHaveConj(verb, idx, opts) {
    if (! (verb in beHave)) return verb;
    if (! "Pr|Pa|Pp".includes(idx)) return verb;
    if (idx === "Pp") return beHave[verb][idx];

    if (opts.number === GNumber.S) {
      if (opts.person == Person.F) return beHave[verb][idx][0];
      else if (opts.person == Person.T) return beHave[verb][idx][1];
      return beHave[verb][idx][2];
    }

    return beHave[verb][idx][2];
  }


  function isIrregular(verb) {
    if (irregular0[verb]) return 1;
    if (irregular1[verb]) return 1;
    if (irregular2[verb]) return 1;
    return 0;//false
  }

  /**
   * Not safe: must be used with isIrregular
   * @method irregularConj
   * @param  {[type]}      verb [description]
   * @param  {[type]}      idx  0 for past, 1 for past participle
   * @return {[type]}           [description]
   */
  function irregularConj(verb, idx) {
    if (irregular0[verb]) return verb;
    if (irregular1[verb])return irregular1[verb];
    //Here, we suppose it is irregular2[verb]
    let res = irregular2[verb][idx];
    res = res.replace("1", verb);
    if(idx === 1) {
      res = res.replace("2", irregular2[verb][0]);
      res = res.replace(/.-/,"");
    }
    return res;
  }

  //Override conjugate function
  Me.conjugate = function(verb, opts) {

    if((opts.mood) && (opts.mood === Mood.Imp)) {
      if(opts.person === Person.S) return verb;
      return "";
    }

    let begin = "", end = "";

    if ((opts.voice) && (opts.voice === Voice.P)) {
      if (beHave[verb]) end = " " + beHaveConj(verb, "Pp", opts);
      else if (isIrregular(verb)) end = " " + irregularConj(verb, 1);
      else end = " " + this.conjugate(verb, {tense:Tense.Pa});
      verb = "be";
    }

    if (opts.aspect) {
      if ([Aspect.C, Aspect.PC].includes(opts.aspect)) {
        // http://www.eclecticenglish.com/grammar/PresentContinuous1G.html
        let base = verb;
        if(["lie", "die"].includes(verb)) base = verb.slice(0,-2) + "y";
        else if (/^[^aeuio]*[aeuio][^aeuioy]$/g.test(verb)) base = verb + verb.slice(-1);
        else if (/^.{2,}e$/g.test(verb)) base = verb.slice(0,-1);

        end = " " + base + "ing" + end;
        verb = "be";
      }

      if ([Aspect.P, Aspect.PC].includes(opts.aspect)) {
        if (beHave[verb]) end = " " + beHaveConj(verb, "Pp", opts) + end;
        else if (isIrregular(verb)) end = " " + irregularConj(verb, 1) + end;
        else end = " " + this.conjugate(verb, {tense:Tense.Pa}) + end;
        verb = "have";
      }
    }

    if ((opts.negated) && (opts.tense !== Tense.Fu)) {
      end = " not" + end;
      if ((!opts.aspect) || opts.aspect === Aspect.S) {
        if ((!opts.voice) || opts.voice === Voice.A) {
          end += " " + verb;
          verb = "do";
          //console.log("negation active aspect");
        }
      }
    }

    switch (opts.tense) {

      case Tense.Pr:
      if (beHave[verb]) return begin + beHaveConj(verb, "Pr", opts) + end;
      if (opts.person == Person.T && opts.number === GNumber.S) {
        //hurry, clarify
        verb = verb.replace(/([^aeuio])y$/, "$1ie");
        //go, veto, do, wash, mix, fizz (add e )
        verb = verb.replace(/(s|z|sh|ch|[^aeui]o)$/, "$1e");
        end = "s" + end;
      }
      break;

      case Tense.Pa:
      //To be, To have
      if (beHave[verb]) return begin + beHaveConj(verb, "Pa", opts) + end;
      //Irregular (the block is just for variables)
      {
        const pref = /(back|be|down|fore|for|in|mis|off|out|over|pre|re|sub|under|un|up|with)(.{3,})/gi;
        let match = pref.exec(verb);
        if (match) {
          //verify if the verb is in Irregular list with the prefix
          if (isIrregular(verb)) return begin + irregularConj(verb, 0) + end;
          //Otherwise, delete the prefix and procede
          begin = match[1];
          verb = match[2];
        }
      }

      if (isIrregular(verb)) return begin + irregularConj(verb, 0) + end;

      verb = verb.replace(/([^aeuio])y$/, "$1i");
      verb = verb.replace(/c$/, "ck");
      verb = verb.replace(/^([^aeuio]*[aeuio])([^aeuiohwxy])$/, "$1$2$2");
      if (verb.endsWith("e")) end = "d" + end;
      else end = "ed" + end;
      break;

      case Tense.Fu:
      begin = "will ";
      if (opts.negated) begin += "not ";
      break;

    }//swich(tense)

    return begin + verb + end;

  };

  //=========================================================
  //                 STEMMERS
  //=========================================================

  /*
  To validate this implementation,I rely largely on these resources:
  url1: http://snowballstem.org/algorithms/porter/stemmer.html
  url2: https://github.com/kristopolous/Porter-Stemmer/blob/master/PorterStemmer1980.js
  */
  const step2list = {
    "ational" : "ate",
    "tional" : "tion",
    "enci" : "ence",
    "anci" : "ance",
    "izer" : "ize",
    "bli" : "ble",
    "alli" : "al",
    "entli" : "ent",
    "eli" : "e",
    "ousli" : "ous",
    "ization" : "ize",
    "ation" : "ate",
    "ator" : "ate",
    "alism" : "al",
    "iveness" : "ive",
    "fulness" : "ful",
    "ousness" : "ous",
    "aliti" : "al",
    "iviti" : "ive",
    "biliti" : "ble",
    "logi" : "log"
  },
  step3list = {
    "icate" : "ic",
    "ative" : "",
    "alize" : "al",
    "iciti" : "ic",
    "ical" : "ic",
    "ful" : "",
    "ness" : ""
  },
  c = "[^aeiou]",          // consonant
  v = "[aeiouy]",          // vowel
  C = c + "[^aeiouy]*",    // consonant sequence
  V = v + "[aeiou]*",      // vowel sequence
  mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
  meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
  mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
  s_v = "^(" + C + ")?" + v;                   // vowel in stem


  function porterStemmer(word) {
    let stemmed,
    suffix,
    firstch,
    re,
    re2,
    re3,
    re4;
    //origword = word;

    if (word.length < 3) { return word; }

    firstch = word.substr(0,1);
    if (firstch == "y") {
      word = firstch.toUpperCase() + word.substr(1);
    }
    // Step 1a
    re = /^(.+?)(ss|i)es$/;
    re2 = /^(.+?)([^s])s$/;

    if (re.test(word)) {
      word = word.replace(re,"$1$2");
      g.debugFunction("1a",re, word);

    }
    else if (re2.test(word)) {
      word = word.replace(re2,"$1$2");
      g.debugFunction("1a",re2, word);
    }

    // Step 1b
    re = /^(.+?)eed$/;
    re2 = /^(.+?)(ed|ing)$/;
    if (re.test(word)) {
      let fp = re.exec(word);
      re = new RegExp(mgr0);
      if (re.test(fp[1])) {
        re = /.$/;
        word = word.replace(re,"");
        g.debugFunction("1b",re, word);
      }
    }
    else if (re2.test(word)) {
      let fp = re2.exec(word);
      stemmed = fp[1];
      re2 = new RegExp(s_v);
      if (re2.test(stemmed)) {
        word = stemmed;
        g.debugFunction("1b", re2, word);

        re2 = /(at|bl|iz)$/;
        re3 = new RegExp("([^aeiouylsz])\\1$");
        re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");

        if (re2.test(word)) {
          word = word + "e";
          g.debugFunction("1b", re2, word);

        }
        else if (re3.test(word)) {
          re = /.$/;
          word = word.replace(re,"");
          g.debugFunction("1b", re3, word);

        }
        else if (re4.test(word)) {
          word = word + "e";
          g.debugFunction("1b", re4, word);
        }
      }
    }

    // Step 1c
    re = new RegExp("^(.*" + v + ".*)y$");
    if (re.test(word)) {
      let fp = re.exec(word);
      stemmed = fp[1];
      word = stemmed + "i";
      g.debugFunction("1c", re, word);
    }

    // Step 2
    re = new RegExp("^(.+?)(" + Object.keys(step2list).join("|") + ")$");
    //re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
    if (re.test(word)) {
      let fp = re.exec(word);
      stemmed = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stemmed)) {
        word = stemmed + step2list[suffix];
        g.debugFunction("2", re, word);
      }
    }

    // Step 3
    re = new RegExp("^(.+?)(" + Object.keys(step3list).join("|") + ")$");
    //re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
    if (re.test(word)) {
      let fp = re.exec(word);
      stemmed = fp[1];
      suffix = fp[2];
      re = new RegExp(mgr0);
      if (re.test(stemmed)) {
        word = stemmed + step3list[suffix];
        g.debugFunction("3", re, word);
      }
    }

    // Step 4
    re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
    re2 = /^(.+?)(s|t)(ion)$/;
    if (re.test(word)) {
      let fp = re.exec(word);
      stemmed = fp[1];
      re = new RegExp(mgr1);
      if (re.test(stemmed)) {
        word = stemmed;
        g.debugFunction("4", re, word);
      }
    }
    else if (re2.test(word)) {
      let fp = re2.exec(word);
      stemmed = fp[1] + fp[2];
      re2 = new RegExp(mgr1);
      if (re2.test(stemmed)) {
        word = stemmed;
        g.debugFunction("4", re2, word);
      }
    }

    // Step 5
    re = /^(.+?)e$/;
    if (re.test(word)) {
      let fp = re.exec(word);
      stemmed = fp[1];
      re = new RegExp(mgr1);
      re2 = new RegExp(meq1);
      re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
      if (re.test(stemmed) || (re2.test(stemmed) && !(re3.test(stemmed)))) {
        word = stemmed;
        g.debugFunction("5", re, re2, re3, word);
      }
    }

    re = /ll$/;
    re2 = new RegExp(mgr1);
    if (re.test(word) && re2.test(word)) {
      re = /.$/;
      word = word.replace(re,"");
      g.debugFunction("5", re, re2, word);
    }

    // and turn initial Y back to y
    if (firstch == "y") {
      word = firstch.toLowerCase() + word.substr(1);
    }

    return word;
  }
/* Lancaster Stemmer

(The MIT License)

Copyright (c) 2014 Titus Wormer <tituswormer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
// initial variables
const STOP = -1;
const INTACT = 0;
const CONTINUE = 1;
const PROTECT = 2;
const VOWELS = /[aeiouy]/;
// rules
const rules = {
  a: [
    {match: 'ia', replacement: '', type: INTACT},
    {match: 'a', replacement: '', type: INTACT}
  ],
  b: [{match: 'bb', replacement: 'b', type: STOP}],
  c: [
    {match: 'ytic', replacement: 'ys', type: STOP},
    {match: 'ic', replacement: '', type: CONTINUE},
    {match: 'nc', replacement: 'nt', type: CONTINUE}
  ],
  d: [
    {match: 'dd', replacement: 'd', type: STOP},
    {match: 'ied', replacement: 'y', type: CONTINUE},
    {match: 'ceed', replacement: 'cess', type: STOP},
    {match: 'eed', replacement: 'ee', type: STOP},
    {match: 'ed', replacement: '', type: CONTINUE},
    {match: 'hood', replacement: '', type: CONTINUE}
  ],
  e: [{match: 'e', replacement: '', type: CONTINUE}],
  f: [
    {match: 'lief', replacement: 'liev', type: STOP},
    {match: 'if', replacement: '', type: CONTINUE}
  ],
  g: [
    {match: 'ing', replacement: '', type: CONTINUE},
    {match: 'iag', replacement: 'y', type: STOP},
    {match: 'ag', replacement: '', type: CONTINUE},
    {match: 'gg', replacement: 'g', type: STOP}
  ],
  h: [
    {match: 'th', replacement: '', type: INTACT},
    {match: 'guish', replacement: 'ct', type: STOP},
    {match: 'ish', replacement: '', type: CONTINUE}
  ],
  i: [
    {match: 'i', replacement: '', type: INTACT},
    {match: 'i', replacement: 'y', type: CONTINUE}
  ],
  j: [
    {match: 'ij', replacement: 'id', type: STOP},
    {match: 'fuj', replacement: 'fus', type: STOP},
    {match: 'uj', replacement: 'ud', type: STOP},
    {match: 'oj', replacement: 'od', type: STOP},
    {match: 'hej', replacement: 'her', type: STOP},
    {match: 'verj', replacement: 'vert', type: STOP},
    {match: 'misj', replacement: 'mit', type: STOP},
    {match: 'nj', replacement: 'nd', type: STOP},
    {match: 'j', replacement: 's', type: STOP}
  ],
  l: [
    {match: 'ifiabl', replacement: '', type: STOP},
    {match: 'iabl', replacement: 'y', type: STOP},
    {match: 'abl', replacement: '', type: CONTINUE},
    {match: 'ibl', replacement: '', type: STOP},
    {match: 'bil', replacement: 'bl', type: CONTINUE},
    {match: 'cl', replacement: 'c', type: STOP},
    {match: 'iful', replacement: 'y', type: STOP},
    {match: 'ful', replacement: '', type: CONTINUE},
    {match: 'ul', replacement: '', type: STOP},
    {match: 'ial', replacement: '', type: CONTINUE},
    {match: 'ual', replacement: '', type: CONTINUE},
    {match: 'al', replacement: '', type: CONTINUE},
    {match: 'll', replacement: 'l', type: STOP}
  ],
  m: [
    {match: 'ium', replacement: '', type: STOP},
    {match: 'um', replacement: '', type: INTACT},
    {match: 'ism', replacement: '', type: CONTINUE},
    {match: 'mm', replacement: 'm', type: STOP}
  ],
  n: [
    {match: 'sion', replacement: 'j', type: CONTINUE},
    {match: 'xion', replacement: 'ct', type: STOP},
    {match: 'ion', replacement: '', type: CONTINUE},
    {match: 'ian', replacement: '', type: CONTINUE},
    {match: 'an', replacement: '', type: CONTINUE},
    {match: 'een', replacement: '', type: PROTECT},
    {match: 'en', replacement: '', type: CONTINUE},
    {match: 'nn', replacement: 'n', type: STOP}
  ],
  p: [
    {match: 'ship', replacement: '', type: CONTINUE},
    {match: 'pp', replacement: 'p', type: STOP}
  ],
  r: [
    {match: 'er', replacement: '', type: CONTINUE},
    {match: 'ear', replacement: '', type: PROTECT},
    {match: 'ar', replacement: '', type: STOP},
    {match: 'ior', replacement: '', type: CONTINUE},
    {match: 'or', replacement: '', type: CONTINUE},
    {match: 'ur', replacement: '', type: CONTINUE},
    {match: 'rr', replacement: 'r', type: STOP},
    {match: 'tr', replacement: 't', type: CONTINUE},
    {match: 'ier', replacement: 'y', type: CONTINUE}
  ],
  s: [
    {match: 'ies', replacement: 'y', type: CONTINUE},
    {match: 'sis', replacement: 's', type: STOP},
    {match: 'is', replacement: '', type: CONTINUE},
    {match: 'ness', replacement: '', type: CONTINUE},
    {match: 'ss', replacement: '', type: PROTECT},
    {match: 'ous', replacement: '', type: CONTINUE},
    {match: 'us', replacement: '', type: INTACT},
    {match: 's', replacement: '', type: CONTINUE},
    {match: 's', replacement: '', type: STOP}
  ],
  t: [
    {match: 'plicat', replacement: 'ply', type: STOP},
    {match: 'at', replacement: '', type: CONTINUE},
    {match: 'ment', replacement: '', type: CONTINUE},
    {match: 'ent', replacement: '', type: CONTINUE},
    {match: 'ant', replacement: '', type: CONTINUE},
    {match: 'ript', replacement: 'rib', type: STOP},
    {match: 'orpt', replacement: 'orb', type: STOP},
    {match: 'duct', replacement: 'duc', type: STOP},
    {match: 'sumpt', replacement: 'sum', type: STOP},
    {match: 'cept', replacement: 'ceiv', type: STOP},
    {match: 'olut', replacement: 'olv', type: STOP},
    {match: 'sist', replacement: '', type: PROTECT},
    {match: 'ist', replacement: '', type: CONTINUE},
    {match: 'tt', replacement: 't', type: STOP}
  ],
  u: [
    {match: 'iqu', replacement: '', type: STOP},
    {match: 'ogu', replacement: 'og', type: STOP}
  ],
  v: [
    {match: 'siv', replacement: 'j', type: CONTINUE},
    {match: 'eiv', replacement: '', type: PROTECT},
    {match: 'iv', replacement: '', type: CONTINUE}
  ],
  y: [
    {match: 'bly', replacement: 'bl', type: CONTINUE},
    {match: 'ily', replacement: 'y', type: CONTINUE},
    {match: 'ply', replacement: '', type: PROTECT},
    {match: 'ly', replacement: '', type: CONTINUE},
    {match: 'ogy', replacement: 'og', type: STOP},
    {match: 'phy', replacement: 'ph', type: STOP},
    {match: 'omy', replacement: 'om', type: STOP},
    {match: 'opy', replacement: 'op', type: STOP},
    {match: 'ity', replacement: '', type: CONTINUE},
    {match: 'ety', replacement: '', type: CONTINUE},
    {match: 'lty', replacement: 'l', type: STOP},
    {match: 'istry', replacement: '', type: STOP},
    {match: 'ary', replacement: '', type: CONTINUE},
    {match: 'ory', replacement: '', type: CONTINUE},
    {match: 'ify', replacement: '', type: STOP},
    {match: 'ncy', replacement: 'nt', type: CONTINUE},
    {match: 'acy', replacement: '', type: CONTINUE}
  ],
  z: [
    {match: 'iz', replacement: '', type: CONTINUE},
    {match: 'yz', replacement: 'ys', type: STOP}
  ]
};

function lancasterStemmer(word){
  return applyRules(String(word).toLowerCase(), true);
}

function applyRules(value, isIntact) {
  let ruleset = rules[value.charAt(value.length - 1)];
  let breakpoint;
  let index;
  let length;
  let rule;
  let next;

  if (!ruleset) {
    return value;
  }

  index = -1;
  length = ruleset.length;

  while (++index < length) {
    rule = ruleset[index];

    if (!isIntact && rule.type === INTACT) {
      continue;
    }

    breakpoint = value.length - rule.match.length;

    if (breakpoint < 0 || value.substr(breakpoint) !== rule.match) {
      continue;
    }

    if (rule.type === PROTECT) {
      return value;
    }

    next = value.substr(0, breakpoint) + rule.replacement;

    if (!acceptable(next)) {
      continue;
    }

    if (rule.type === CONTINUE) {
      return applyRules(next, false);
    }

    return next;
  }

  return value;
}
/* Detect if a value is acceptable to return, or should
 * be stemmed further. */
function acceptable(value) {
  return VOWELS.test(value.charAt(0)) ?
    value.length > 1 : value.length > 2 && VOWELS.test(value);
}

/*===================End Lancaster Stemmer===================*/


  //http://teflpedia.com/Non-standard_English
  const norm = {
    "ain't": "is not",
    "innit": "is not it",
    "gonna": "going to",
    "gotta": "have to",
    "outta": "out of",
    "sorta": "sort of",
    "wanna": "want to",
    "y'all": "you all",
    "C'mon": "come on",
    "cop": "policeman",
    "'cos'": "because",
    "don't": "do not",
    "doesn't": "does not",
    "won't": "will not",
    "lil'": "little",
    "dunno": "do not know",
    "gimme": "give me",
    "kinda": "kind of",
    "lemme": "let me",
    "lotta": "lot of",
    "ma": "mother",
    "luv": "love",
    "yeah": "yes",
    "wot": "what"
  };

  Me.normalize = function(word, _opts){
    let result = norm[word];
    if(result) return result;
    return word;
  };

}());
