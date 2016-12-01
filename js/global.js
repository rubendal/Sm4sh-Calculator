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

function getWebProtocol() {
    var p = document.location.protocol;
    return p.replace(":", "");
}

class Parameter {
    constructor(param, value) {
        this.param = param;
        this.value = value;
    }

    static get(list,p) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].param == p) {
                return list[i].value;
            }
        }
        return undefined;
    }
};

function getParameters() {
    var params = window.location.search;
    var list = [];
    params.replace(/([^?=&]+)(=([^&]*))?/gi, function (a, b, c, d) {
        list.push(new Parameter(b, decodeURI(d.replace("%26","&"))));
    });
    return list;
    
}

//Parameters and default values
var paramsList = [
    new Parameter("attacker", null),
    new Parameter("attackerModifier", "Normal"),
    new Parameter("attackerPercent", "0"),
    new Parameter("target", null),
    new Parameter("targetModifier", "Normal"),
    new Parameter("targetPercent", "0"),
    new Parameter("lumaPercent", "0"),
    new Parameter("baseDamage", "1.5"),
    new Parameter("angle", "55"),
    new Parameter("aerial", "0"),
    new Parameter("bkb", "45"),
    new Parameter("kbg", "25"),
    new Parameter("wbkb", "0"),
    new Parameter("smashAttack", "0"),
    new Parameter("windbox", "0"),
    new Parameter("shieldDamage", "0"),
    new Parameter("hitlag", "1"),
    new Parameter("staleness", "0"),
    new Parameter("preDamage", "0"),
    new Parameter("chargeFrames", "0"),
    new Parameter("hitFrame", "9"),
    new Parameter("faf", "26"),
    new Parameter("kbModifier", "none"),
    new Parameter("electric", "0"),
    new Parameter("vectoring", "none"),
    new Parameter("bounce", "0"),
    new Parameter("projectile", "0"),
    new Parameter("witchTime", "0"),
    new Parameter("megamanFsmash", "0"),
    new Parameter("shield", "normal"),
    new Parameter("DI", "55"),
    new Parameter("noDI", "1"),
    new Parameter("unblockable", "0"),
    new Parameter("counteredDamage", "0"),
    new Parameter("counterMult", "0"),
    new Parameter("stockDif", "0"),
    new Parameter("gameMode", "Singles"),
    new Parameter("stage", ""),
    new Parameter("positionX", "0"),
    new Parameter("positionY", "0"),
    new Parameter("visInverse", "0"),
    new Parameter("visSurface", "0"),
    new Parameter("visGameMode","vs"),
    new Parameter("KB", "0"),
    new Parameter("chargeable","0")
];

function checkUndefined(value) {
    return value == undefined;
};

function boolToString(value) {
    return value ? "1" : "0";
}

function buildParams($scope) {
    var params = [];
    if (paramsList[0].value != $scope.attackerValue) {
        params.push(new Parameter(paramsList[0].param, $scope.attackerValue));
    }
    if (paramsList[1].value != $scope.attackerMod) {
        params.push(new Parameter(paramsList[1].param, $scope.attackerMod));
    }
    if (paramsList[2].value != $scope.attackerPercent) {
        params.push(new Parameter(paramsList[2].param, $scope.attackerPercent));
    }
    if (paramsList[3].value != $scope.targetValue) {
        params.push(new Parameter(paramsList[3].param, $scope.targetValue));
    }
    if (paramsList[4].value != $scope.targetMod) {
        params.push(new Parameter(paramsList[4].param, $scope.targetMod));
    }
    if (paramsList[5].value != $scope.targetPercent) {
        params.push(new Parameter(paramsList[5].param, $scope.targetPercent));
    }
    if (paramsList[6].value != $scope.lumaPercent) {
        params.push(new Parameter(paramsList[6].param, $scope.lumaPercent));
    }
    if (paramsList[7].value != $scope.baseDamage) {
        params.push(new Parameter(paramsList[7].param, $scope.baseDamage));
    }
    if (paramsList[8].value != $scope.angle) {
        params.push(new Parameter(paramsList[8].param, $scope.angle));
    }
    if (paramsList[9].value != boolToString($scope.aerial)) {
        params.push(new Parameter(paramsList[9].param, boolToString($scope.aerial)));
    }
    if (paramsList[10].value != $scope.bkb) {
        params.push(new Parameter(paramsList[10].param, $scope.bkb));
    }
    if (paramsList[11].value != $scope.kbg) {
        params.push(new Parameter(paramsList[11].param, $scope.kbg));
    }
    if (paramsList[12].value != boolToString($scope.wbkb)) {
        params.push(new Parameter(paramsList[12].param, boolToString($scope.wbkb)));
    }
    if (paramsList[13].value != boolToString($scope.is_smash)) {
        params.push(new Parameter(paramsList[13].param, boolToString($scope.is_smash)));
    }
    if (paramsList[14].value != boolToString($scope.windbox)) {
        params.push(new Parameter(paramsList[14].param, boolToString($scope.windbox)));
    }
    if ($scope.app != "kbcalculator") {
        if (paramsList[15].value != $scope.shieldDamage) {
            params.push(new Parameter(paramsList[15].param, $scope.shieldDamage));
        }
        if (paramsList[16].value != $scope.hitlag) {
            params.push(new Parameter(paramsList[16].param, $scope.hitlag));
        }
    }
    if (paramsList[17].value != $scope.stale) {
        params.push(new Parameter(paramsList[17].param, $scope.stale));
    }
    if (paramsList[18].value != $scope.preDamage) {
        params.push(new Parameter(paramsList[18].param, $scope.preDamage));
    }
    if (paramsList[19].value != $scope.smashCharge) {
        params.push(new Parameter(paramsList[19].param, $scope.smashCharge));
    }
    if (paramsList[22].value != $scope.kb_modifier) {
        params.push(new Parameter(paramsList[22].param, $scope.kb_modifier));
    }
    if ($scope.app != "kbcalculator") {
        if (paramsList[23].value != boolToString($scope.hitlag_modifier == "electric")) {
            params.push(new Parameter(paramsList[23].param, boolToString($scope.hitlag_modifier == "electric")));
        }
    }
    if (paramsList[25].value != boolToString($scope.kb_modifier_bounce)) {
        params.push(new Parameter(paramsList[25].param, boolToString($scope.kb_modifier_bounce)));
    }
    if (paramsList[26].value != boolToString($scope.is_projectile)) {
        params.push(new Parameter(paramsList[26].param, boolToString($scope.is_projectile)));
    }
    if (paramsList[27].value != boolToString($scope.witch_time_charge)) {
        params.push(new Parameter(paramsList[27].param, boolToString($scope.witch_time_charge)));
    }
    if (paramsList[28].value != boolToString($scope.megaman_fsmash)) {
        params.push(new Parameter(paramsList[28].param, boolToString($scope.megaman_fsmash)));
    }
    if (paramsList[30].value != $scope.di) {
        params.push(new Parameter(paramsList[30].param, $scope.di));
    }
    if (paramsList[31].value != boolToString($scope.noDI)) {
        params.push(new Parameter(paramsList[31].param, boolToString($scope.noDI)));
    }
    if ($scope.app != "kbcalculator") {
        if (paramsList[20].value != $scope.hit_frame) {
            params.push(new Parameter(paramsList[20].param, $scope.hit_frame));
        }
        if (paramsList[21].value != $scope.faf) {
            params.push(new Parameter(paramsList[21].param, $scope.faf));
        }
        if (paramsList[29].value != $scope.shield) {
            params.push(new Parameter(paramsList[29].param, $scope.shield));
        }
    }
    if (paramsList[32].value != boolToString($scope.unblockable)) {
        params.push(new Parameter(paramsList[32].param, boolToString($scope.unblockable)));
    }
    if (paramsList[33].value != $scope.counteredDamage) {
        params.push(new Parameter(paramsList[33].param, $scope.counteredDamage));
    }
    if (paramsList[34].value != $scope.counterMult) {
        params.push(new Parameter(paramsList[34].param, $scope.counterMult));
    }
    if (paramsList[35].value != $scope.stock_dif) {
        params.push(new Parameter(paramsList[35].param, $scope.stock_dif));
    }
    if (paramsList[36].value != $scope.format) {
        params.push(new Parameter(paramsList[36].param, $scope.format));
    }
    if (paramsList[44].value != boolToString($scope.charge_special)) {
        params.push(new Parameter(paramsList[44].param, boolToString($scope.charge_special)));
    }
    if ($scope.app == "calculator") {
        if (paramsList[37].value != $scope.stageName) {
            params.push(new Parameter(paramsList[37].param, $scope.stageName));
        }
        if (paramsList[38].value != $scope.position_x) {
            params.push(new Parameter(paramsList[38].param, $scope.position_x));
        }
        if (paramsList[39].value != $scope.position_y) {
            params.push(new Parameter(paramsList[39].param, $scope.position_y));
        }
        if (paramsList[40].value != boolToString($scope.inverseX)) {
            params.push(new Parameter(paramsList[40].param, boolToString($scope.inverseX)));
        }
        if (paramsList[41].value != boolToString($scope.surface)) {
            params.push(new Parameter(paramsList[41].param, boolToString($scope.surface)));
        }
        if (paramsList[42].value != $scope.game_mode) {
            params.push(new Parameter(paramsList[42].param, $scope.game_mode));
        }
    } else if ($scope.app == "kbcalculator") {
        if (paramsList[43].value != $scope.kb) {
            params.push(new Parameter(paramsList[43].param, $scope.kb));
        }
    }
    return params;
}

function buildURL($scope) {
    var url = window.location.href;
    url = url.replace(window.location.search, "") + "?";
    var p = "";
    var params = buildParams($scope);
    for (var i = 0; i < params.length; i++) {
        if (i != 0) {
            p += "&";
        }
        var u = encodeURI(params[i].value);
        u = u.replace("&","%26");
        p += params[i].param + "=" + u;
    }
    return url + p;
}

var get_params = getParameters();

function mapParams($scope) {
    //Calculators
    var param = Parameter.get(get_params, "attacker");
    if (param) {
        $scope.attackerValue = param;
        $scope.updateAttacker();
    }
    param = Parameter.get(get_params, "attackerModifier");
    if (param) {
        $scope.attackerMod = param;
        $scope.updateAttackerMod();
    }
    param = Parameter.get(get_params, "target");
    if (param) {
        $scope.targetValue = param;
        $scope.updateTarget();
    }
    param = Parameter.get(get_params, "targetModifier");
    if (param) {
        $scope.targetMod = param;
        $scope.updateTargetMod();
    }
    param = Parameter.get(get_params, "attackerPercent");
    if (param) {
        $scope.attackerPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "targetPercent");
    if (param) {
        $scope.targetPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "lumaPercent");
    if (param) {
        $scope.lumaPercent = parseFloat(param);
    }
    param = Parameter.get(get_params, "baseDamage");
    if (param) {
        $scope.baseDamage = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "angle");
    if (param) {
        $scope.angle = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "aerial");
    if (param) {
        $scope.in_air = param == "1";
    }
    param = Parameter.get(get_params, "bkb");
    if (param) {
        $scope.bkb = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "wbkb");
    if (param) {
        $scope.wbkb = param == "1";
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "smashAttack");
    if (param) {
        $scope.is_smash = param == "1";
        $scope.updateAttackData();
        $scope.checkSmashVisibility();
    }
    param = Parameter.get(get_params, "windbox");
    if (param) {
        $scope.windbox = param == "1";
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "kbg");
    if (param) {
        $scope.kbg = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "shieldDamage");
    if (param) {
        $scope.shieldDamage = parseFloat(param);
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "staleness");
    if (param) {
        $scope.stale = param;
    }
    param = Parameter.get(get_params, "hitlag");
    if (param) {
        $scope.hitlag = parseFloat(param);
    }
    param = Parameter.get(get_params, "preDamage");
    if (param) {
        $scope.preDamage = param;
        $scope.updateAttackData();
    }
    param = Parameter.get(get_params, "hitFrame");
    if (param) {
        $scope.hit_frame = parseFloat(param);
    }
    param = Parameter.get(get_params, "faf");
    if (param) {
        $scope.faf = parseFloat(param);
    }
    param = Parameter.get(get_params, "electric");
    if (param) {
        $scope.hitlag_modifier = param == "1" ? "electric" : "none";
    }
    param = Parameter.get(get_params, "kbModifier");
    if (param) {
        $scope.kb_modifier = param;
    }
    param = Parameter.get(get_params, "vectoring");
    if (param) {
        $scope.vectoring = param;
    }
    param = Parameter.get(get_params, "bounce");
    if (param) {
        $scope.kb_modifier_bounce = param == "1";
    }
    param = Parameter.get(get_params, "witchTime");
    if (param) {
        $scope.witch_time_charge = param == "1";
    }
    param = Parameter.get(get_params, "megamanFsmash");
    if (param) {
        $scope.megaman_fsmash = param == "1";
    }
    param = Parameter.get(get_params, "chargeable");
    if (param) {
        $scope.charge_special = param == "1";
    }
    param = Parameter.get(get_params, "projectile");
    if (param) {
        $scope.is_projectile = param == "1";
    }
    param = Parameter.get(get_params, "shield");
    if (param) {
        $scope.shield = param;
    }
    param = Parameter.get(get_params, "DI");
    if (param) {
        $scope.di = parseFloat(param);
    }
    param = Parameter.get(get_params, "noDI");
    if (param) {
        $scope.noDI = param == 1;
    }
    param = Parameter.get(get_params, "counteredDamage");
    if (param) {
        $scope.counteredDamage = param;
    }
    param = Parameter.get(get_params, "counterMult");
    if (param) {
        $scope.counterMult = param;
    }
    param = Parameter.get(get_params, "unblockable");
    if (param) {
        $scope.unblockable = param == 1;
    }
    param = Parameter.get(get_params, "stage");
    if (param) {
        if (!checkUndefined($scope.stageName)) {
            $scope.stageName = param;
            $scope.getStage();
        }
    }
    param = Parameter.get(get_params, "positionX");
    if (param) {
        if (!checkUndefined($scope.position_x)) {
            $scope.position_x = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "positionY");
    if (param) {
        if (!checkUndefined($scope.position_y)) {
            $scope.position_y = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "stockDif");
    if (param) {
        $scope.stock_dif = param;
    }
    param = Parameter.get(get_params, "gameMode");
    if (param) {
        $scope.format = param;
    }
    param = Parameter.get(get_params, "visGameMode");
    if (param) {
        $scope.game_mode = param;
    }
    param = Parameter.get(get_params, "visInverse");
    if (param) {
        if (!checkUndefined($scope.inverseX)) {
            $scope.inverseX = param == 1;
        }
    }
    param = Parameter.get(get_params, "visSurface");
    if (param) {
        if ($scope.surface != undefined) {
            $scope.surface = param == 1;
        }
    }
    param = Parameter.get(get_params, "KB");
    if (param) {
        if ($scope.kb != undefined) {
            $scope.kb = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "chargeFrames");
    if (param) {
        $scope.smashCharge = parseFloat(param);
        $scope.updateCharge();
    }
}

var inhttp = getWebProtocol() == "http";

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var KHcharacters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "lizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "drmario", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner"];

class Modifier {
    constructor(name, damage_dealt, damage_taken, kb_dealt, kb_received, gravity, fall_speed, shield, air_friction, traction) {
        this.name = name;
        this.damage_dealt = damage_dealt;
        this.damage_taken = damage_taken;
        this.kb_dealt = kb_dealt;
        this.kb_received = kb_received;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.shield = shield;
        this.air_friction = air_friction;
        this.traction = traction;
    }
};

var monado = [
    new Modifier("Jump", 1, 1.22, 1, 1, 1.3, 1.22, 1, 1, 1),
    new Modifier("Speed", 0.8, 1, 1, 1, 1, 1, 1, 1, 1.5),
    new Modifier("Shield", 0.7, 0.67, 1, .78, 1, 1, 1.5, 1, 1),
    new Modifier("Buster", 1.4, 1.13, 0.68, 1, 1, 1, 1, 1, 1),
    new Modifier("Smash", 0.5, 1, 1.18, 1.07, 1, 1, 1, 1, 1)
];

var decisive_monado = [
    new Modifier("Decisive Jump", 1, 1.22, 1, 1, 1.43, 1.342, 1, 1, 1),
    new Modifier("Decisive Speed", 0.8, 1, 1, 1, 1.1, 1, 1, 1, 1.65),
    new Modifier("Decisive Shield", .7, 0.603, 1, .702, 1, 1, 1.5*1.1, 1, 1),
    new Modifier("Decisive Buster", 1.4 * 1.1, 1.13, 0.68, 1, 1, 1, 1, 1, 1),
    new Modifier("Decisive Smash", 0.5, 1, 1.18 * 1.1, 1.07, 1, 1, 1, 1, 1)
];

var hyper_monado = [
    new Modifier("Hyper Jump", 1, 1.22*1.2, 1, 1, 1.56, 1.464, 1, 1, 1),
    new Modifier("Hyper Speed", 0.64, 1, 1, 1, 1.2, 1, 1, 1, 1.8),
    new Modifier("Hyper Shield", 0.56, 0.536, 1, .624, 1, 1, 1.5*1.2, 1, 1),
    new Modifier("Hyper Buster", 1.4 * 1.2, 1.13 * 1.2, 0.544, 1, 1, 1, 1, 1, 1),
    new Modifier("Hyper Smash", 0.4, 1, 1.18 * 1.2, 1.07 * 1.2, 1, 1, 1, 1, 1)
];

class Character {
    constructor(n) {
        this.display_name = n;
        var name = characters[names.indexOf(n)];
        this.addModifier = function (modifier) {
            this.modifier = modifier;
        }
        this.modifier = new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1);
        this.modifiers = [];
        if (this.name == null) {
            this.name = name;
        }
        if (this.name == "Shulk") {
            this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1)];
            this.modifiers = this.modifiers.concat(monado);
            this.modifiers = this.modifiers.concat(decisive_monado);
            this.modifiers = this.modifiers.concat(hyper_monado);
        } else if (this.name == "Kirby") {
            this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1)];
            this.modifiers = this.modifiers.concat(monado);
        } else if (this.name == "Wii Fit Trainer") {
            this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1),new Modifier("Fast Deep Breathing", 1.2, 0.9, 1, 1, 1, 1, 1, 1, 1), new Modifier("Slow Deep Breathing", 1.16, 0.9, 1, 1, 1, 1, 1, 1, 1)];

        } else if (this.name == "Cloud") {
            this.modifiers = [new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1),new Modifier("Limit Break", 1, 1, 1, 1, 1.1, 1.1, 1, 1.15, 1.15)];
        }

        this.getModifier = function (name) {
            if (this.modifiers.length == 0) {
                return new Modifier("Normal", 1, 1, 1, 1, 1, 1, 1, 1, 1);
            }
            for(var i=0;i<this.modifiers.length;i++){
                if(this.modifiers[i].name == name){
                    return this.modifiers[i];
                }
            }
            return null;
        }

        this.updateIcon = function () {
            if (this.modifier.name != "Normal") {
                //Custom icons
                if (this.modifier.name == "Limit Break") {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_limit_01.png";
                } else if (this.modifier.name.includes("Deep Breathing")) {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_db_01.png";
                } else if(this.modifier.name.includes("Jump")){
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_jump_01.png";
                } else if (this.modifier.name.includes("Speed")) {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_speed_01.png";
                } else if (this.modifier.name.includes("Shield")) {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_shield_01.png";
                } else if (this.modifier.name.includes("Buster")) {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_buster_01.png";
                } else if (this.modifier.name.includes("Smash")) {
                    this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_smash_01.png";
                }
            } else {
                this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_01.png";
            }
        }
        
        this.api_name = this.name;
        if (name == "Game And Watch") {
            this.api_name = "Mrgamewatch";
        }
        this.attributes = loadJSON(this.name);
        this.icon = "./img/stock_icons/stock_90_" + gameNames[characters.indexOf(this.name)] + "_01.png";
        
        
    }

};

class Distance{
    constructor(kb, x_launch_speed, y_launch_speed, hitstun, angle, di, gravity, gravity2, air_friction, fall_speed, traction, inverseX, onSurface, position, stage, doPlot){
        this.kb = kb;
        this.x_launch_speed = x_launch_speed;
        this.y_launch_speed = y_launch_speed;
        this.hitstun = hitstun;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.traction = traction;
        this.max_x = 0;
        this.max_y = 0;
        this.graph_x = 0;
        this.graph_y = 0;
        this.inverseX = inverseX;
        this.onSurface = onSurface;
        this.tumble = false;
        this.position = {"x":0, "y":0};
        this.bounce = false;
        this.doPlot = doPlot;
        this.gravity2 = gravity2;
        this.air_friction = air_friction;
        if(position !== undefined){
            this.position = position;
        }
        this.stage = null;
        if(stage !== undefined){
            this.stage = stage;
        }
        if(kb > 80 && angle != 0 && angle != 180){
            this.tumble = true;
        }

        if(this.stage == null){
            if(this.position.y < 0 && this.onSurface){
                this.position.y = 0;
            }
        }

        this.max_x = this.position.x;
        this.max_y = this.position.y;

        var x_speed = +this.x_launch_speed.toFixed(8);
        var y_speed = +this.y_launch_speed.toFixed(8);

        if(this.inverseX){
            angle = InvertXAngle(angle);
        }
        if(this.tumble){
            angle+=di;
        }
        if(this.angle == 0 || this.angle == 180){
            if(x_speed > 8.3){
                x_speed = 8.3;
            }
        }
        if(Math.cos(angle * Math.PI / 180) < 0){
            x_speed *= -1;
        }
        if(Math.sin(angle * Math.PI / 180) < 0){
            y_speed *= -1;
        }
        this.x = [this.position.x];
        this.y = [this.position.y];
        var decay = {'x':0.051 * Math.cos(angle * Math.PI / 180),'y':0.051 * Math.sin(angle * Math.PI / 180)};
        var character_position = {'x':this.position.x,'y':this.position.y};
        var launch_speed = {'x':x_speed, 'y':y_speed};
        var friction =  {'x':air_friction * Math.cos(angle * Math.PI / 180),'y':air_friction * Math.sin(angle * Math.PI / 180)};
        var character_speed = {'x':0,'y':0 };
        this.vertical_speed = [];
        var momentum = 1;
        var g = 0;
        var fg = 0;
        var sliding = false;
        var bouncing = false;
        this.bounce_frame = -1;
        this.bounce_speed = 0;
        var limit = hitstun < 200 ? hitstun + 20 : 200;
        for(var i=0;i<limit;i++){
            var next_x = character_position.x + launch_speed.x + character_speed.x;
            var next_y = character_position.y + launch_speed.y + character_speed.y;

            //Vertical direction
            if(next_y > character_position.y){
                momentum = 1;
            }else if(next_y < character_position.y){
                momentum = -1;
            }else{
                momentum = 0;
            }

            //Reset sliding
            sliding = false;
            bouncing = false;

            //Stage detection
            if(this.stage == null && this.onSurface){
                //No stage
                if(next_y < 0){
                    if(!this.tumble){
                        sliding = true;
                        character_position.y = 0;
                        next_y=0;
                        g=0;
                        character_speed.y = 0;
                        launch_speed.y=0;
                    }else{
                        angle = InvertYAngle(angle);
                        decay.y *= -1;
                        launch_speed.y*=-1;
                        character_position.y = 0;
                        character_speed.y = 0;
                        next_y=0;
                        momentum = 0;
                        g=0;
                    }
                }
            }else{
                if(this.stage != null && !bouncing){
                    //Calculate if some points between previous and current positions are inside a surface
                    var n_angle = character_position.y == next_y && character_position.x == next_x ? angle : Math.atan2(next_y - character_position.y, next_x - character_position.x) * 180 / Math.PI;
                    var p1 = [character_position.x + (next_x - character_position.x)/5, character_position.y + (next_y - character_position.y)/5];
                    var p2 = [character_position.x + 3*(next_x - character_position.x)/5, character_position.y + 3*(next_y - character_position.y)/5];
                    var p1_inside = false;
                    var p2_inside = false;
                    var p_inside = false;
                    //Reducing cases, if Y position isn't on the surface Y range go to else
                    if((this.stage.surfaceY[0] <= character_position.y || this.stage.surfaceY[0] <= next_y) && (this.stage.surfaceY[1] >= character_position.y || this.stage.surfaceY[1] >= next_y)){
                        p1_inside = insideSurface(p1, this.stage.surface);
                        p2_inside = insideSurface(p2, this.stage.surface);
                        p_inside = insideSurface([next_x,next_y], this.stage.surface);
                    }
                    if(p1_inside || p2_inside || p_inside){
                        var line = p1_inside ? closestLine([character_position.x, character_position.y], this.stage.surface) : p2_inside ? closestLine(p1, this.stage.surface)  : closestLine([next_x,next_y], this.stage.surface);
                        if(this.tumble){
                            bouncing = true;
                            //Intersection point
                            var point = p1_inside ? IntersectionPoint([[character_position.x, character_position.y],p1],line) : p2_inside ? IntersectionPoint([[character_position.x, character_position.y],p2],line)  : IntersectionPoint([[character_position.x, character_position.y],[next_x,next_y]],line);
                            var line_angle = Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180 / Math.PI;
                            var t_angle = (2* (line_angle + 90)) - 180 - n_angle;
                            decay.x = 0.051 * Math.cos(t_angle * Math.PI / 180);
                            decay.y = 0.051 * Math.sin(t_angle * Math.PI / 180);
                            launch_speed.x = Math.abs(launch_speed.x);
                            launch_speed.y = Math.abs(launch_speed.y);
                            if(Math.cos(t_angle * Math.PI / 180) < 0){
                                launch_speed.x *= -1;
                            }
                            if(Math.sin(t_angle * Math.PI / 180) < 0){
                                launch_speed.y *= -1;
                            }
                            if(point!=null){
                                next_x = point[0];
                                next_y = point[1];
                            }
                            if(!insideSurface([next_x, next_y], this.stage.surface)){
                                angle = t_angle;
                            }else{
                                angle = line_angle + 90;
                                decay.x = 0.051 * Math.cos(angle * Math.PI / 180);
                                decay.y = 0.051 * Math.sin(angle * Math.PI / 180);
                                launch_speed.x = Math.abs(launch_speed.x);
                                launch_speed.y = Math.abs(launch_speed.y);
                                if(Math.cos(angle * Math.PI / 180) < 0){
                                    launch_speed.x *= -1;
                                }
                                if(Math.sin(angle * Math.PI / 180) < 0){
                                    launch_speed.y *= -1;
                                }
                            }
                            momentum = 0;
                            g=0;
                            this.bounce_speed = Math.abs(launch_speed.y + character_speed.y);
                            launch_speed.x *= 0.8; //Knockback reduction applied
                            launch_speed.y *= 0.8;
                            character_speed.x = 0;
                            character_speed.y = 0;
                            this.bounce_frame = i;
                        }else{
                            if(lineIsFloor(line, this.stage.surface, this.stage.edges)){
                                sliding = true;
                                g=0;
                                launch_speed.y=0;
                                var point = IntersectionPoint([[character_position.x, character_position.y],[next_x, next_y]],line);
                                if(point != null){
                                    next_x = point[0];
                                    next_y = point[1];
                                }
                            }else{
                                launch_speed.x = 0;
                                launch_speed.y = 0;
                                character_speed.x = 0;
                                character_speed.y = 0;
                                g=0;
                            }
                        }
                    }else{
                        //Platform intersection
                        if(this.stage.platforms !== undefined){
                            //Platforms are ignored when launched upwards, but you can land on them when going downwards
                            if(momentum == -1){
                                for(var j=0;j<this.stage.platforms.length;j++){
                                    var intersect = false;
                                    //Intersection code goes here
                                    if((character_position.y >= this.stage.platforms[j].vertex[0][1] || character_position.y >= this.stage.platforms[j].vertex[1][1]) && 
                                    (next_y <= this.stage.platforms[j].vertex[0][1] || next_y <= this.stage.platforms[j].vertex[1][1])){
                                    }else{
                                        continue;
                                    }
                                    var point = IntersectionPoint([[character_position.x, character_position.y],[next_x,next_y]],this.stage.platforms[j].vertex);
                                    if(point == null){
                                        continue;
                                    }
                                    intersect = PointInLine(point, this.stage.platforms[j].vertex);
                                    if(intersect){
                                        var line = this.stage.platforms[j].vertex; 
                                        if(this.tumble){
                                            bouncing = true;
                                            this.bounce_speed = Math.abs(launch_speed.y + character_speed.y);
                                            this.bounce_frame = i;
                                            var line_angle = Math.atan2(line[1][1] - line[0][1], line[1][0] - line[0][0]) * 180 / Math.PI;
                                            var t_angle = (2* (line_angle + 90)) - 180 - n_angle;
                                            decay.x = 0.051 * Math.cos(t_angle * Math.PI / 180);
                                            decay.y = 0.051 * Math.sin(t_angle * Math.PI / 180);
                                            launch_speed.x = Math.abs(launch_speed.x);
                                            launch_speed.y = Math.abs(launch_speed.y);
                                            if(Math.cos(t_angle * Math.PI / 180) < 0){
                                                launch_speed.x *= -1;
                                            }
                                            if(Math.sin(t_angle * Math.PI / 180) < 0){
                                                launch_speed.y *= -1;
                                            }
                                            angle = t_angle;
                                            momentum = 0;
                                            g=0;
                                            next_x = point[0];
                                            next_y = point[1];
                                            launch_speed.y *= 0.8;
                                            launch_speed.x *= 0.8;
                                            character_speed.x = 0;
                                            character_speed.y = 0;
                                        }else{
                                            sliding = true;
                                            g=0;
                                            character_speed.x = 0;
                                            character_speed.y = 0;
                                            launch_speed.y = 0;
                                            next_x = point[0];
                                            next_y = point[1];
                                        }
                                        break;
                                    }
                                }
                                
                            }
                        }
                    }
                }
            }

            //Update friction
            friction =  {'x':air_friction * Math.cos(angle * Math.PI / 180),'y':air_friction * Math.sin(angle * Math.PI / 180)};

            //Apply decay
            if(launch_speed.x != 0){
                var x_dir = launch_speed.x / Math.abs(launch_speed.x);
                launch_speed.x -= decay.x;
                if(x_dir == -1 && launch_speed.x > 0){
                    launch_speed.x = 0;
                }else if(x_dir == 1 && launch_speed.x < 0){
                    launch_speed.x = 0;
                }
            }
            if(launch_speed.y != 0){
                var y_dir = launch_speed.y / Math.abs(launch_speed.y);
                launch_speed.y -= decay.y;
                if(y_dir == -1 && launch_speed.y > 0){
                    launch_speed.y = 0;
                }else if(y_dir == 1 && launch_speed.y < 0){
                    launch_speed.y = 0;
                }
            }

            //Sliding on surface
            if(sliding){
                //Traction applied here
                if(Math.cos(angle * Math.PI / 180) < 0){
                    character_speed.x -= traction;
                }else{
                    character_speed.x = traction;
                }
                character_speed.y = 0;
                launch_speed.y = 0;
                g=gravity;
            }else{
                /*if(launch_speed.x != 0){
                    character_speed.x = -friction.x;
                }else{
                    character_speed.x = 0;
                }*/
            }

            //Gravity
            g -= gravity;
            //g -= gravity2;
            fg = Math.max(g, -fall_speed);
            character_speed.y = fg;
            /*if(launch_speed.y != 0){
                character_speed.y -= friction.y;
            }else{
                character_speed.y = fg;
            }*/

            character_position.x = next_x;
            character_position.y = next_y;

            this.x.push(+character_position.x.toFixed(4));
            this.y.push(+character_position.y.toFixed(4));
            
            //Maximum position during hitstun
            if(i<hitstun){
                if(Math.cos(angle*Math.PI / 180) < 0){
                    this.max_x = Math.min(this.max_x, character_position.x);
                }else{
                    this.max_x = Math.max(this.max_x, character_position.x);
                }
                if(Math.sin(angle * Math.PI / 180) <= 0){
                    this.max_y = Math.min(this.max_y, character_position.y);
                }else{
                    this.max_y = Math.max(this.max_y, character_position.y);
                }
            }

            if(bouncing){
                this.bounce = true;
            }

            this.vertical_speed.push(+(launch_speed.y + character_speed.y).toFixed(4));

            if(this.bounce_frame == i && this.bounce_speed < 1){
                //Character will bounce and stay in that position for 25 frames
                i = limit;
            }


        }

        this.graph_x = Math.abs(this.max_x);
        this.graph_y = Math.abs(this.max_y);

        this.max_x = Math.abs(this.max_x - this.position.x);
        this.max_y = Math.abs(this.max_y - this.position.y);

        if(!doPlot){
            this.data = [];
            this.plot = [];
            return;
        }

        this.data = [];
        var px = 0;
        var py = 0;
        var cx = px;
        var cy = py;
        var color = "blue";
        var dir = 1;
        var data = [];
        var hc = HitstunCancel(kb, x_launch_speed, y_launch_speed, angle, false);
        var airdodge = hc.airdodge;
        var aerial = hc.aerial;
        for(var i = 0; i < this.x.length; i++){
            var xdata = [];
            var ydata = [];
            var change = false;
            do{
                px = this.x[i];
                py = this.y[i];
                if(i==0){
                    if(i+1 < this.x.length){
                        if(py > this.y[i+1]){
                            if(dir==1){
                                change = true;
                                dir=-1;
                            }
                        }else{
                            if(py < this.y[i+1]){
                                if(dir==-1){
                                    change = true;
                                    dir=1;
                                }
                            }
                        }
                    }
                }else{
                    if(py < cy){
                        if(dir == 1){
                            change = true;
                        }
                        dir = -1;
                    }else{
                        if(dir == -1){
                            change = true;
                        }
                        dir = 1;
                    }
                }
                if(!change){
                    xdata.push(px);
                    ydata.push(py);
                    cx = px;
                    cy = py;
                    i++;
                }else{
                    if(i!=0){
                        xdata.push(px);
                        ydata.push(py);
                    }
                    i--;
                }
            }while(!change && i < this.x.length);
            if(xdata.length > 0){
                data.push({ 'calcValue': "Launch", 'x': xdata, 'y': ydata, 'mode': 'lines+markers', 'marker': { 'color': color }, 'line': { 'color': color }, 'name': color == 'blue' ? "" : "" });
            }
            switch(color){
                case 'blue':
                    color = "red";
                break;
                case 'red':
                    color = "blue";
                break;
            }
        }

        if(hitstun < this.x.length){
            data.push({ 'calcValue': "Launch", 'x': [this.x[hitstun]], 'y': [this.y[hitstun]], 'mode': 'markers', 'marker': { 'color': 'brown', 'size': 14 }, 'name': "Hitstun end" });
        }

        var adxdata = [];
        var adydata = [];

       for(var i=hitstun+1;i<this.x.length;i++){
            adxdata.push(this.x[i]);
            adydata.push(this.y[i]);
        }

        if(adxdata.length>0){
            data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'orange' }, 'name': "Actionable frame" });
        }

        adxdata = [];
        adydata = [];

        if(airdodge < hitstun){
            for(var i = airdodge; i < hitstun; i++){
                adxdata.push(this.x[i]);
                adydata.push(this.y[i]);
            }
            

            if(adxdata.length>0){
                data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'yellow' }, 'name': "Airdodge cancel" });
            }

        }

        if(aerial < hitstun){
            adxdata = [];
            adydata = [];
            for(var i = aerial; i < hitstun; i++){
                adxdata.push(this.x[i]);
                adydata.push(this.y[i]);
            }
            if(adxdata.length>0){
                data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'green' }, 'name': "Aerial cancel" });
            }

        }

        //Stage blast zones
        if(this.stage != null){
            adxdata = [];
            adydata = [];
            adxdata.push(this.stage.blast_zones[0]);
            adxdata.push(this.stage.blast_zones[1]);
            adxdata.push(this.stage.blast_zones[1]);
            adxdata.push(this.stage.blast_zones[0]);
            adxdata.push(this.stage.blast_zones[0]);

            adydata.push(this.stage.blast_zones[2]);
            adydata.push(this.stage.blast_zones[2]);
            adydata.push(this.stage.blast_zones[3]);
            adydata.push(this.stage.blast_zones[3]);
            adydata.push(this.stage.blast_zones[2]);

            data.push({ 'calcValue': "Blast zone", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'purple' }, 'name': "Blast zone" });

            //Stage surface
            adxdata = [];
            adydata = [];
            for(var i=0;i<this.stage.surface.length;i++){
                adxdata.push(this.stage.surface[i][0]);
                adydata.push(this.stage.surface[i][1]);
            }

            data.push({ 'calcValue': "Stage", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'purple' }, 'name': "Stage" });

            //Stage platforms
            if(this.stage.platforms !== undefined){
                for(var i=0;i<this.stage.platforms.length;i++){
                    adxdata = [];
                    adydata = [];
                    for(var j=0;j<this.stage.platforms[i].vertex.length;j++){
                        adxdata.push(this.stage.platforms[i].vertex[j][0]);
                        adydata.push(this.stage.platforms[i].vertex[j][1]);
                    }
                    data.push({ 'calcValue': "Platform", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'purple' }, 'name': this.stage.platforms[i].name });
                }
            }

            var ko = false;

            //Calculate if KO in vertical blast zones
            for(var i=0;i<=hitstun;i++){
                if(this.y[i] >= this.stage.blast_zones[2] + 10 || this.y[i] <= this.stage.blast_zones[3] - 10){
                    break;
                }
                if(this.y[i] >= this.stage.blast_zones[2]){
                    if(this.kb >= 80){
                        data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
                        ko = true;
                        break;
                    }
                }else{
                    if(this.y[i] <= this.stage.blast_zones[3]){
                        data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
                        ko = true;
                        break;
                    }
                }

            }

            if(!ko){

                //Calculate if KO in horizontal blast zones
                for(var i=0;i<=hitstun;i++){
                    if(this.x[i] <= this.stage.blast_zones[0] || this.x[i] >= this.stage.blast_zones[1]){
                        data.push({'calcValue':"KO" , 'x':[this.x[i]], 'y':[this.y[i]], 'mode':'markers', 'marker':{'color':'red', size: 15}, 'name':"KO"});
                        break;
                    }
                }
            }

            this.graph_x = Math.max(this.graph_x, this.stage.blast_zones[1]);
            this.graph_y = Math.max(this.graph_y, this.stage.blast_zones[2]);
        }


        this.plot = data;


    }
};

class Knockback {
    constructor(kb, angle, gravity, fall_speed, aerial, windbox, percent, di) {
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
        }
        this.kb = this.base_kb;
        this.original_angle = angle;
        this.base_angle = angle;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
        this.windbox = windbox;
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.fall_speed = fall_speed;
        this.add_gravity_speed = 5 * (this.gravity - 0.075);
        this.percent = percent;
        this.reeling = false;
        this.spike = false;
        this.di_change = 0;
        this.launch_speed = LaunchSpeed(kb);
        this.vectoring = vectoring;
        this.horizontal_launch_speed = 0;
        this.vertical_launch_speed = 0;
        if(this.vectoring == undefined){
            this.vectoring = 1;
        }
        this.hitstun = Hitstun(this.base_kb, this.windbox);
        if (di !== undefined) {
            this.di = di;
        } else {
            this.di = -1;
        }
        this.calculate = function () {
            this.kb = this.base_kb;
            if (this.original_angle == 361) {
                this.base_angle = SakuraiAngle(this.kb, this.aerial);
            }
            this.angle = this.base_angle;
            if (this.base_angle != 0 && this.base_angle != 180) {
                this.tumble = this.kb > 80 && !windbox;
                this.di_able = this.tumble;
                if(this.di_able){
                    this.di_change = DI(this.di,this.angle);
                    this.angle += this.di_change;
                }
            }
            this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
            this.y = Math.abs(Math.sin(this.angle * Math.PI / 180) * this.kb);
            this.add_gravity_speed = 5 * (this.gravity - 0.075);
            if(!this.tumble){
                this.add_gravity_speed = 0;
            }
            if (this.angle == 0 || this.angle == 180 ) {
                this.add_gravity_speed = 0;
            }
            /*
            if(this.kb > 80 && (this.angle != 0 && this.angle != 180)){
                this.y += this.add_gravity_kb;
            }*/
            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = true;
                }
            }
            this.spike = this.angle >= 230 && this.angle <= 310;
            if (this.spike) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = !this.tumble;
                }
            }

            if (this.angle <= 70 || this.angle >= 110) {
                this.reeling = this.tumble && !this.windbox && this.percent >= 100;
            }
            this.launch_speed = LaunchSpeed(this.kb);
            this.horizontal_launch_speed = LaunchSpeed(this.x);
            this.vertical_launch_speed = LaunchSpeed(this.y);
            if(this.tumble){
                this.vertical_launch_speed += this.add_gravity_speed;
            }
            if (this.tumble) {
                this.vectoring = Vectoring(this.di, this.angle);
            } else {
                this.vectoring = 1;
            }
            this.horizontal_launch_speed *= this.vectoring;
            this.vertical_launch_speed *= this.vectoring;
            this.hitstun = Hitstun(this.base_kb, false);
        };
        this.addModifier = function (modifier) {
            this.base_kb *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.vertical_launch_speed *= 0.8;
                this.horizontal_launch_speed *= 0.8;
            }
        }
        this.calculate();
    }

    

};

class PercentFromKnockback{
    constructor(kb, type, base_damage, damage, angle, weight, gravity, fall_speed, aerial, bkb, kbg, wbkb, attacker_percent, r, timesInQueue, ignoreStale, windbox, vectoring){
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
        }
        this.type = type;
        this.original_angle = angle;
        this.base_angle = angle;
        this.base_damage = base_damage;
        this.damage = damage;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.aerial = aerial;
        this.bkb = bkb;
        this.kbg = kbg;
        this.wbkb = wbkb;
        this.r = r;
        this.windbox = windbox;
        this.weight = weight;
        this.attacker_percent = attacker_percent;
        this.rage = Rage(attacker_percent);
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.add_gravity_speed = 5 * (this.gravity - 0.075);
        this.add_gravity_kb = this.add_gravity_speed / 0.03;
        this.reeling = false;
        this.training_percent = 0;
        this.vs_percent = 0;
        this.timesInQueue = timesInQueue;
        this.ignoreStale = ignoreStale;
        this.vectoring = vectoring;
        this.wbkb_kb = -1;
        this.wbkb_modifier = 1;
        if(this.vectoring == undefined){
            this.vectoring = 0;
        }

        this.best_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };
        this.worst_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };

        this.training_formula = function(kb, base_damage, damage, weight, kbg, bkb, r){
            var s=1;
            return (500 * kb * (weight+100)- (r * (kbg * (7 * damage * s * (3 * base_damage * s+7 * base_damage+20)+90 * (weight+100))+ 500 * bkb * (weight+100))))/(7 * kbg * r * (base_damage * (3 *s +7)+20));
        }
        this.vs_formula = function(kb, base_damage, damage, weight, kbg, bkb, r, attacker_percent, timesInQueue, ignoreStale){
            var s = StaleNegation(timesInQueue, ignoreStale);
            r = r * Rage(attacker_percent);
            return (500 * kb * (weight+100)- (r * (kbg * (7 * damage * s * (3 * base_damage * s+7 * base_damage+20)+90 * (weight+100))+ 500 * bkb * (weight+100))))/(7 * kbg * r * (base_damage * (3 *s +7)+20));
        }

        if(!this.wbkb){
            if(this.type == "total"){
                this.kb = kb;
            }
            if(this.type == "x"){
                this.x = kb;
            }
            if(this.type == "y"){
                this.y = kb;
            }
        }


        if (!this.wbkb) {
            this.calculate = function () {
                if (!this.wbkb) {
                    if (this.type == "total") {
                        this.kb = this.base_kb;
                    }
                    if (this.type == "x") {
                        this.x = this.base_kb;
                    }
                    if (this.type == "y") {
                        this.y = this.base_kb;
                    }
                }


                if (this.original_angle == 361) {
                    this.base_angle = SakuraiAngle(this.kb, this.aerial);
                }
                this.angle = this.base_angle;

                if (this.original_angle == 361 && !this.aerial && type != "total") {
                    //Find the original kb and get the angle
                    var angle_found = false;
                    for (var temp_kb = 59.999; temp_kb < 88; temp_kb += 0.001) {
                        var temp_angle = SakuraiAngle(temp_kb, this.aerial);
                        var temp_var = 0;
                        if (this.type == "x") {
                            temp_var = Math.abs(temp_kb * Math.cos(temp_angle * Math.PI / 180));
                            if (temp_var >= this.x) {
                                this.angle = temp_angle;
                                angle_found = true;
                                break;
                            }
                        }
                        if (this.type == "y") {
                            temp_var = Math.abs(temp_kb * Math.sin(temp_angle * Math.PI / 180));
                            if (temp_var >= this.y) {
                                this.angle = temp_angle;
                                angle_found = true;
                                break;
                            }
                        }
                    }
                    if (!angle_found) {
                        this.angle = SakuraiAngle(88, this.aerial);
                    }
                }

                if (!this.wbkb) {
                    if (this.type == "x") {
                        this.kb = Math.abs(this.x / Math.cos(this.angle * Math.PI / 180));
                    }
                    if (this.type == "y") {
                        this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                    }
                }
                /*if(this.vectoring != 0 && this.tumble){
                    if((this.angle >= 0 && this.angle <= (1.1 * 180 / Math.PI)) || (this.angle >= InvertXAngle((1.1 * 180 / Math.PI)) && this.angle <= 180)){
                        if(this.vectoring == 1){
                        this.kb *= 0.92;
                    }else{
                        if(this.vectoring == -1){
                            this.kb *= 1.095;
                        }
                    }
                    }
                }*/

                this.hitstun = Hitstun(this.kb, this.windbox);

                if (this.base_angle != 0 && this.base_angle != 180) {
                    this.tumble = this.kb > 80 && !windbox;
                    this.di_able = this.tumble;
                }


                /*if (this.angle == 0 || this.angle == 180  || (this.angle >= 181 && this.angle < 360)) {
                    this.add_gravity_kb = 0;
                }*/
                if (this.kb > 80 && (this.angle != 0 && this.angle != 180)) {
                    //this.y *= this.gravity_mult;
                    if (this.type == "y") {
                        this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                    }
                }

                this.can_jablock = false;
                if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                    if (this.kb != 0 && !this.windbox) {
                        this.can_jablock = true;
                    }
                }
                if (this.angle >= 240 && this.angle <= 300) {
                    if (this.kb != 0 && !this.windbox) {
                        this.can_jablock = !this.tumble;
                    }
                }
                if (this.angle <= 70 || this.angle >= 110) {
                    this.reeling = this.tumble && !this.windbox && this.percent >= 100;

                }

                this.training_percent = this.training_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r);
                this.vs_percent = this.vs_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.timesInQueue, this.ignoreStale);

                if (this.training_percent < 0) {
                    this.training_percent = 0;
                }
                if (this.training_percent > 999 || isNaN(this.training_percent)) {
                    this.training_percent = -1;
                }
                if (this.vs_percent < 0) {
                    this.vs_percent = 0;
                }
                if (this.vs_percent > 999 || isNaN(this.vs_percent)) {
                    this.vs_percent = -1;
                }

                if (this.di_able && this.type != "total") {
                    var di_angles = [];
                    for (var i = 0; i < 360; i++) {
                        var di = DI(i, this.angle);
                        var angle = this.angle + DI(i, this.angle);
                        var kb = this.base_kb;
                        if (this.type == "x") {
                            kb = Math.abs(kb / Math.cos(angle * Math.PI / 180));
                        }
                        if (this.type == "y") {
                            kb -= this.add_gravity_kb;
                            kb = Math.abs(kb / Math.sin(angle * Math.PI / 180));
                        }
                        var hitstun = Hitstun(kb, this.windbox);
                        var training = this.training_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r);
                        var vs = this.vs_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.timesInQueue, this.ignoreStale);
                        di_angles.push({ 'angle': i, 'training': training, 'vs': vs, 'hitstun': hitstun });
                    }
                    di_angles.sort(function (a, b) {
                        return a.training < b.training ? 1 :
                        a.training > b.training ? -1 :
                        0
                    });
                    this.best_di.angle_training = di_angles[0].angle;
                    this.best_di.training = di_angles[0].training;
                    this.best_di.hitstun = di_angles[0].hitstun;
                    this.best_di.hitstun_dif = this.hitstun - di_angles[0].hitstun;
                    this.worst_di.angle_training = di_angles[di_angles.length - 1].angle;
                    this.worst_di.training = di_angles[di_angles.length - 1].training;
                    this.worst_di.hitstun = di_angles[di_angles.length - 1].hitstun;
                    this.worst_di.hitstun_dif = this.hitstun - di_angles[di_angles.length - 1].hitstun;
                    di_angles.sort(function (a, b) {
                        return a.vs < b.vs ? 1 :
                        a.vs > b.vs ? -1 :
                        0
                    });
                    this.best_di.angle_vs = di_angles[0].angle;
                    this.best_di.vs = di_angles[0].vs;
                    this.worst_di.angle_vs = di_angles[di_angles.length - 1].angle;
                    this.worst_di.vs = di_angles[di_angles.length - 1].vs;
                    if (this.best_di.training < 0) {
                        this.best_di.training = 0;
                    }
                    if (this.best_di.training > 999 || isNaN(this.best_di.training)) {
                        this.best_di.training = -1;
                    }
                    if (this.best_di.vs < 0) {
                        this.best_di.vs = 0;
                    }
                    if (this.best_di.vs > 999 || isNaN(this.best_di.vs)) {
                        this.best_di.vs = -1;
                    }
                    if (this.worst_di.training < 0) {
                        this.worst_di.training = 0;
                    }
                    if (this.worst_di.training > 999 || isNaN(this.worst_di.training)) {
                        this.worst_di.training = -1;
                    }
                    if (this.worst_di.vs < 0) {
                        this.worst_di.vs = 0;
                    }
                    if (this.worst_di.vs > 999 || isNaN(this.worst_di.vs)) {
                        this.worst_di.vs = -1;
                    }
                }

            };
        } else {
            this.calculate = function () {
                this.kb = this.base_kb * this.wbkb_modifier;
                this.rage_needed = -1;
                this.vs_percent = 0;
                var wbkb = WeightBasedKB(this.weight, this.bkb, this.kbg, this.gravity, this.fall_speed, this.r, 0, this.damage, 0, this.angle, this.aerial, this.windbox, -1, this.vectoring);
                wbkb.addModifier(this.wbkb_modifier);
                this.wbkb_kb = wbkb.kb;
                if (this.kb <= this.wbkb_kb) {
                    this.training_percent = 0;
                }
                if (this.kb > this.wbkb_kb) {
                    this.training_percent = -1;
                }
                var rage = this.kb / this.wbkb_kb;
                if (rage >= 1 && rage <= 1.15) {
                    this.vs_percent = (5 / 3) * ((460 * rage) - 439);
                    this.vs_percent = +this.vs_percent.toFixed(4);
                    this.rage_needed = +rage.toFixed(4);
                } else {
                    if (this.kb <= this.wbkb_kb) {
                        this.vs_percent = 0;
                    }
                    if (this.kb > this.wbkb_kb) {
                        this.vs_percent = -1;
                    }
                }
            }
        }
        this.addModifier = function (modifier) {
            this.kb /= modifier;
            this.base_kb /= modifier;
            this.add_gravity_kb /= modifier;
            this.wbkb_modifier *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                //this.kb /= 0.8;
                this.calculate();
            }
        }
        this.calculate();
    }
};

class ListItem {
    constructor(attribute, value, title) {
        this.attribute = attribute;
        this.addStyle = function (style) {
            this.style = style;
            return this;
        }
        if (title !== undefined) {
            this.title = title;
        } else {
            this.title = ListItem.getTitle(this.attribute);
        }
        this.style = "";
        if (typeof value === "number" && isNaN(value)) {
            this.addStyle({ 'color': 'red' });
            this.value = "Invalid data";
        } else {
            if (attribute == "Hitstun" || attribute == "Attacker Hitlag" || attribute == "Target Hitlag" || attribute == "Shield stun" || attribute == "Shield Hitlag" || attribute == "Shield Advantage" || attribute == "Hit Advantage") {
                this.value = value + (value == 1 ? " frame" : " frames");
            } else if (attribute == "Airdodge hitstun cancel" || attribute == "Aerial hitstun cancel" || attribute == "First Actionable Frame") {
                this.value = "Frame " + value;
            } else {
                this.value = value;
            }
        }

        
    }

    static getTitle(attribute) {
        var titles = [{ "attribute": "Gravity launch speed", "title": "Vertical launch speed increase caused by gravity when KB causes tumble" },
        { "attribute": "KB modifier", "title": "KB multiplier used when target is crouching or charging a smash attack" },
        { "attribute": "Rage", "title": "KB multiplier used on total KB based on attacker's percent " },
        { "attribute": "Aura", "title": "Lucario aura damage increase based on his percent/stock difference" },
        { "attribute": "KB dealt", "title": "Additional KB multiplier mostly used by attacker Buster/Smash Monado Arts" },
        { "attribute": "KB received", "title": "Additional KB multiplier mostly used by target Shield/Smash Monado Arts" },
        { "attribute": "Charged Smash", "title": "Damage multiplier used when using a charged smash attack" },
        { "attribute": "Damage taken", "title": "Additional damage multiplier target receives caused by the target used in multiple powerups like Jump/Shield/Buster Monado Arts and Deep Breathing" },
        { "attribute": "Damage dealt", "title": "Additional damage multiplier target receives caused by the attacker used in multiple powerups like Speed/Buster/Smash Monado Arts and Deep Breathing" },
        { "attribute": "Before launch damage", "title": "Throws can deal some damage during their animations like Pikachu's fthrow, this is added to the target percent before calculating KB" },
        { "attribute": "Stale-move negation", "title": "Damage reduction caused when using an attack repeatedly, if the attack isn't in the queue it gets a freshness bonus and increases damage a little" },
        { "attribute": "Tumble", "title": "Target will enter tumble if KB > 80 and angle isn't 0 or 180" },
        { "attribute": "Reeling/Spin animation", "title": "Also called Untechable spin, special animation caused when KB > 80, angle isn't between 71 and 109 and target's percent is 100 or higher after the attack damage" },
        { "attribute": "Can Jab lock", "title": "If target is in the ground after tumble during the bounce animation the attack can jab lock if Y = 0 or for spikes KB <= 80" },
        { "attribute": "Launch angle", "title": "Angle the target is launched affected by DI" },
        { "attribute": "Luma KB", "title": "Luma KB is calculated with weight = 100 and an additional 15%" },
        { "attribute": "Luma launched", "title": "If Luma KB > 80 it will be launched" },
        { "attribute": "Shield Damage", "title": "Damage done to target shield, (damage + SD) * 1.19" },
        { "attribute": "Full HP shield", "title": "Maximum HP target shield has, can only be increased using Shield Monado Art" },
        { "attribute": "Shield Break", "title": "Yes will appear here if you can break the target shield at full HP in one hit" },
        { "attribute": "Shield stun", "title": "Amount of frames target cannot do any action after shielding an attack" },
        { "attribute": "Shield Hitlag", "title": "Amount of frames target suffers hitlag while shielding" },
        { "attribute": "Shield Advantage", "title": "" },
        { "attribute": "Unblockable attack", "title": "This attack cannot be blocked using shield" },
        { "attribute": "Hit Advantage", "title": "" }];
        for (var i = 0; i < titles.length; i++) {
            if (attribute == titles[i].attribute) {
                return titles[i].title;
            }
        }
        return "";
    }
};

function List(values) {
    var list = [];
    var attributes = ["Damage", "Attacker Hitlag", "Target Hitlag", "Total KB", "Angle", "X", "Y", "Hitstun", "First Actionable Frame", "Airdodge hitstun cancel", "Aerial hitstun cancel", "Vectoring", "Horizontal Launch Speed", "Gravity launch speed" ,"Vertical Launch Speed", "Max Horizontal Distance", "Max Vertical Distance"];
    var titles = ["Damage dealt to the target",
        "Amount of frames attacker is in hitlag",
        "Amount of frames the target can SDI",
        "Total KB dealt",
        "Angle target is launched without DI",
        "KB X component", "KB Y component",
        "Hitstun target gets while being launched", "Frame the target can do any action", "Frame target can cancel hitstun by airdodging",
        "Frame target can cancel hitstun by using an aerial",
        "Launch speed multiplier caused by vectoring",
        "Initial horizontal speed target will be launched",
        "Additional vertical launch speed caused by gravity if attack causes tumble",
        "Initial vertical speed target will be launched",
        "Horizontal distance travelled being launched after hitstun",
        "Vertical distance travelled being launched after hitstun"];
    var hitstun = -1;
    for (var i = 0; i < attributes.length && i < values.length; i++) {
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
        if (attributes[i] == "Vectoring") {
            if(values[i] == 1){
                continue;
            }
            values[i] = "x" + +values[i].toFixed(4);
        }
        if(attributes[i] == "Gravity launch speed"){
            if(values[i] == 0){
                continue;
            }
        }
        if(typeof(values[i]) == "string"){
            list.push(new ListItem(attributes[i], values[i],titles[i]));
        }else{
            list.push(new ListItem(attributes[i], +values[i].toFixed(4),titles[i])); //.addStyle({'text-decoration':'line-through'})
        }
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
    var attributes = ["Shield stun", "Shield Hitlag", "Shield Advantage"];
    for (var i = 0; i < attributes.length; i++) {
        list[i] = new ListItem(attributes[i], values[i]);
    }
    return list;
}

function getStages(){
    return loadJSONPath("./Data/Stages/stagedata.json");
}


var attacker = new Character("Bayonetta");
var target = new Character("Bayonetta");


var attacker_percent = 0;
var target_percent = 0;
var base_damage = 1.5;
var angle = 55;
var in_air = false;
var bkb = 45;
var kbg = 25;
var stale = 0;
var hitlag = 1;

var charge_frames = 0;

function resetCharacterList(varIncluded, customMonado){
    characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
    names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];

    sorted_characters();
}

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length; i++) {
        list.push({ 'character': characters[i], 'name': names[i], 'game': gameNames[i] });
    }
    list.sort(function (a, b) {
        return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
    });
    for (var i = 0; i < list.length; i++) {
        characters[i] = list[i].character;
        names[i] = list[i].name;
        gameNames[i] = list[i].game;
    }
}

sorted_characters();

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return  0.85;
        case "grounded":
            return 1; //0.8 applied after hitstun
        case "charging":
            return 1.2;
        case "none":
            return 1;
    }
    return 1;
}

function HitlagCrouch(value) {
    switch (value) {
        case "crouch":
            return 0.67;
    }
    return 1;
}

function HitlagElectric(value) {
    switch (value) {
        case "electric":
            return 1.5;
        case "none":
            return 1;
    }
    return 1;
}

var hitframe = 9;
var faf = 26;

var bounce = false;
var ignoreStale = false;

var powershield = false;
var is_projectile = false;

var megaman_fsmash = false;
var witch_time_smash_charge = false;
var electric = "none";
var crouch = "none";
var is_smash = false;

var wbkb = false;
var windbox = false;
var di = 55;
var luma_percent = 0;

var shieldDamage = 0;

var unblockable = false;

var game_mode = "vs";
var graph = false;

var position = {"x":0, "y":0};
var inverseX = false;
var onSurface = false;

var vectoring = 0;

var landing_lag = 0;
var stock_dif = "0";
