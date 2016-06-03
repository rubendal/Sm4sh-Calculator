function loadJSON(name) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Data/" + name + "/params.json",
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
}

class Character {
    constructor(name) {
        this.name = name;
        this.params = loadJSON(name);
    }

};

class Modifier {

};

class Knockback {
    constructor(kb, angle, gravity, aerial) {
        this.kb = kb;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
        if (this.angle == 361) {
            this.angle = SakuraiAngle(this.kb, this.aerial);
        }
        this.calculate = function () {
            this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
            this.y = Math.abs((Math.sin(this.angle * Math.PI / 180) * this.kb) + ((this.gravity - 0.075) * 5));
        };
        this.addModifier = function (modifier) {
            this.kb *= modifier;
            this.calculate();
        };
        this.calculate();
    }

    

};

class ListItem {
    constructor(attribute, value) {
        this.attribute = attribute;
        if (attribute == "Hitstun") {
            this.value = value + " frames";
        } else if (attribute == "Airdodge hitstun cancel" || attribute == "Aerial hitstun cancel") {
            this.value = "Frame " + value;
        } else {
            this.value = value;
        }
        
    }
};

function List(values) {
    var list = [];
    var attributes = ["Damage", "Total KB", "X", "Y", "Angle", "Hitstun", "Airdodge hitstun cancel", "Aerial hitstun cancel"];
    for (var i = 0; i < attributes.length; i++) {
        list[i] = new ListItem(attributes[i], +values[i].toFixed(4));
    }
    return list;
}

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta"];

var attacker = new Character("Bayonetta");
var target = new Character("Bayonetta");


var attacker_percent = 0;
var target_percent = 0;
var base_damage = 2.5;
var angle = 0;
var in_air = false;
var bkb = 15;
var kbg = 100;
var stale = 0;

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            r = 0.85;
            break;
        case "meteor":
            r = 0.8;
            break;
        case "charging":
            r = 1.2;
            break;
        case "none":
            r = 1;
            break;
    }
    return r;
}