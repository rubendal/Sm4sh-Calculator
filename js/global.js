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

function loadJSONPath(path) {
    var json = null;
    $.ajax({
        'async': false,
        'url': path,
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
}

class Modifier {
    constructor(name, damage_dealt, damage_taken, kb_dealt, kb_received) {
        this.name = name;
        this.damage_dealt = damage_dealt;
        this.damage_taken = damage_taken;
        this.kb_dealt = kb_dealt;
        this.kb_received = kb_received;
    }
};

var monado = [
    new Modifier("Jump", 1, 1.22, 1, 1),
    new Modifier("Speed", 0.8, 1, 1, 1),
    new Modifier("Shield", 0.8, 0.67, 1, 1),
    new Modifier("Buster", 1.4, 1.13, 0.68, 1),
    new Modifier("Smash", 0.5, 1, 1.18, 1.07)
];

class Character {
    constructor(name) {
        this.addModifier = function (modifier) {
            this.modifier = modifier;
        }
        this.modifier = new Modifier("", 1, 1, 1, 1);
        for (var i = 0; i < monado.length; i++) {
            if (name.includes("(" + monado[i].name + ")")) {
                this.modifier = monado[i];
                this.name = name.split(" ")[0];
            }
        }
        if (name.includes("(Deep Breathing (Fastest))")) {
            this.modifier = new Modifier("Deep Breathing (Fastest)",1.2,1,1,1);
            this.name = "Wii Fit Trainer";
        }
        if (name.includes("(Deep Breathing (Slowest))")) {
            this.modifier = new Modifier("Deep Breathing (Fastest)", 1.16, 1, 1, 1);
            this.name = "Wii Fit Trainer";
        }
        if(this.name == null){
            this.name = name;
        }
        if (name != "Cloud (Limit Break)") {
            this.params = loadJSON(this.name);
        } else {
            this.params = loadJSONPath("./Data/Cloud/params limit break.json");
        }
        
        
    }

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

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Cloud (Limit Break)", "Corrin", "Bayonetta"];

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

for (var i = 0; i < monado.length; i++) {
    characters.push("Shulk (" + monado[i].name + ")");
    characters.push("Kirby (" + monado[i].name + ")");
}

characters.push("Wii Fit Trainer (Deep Breathing (Fastest))");
characters.push("Wii Fit Trainer (Deep Breathing (Slowest))");

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            r = 0.85;
            break;
        case "grounded":
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