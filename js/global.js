function loadJSON(name) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Data/" + name + "/attributes.json",
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
    new Modifier("Shield", 0.7, 0.67, 1, .78),
    new Modifier("Buster", 1.4, 1.13, 0.68, 1),
    new Modifier("Smash", 0.5, 1, 1.18, 1.07)
];

var decisive_monado = [
    new Modifier("Decisive Jump", 1, 1.22, 1, 1),
    new Modifier("Decisive Speed", 0.8, 1, 1, 1),
    new Modifier("Decisive Shield", .7, 0.603, 1, .702),
    new Modifier("Decisive Buster", 1.4 * 1.1, 1.13, 0.68, 1),
    new Modifier("Decisive Smash", 0.5, 1, 1.18 * 1.1, 1.07)
];

var hyper_monado = [
    new Modifier("Hyper Jump", 1, 1.22*1.2, 1, 1),
    new Modifier("Hyper Speed", 0.64, 1, 1, 1),
    new Modifier("Hyper Shield", 0.56, 0.536, 1, .624),
    new Modifier("Hyper Buster", 1.4 * 1.2, 1.13 * 1.2, 0.544, 1),
    new Modifier("Hyper Smash", 0.4, 1, 1.18 * 1.2, 1.07 * 1.2)
];

class Character {
    constructor(n) {
        this.display_name = n;
        var name = characters[names.indexOf(n)];
        this.addModifier = function (modifier) {
            this.modifier = modifier;
        }
        this.modifier = new Modifier("", 1, 1, 1, 1);
        for (var i = 0; i < monado.length; i++) {
            if (name.includes("(" + decisive_monado[i].name + ")")) {
                this.modifier = decisive_monado[i];
                this.name = name.split(" ")[0];
                break;
            }
            if (name.includes("(" + hyper_monado[i].name + ")")) {
                this.modifier = hyper_monado[i];
                this.name = name.split(" ")[0];
                break;
            }
            if (name.includes("(" + monado[i].name + ")")) {
                this.modifier = monado[i];
                this.name = name.split(" ")[0];
                break;
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
        this.api_name = this.name;
        if (name == "Game And Watch") {
            this.api_name = "Mrgamewatch";
        }
        if (name != "Cloud (Limit Break)") {
            this.attributes = loadJSON(this.name);
        } else {
            this.attributes = loadJSONPath("./Data/Cloud/attributes limit break.json");
            this.api_name = "Cloud";
        }
        
        
    }

};

class Knockback {
    constructor(kb, angle, gravity, aerial) {
        this.base_kb = kb;
        this.kb = kb;
        this.original_angle = angle;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
        this.tumble = false;
        this.can_jablock = false;
        this.add_gravity_kb = ((this.gravity - 0.075) * 5);
        if (this.original_angle == 361) {
            this.angle = SakuraiAngle(this.kb, this.aerial);
        }
        this.calculate = function () {
            if (this.original_angle == 361) {
                this.angle = SakuraiAngle(this.kb, this.aerial);
            }
            this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
            this.y = Math.abs(Math.sin(this.angle * Math.PI / 180) * this.kb);
            if(this.kb > 80){
                this.y += this.add_gravity_kb;
            }
            this.tumble = this.kb > 80;
            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0) {
                    this.can_jablock = true;
                }
            }
            if (this.angle >= 240 && this.angle <= 300) {
                this.can_jablock = !this.tumble;
            }
        };
        this.addModifier = function (modifier) {
            this.kb *= modifier;
            this.base_kb *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.kb *= 0.8;
                this.calculate();
            }
        }
        this.calculate();
    }

    

};

class ListItem {
    constructor(attribute, value) {
        this.attribute = attribute;
        if (attribute == "Hitstun" || attribute == "Attacker Hitlag" || attribute == "Target Hitlag") {
            this.value = value + " frames";
        } else if (attribute == "Airdodge hitstun cancel" || attribute == "Aerial hitstun cancel" || attribute == "First Actionable Frame") {
            this.value = "Frame " + value;
        } else {
            this.value = value;
        }
        
    }
};

function List(values) {
    var list = [];
    var attributes = ["Damage", "Attacker Hitlag", "Target Hitlag", "Total KB", "Angle", "X", "Y", "Hitstun", "First Actionable Frame", "Airdodge hitstun cancel", "Aerial hitstun cancel"];
    var hitstun = -1;
    for (var i = 0; i < attributes.length; i++) {
        if (attributes[i] == "Hitstun") {
            hitstun = +values[i].toFixed(4);
        }
        if (hitstun != -1 && (attributes[i] == "Airdodge hitstun cancel" || attributes[i] == "Aerial hitstun cancel")) {
            if (hitstun + 1 == +values[i].toFixed(4)) {
                continue;
            }
            if (hitstun == 0) {
                continue;
            }
        }
        list.push(new ListItem(attributes[i], +values[i].toFixed(4)));
        if (attributes[i] == "Angle") {
            if (values[i] > 361) {
                i += 2;
            }
        }
    }
    return list;
}

function ShieldList(values) {
    var list = [];
    var attributes = ["Shield stun", "Shield Hitlag", "Shield Advantage" ];
    for (var i = 0; i < attributes.length; i++) {
        list[i] = new ListItem(attributes[i], values[i] + " frames");
    }
    return list;
}

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Cloud (Limit Break)", "Corrin", "Bayonetta"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Cloud (Limit Break)", "Corrin", "Bayonetta"];


var attacker = new Character("Bayonetta");
var target = new Character("Bayonetta");


var attacker_percent = 0;
var target_percent = 0;
var base_damage = 2.5;
var angle = 361;
var in_air = false;
var bkb = 15;
var kbg = 100;
var stale = 0;
var hitlag = 1;

var charge_frames = 0;

for (var i = 0; i < monado.length; i++) {
    characters.push("Shulk (" + monado[i].name + ")");
    characters.push("Shulk (" + decisive_monado[i].name + ")");
    characters.push("Shulk (" + hyper_monado[i].name + ")");
    characters.push("Kirby (" + monado[i].name + ")");
    names.push("Shulk (" + monado[i].name + ")");
    names.push("Shulk (" + decisive_monado[i].name + ")");
    names.push("Shulk (" + hyper_monado[i].name + ")");
    names.push("Kirby (" + monado[i].name + ")");
}

characters.push("Wii Fit Trainer (Deep Breathing (Fastest))");
characters.push("Wii Fit Trainer (Deep Breathing (Slowest))");
names.push("Wii Fit Trainer (Deep Breathing (Fastest))");
names.push("Wii Fit Trainer (Deep Breathing (Slowest))");

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length; i++) {
        list.push({ 'character': characters[i], 'name': names[i] });
    }
    list.sort(function (a, b) {
        return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
    });
    for (var i = 0; i < list.length; i++) {
        characters[i] = list[i].character;
        names[i] = list[i].name;
    }
}

sorted_characters();

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return  0.85;
            break;
        case "grounded":
            return 1; //0.8 applied after hitstun
            break;
        case "charging":
            return 1.2;
            break;
        case "none":
            return 1;
            break;
    }
    return 1;
}

function HitlagCrouch(value) {
    switch (value) {
        case "crouch":
            return 0.67;
            break;
    }
    return 1;
}

function HitlagElectric(value) {
    switch (value) {
        case "electric":
            return 1.5;
            break;
        case "none":
            return 1;
            break;
    }
    return 1;
}

var hitframe = 0;
var faf = 1;

var bounce = false;
var ignoreStale = false;

var powershield = false;
var is_projectile = false;

var megaman_fsmash = false;
var electric = "none";
var crouch = "none";
var is_smash = false;

var set_kb = false;

function getResults() {
    var result = { 'training': [], 'vs': [] };
    base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash);
    var damage = base_damage;
    if (attacker.name == "Lucario") {
        damage *= Aura(attacker_percent);
    }
    damage *= attacker.modifier.damage_dealt;
    damage *= target.modifier.damage_taken;
    if (!set_kb) {
        trainingkb = TrainingKB(target_percent, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, r, angle, in_air);
        vskb = VSKB(target_percent, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, r, stale, ignoreStale, attacker_percent, angle, in_air);
    } else {
        trainingkb = new Knockback(bkb * r, angle, target.attributes.gravity, in_air);
        vskb = new Knockback(bkb * r * Rage(attacker_percent), angle, target.attributes.gravity, in_air);
    }
    trainingkb.addModifier(attacker.modifier.kb_dealt);
    trainingkb.addModifier(target.modifier.kb_received);
    vskb.addModifier(attacker.modifier.kb_dealt);
    vskb.addModifier(target.modifier.kb_received);
    trainingkb.bounce(bounce);
    vskb.bounce(bounce);
    var traininglist = List([damage, Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), trainingkb.kb, trainingkb.angle, trainingkb.x, trainingkb.y, Hitstun(trainingkb.base_kb), FirstActionableFrame(trainingkb.base_kb), AirdodgeCancel(trainingkb.base_kb), AerialCancel(trainingkb.base_kb)]);
    var vslist = List([StaleDamage(damage, stale, ignoreStale), Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), vskb.kb, vskb.angle, vskb.x, vskb.y, Hitstun(vskb.base_kb), FirstActionableFrame(vskb.base_kb), AirdodgeCancel(vskb.base_kb), AerialCancel(vskb.base_kb)]);
    if (r != 1) {
        traininglist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
    }
    vslist.splice(3, 0, new ListItem("Rage", "x" + +Rage(attacker_percent).toFixed(4)));
    if (target.modifier.kb_received != 1) {
        traininglist.splice(3, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
        vslist.splice(4, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
    }
    if (attacker.modifier.kb_dealt != 1) {
        traininglist.splice(3, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
        vslist.splice(4, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
    }
    if (attacker.name == "Lucario") {
        traininglist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
        vslist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
    }
    if (is_smash) {
        traininglist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash).toFixed(4)));
        vslist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash).toFixed(4)));
    }
    if (target.modifier.damage_taken != 1) {
        traininglist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
        vslist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
    }
    if (attacker.modifier.damage_dealt != 1) {
        traininglist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
        vslist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
    }
    vslist.splice(0, 0, new ListItem("Stale-move negation", "x" + +StaleNegation(stale, ignoreStale).toFixed(4)));

    traininglist.push(new ListItem("Tumble", trainingkb.tumble ? "Yes" : "No"));
    vslist.push(new ListItem("Tumble", vskb.tumble ? "Yes" : "No"));
    traininglist.push(new ListItem("Can Jab lock", trainingkb.can_jablock ? "Yes" : "No"));
    vslist.push(new ListItem("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));

    //Shield stuff
    traininglist.push.apply(traininglist, ShieldList([ShieldStun(damage, is_projectile, powershield), ShieldHitlag(damage, hitlag, HitlagElectric(electric)), ShieldAdvantage(damage, hitlag, hitframe, faf, is_projectile, HitlagElectric(electric), powershield)]));
    vslist.push.apply(vslist, ShieldList([ShieldStun(damage, is_projectile, powershield), ShieldHitlag(damage, hitlag, HitlagElectric(electric)), ShieldAdvantage(damage, hitlag, hitframe, faf, is_projectile, HitlagElectric(electric), powershield)]));
    result.training = traininglist;
    result.vs = vslist;

    return result;
}