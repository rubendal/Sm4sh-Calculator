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

var defaultParameters = {
    di: 0.17,
    lsi_max: 1.095,
    lsi_min: 0.92,
    decay: 0.051,
    gravity: {
        mult: 5,
        constant: 0.075
    },
    bounce: 0.8,
    crouch_cancelling: 0.85,
    crouch_hitlag: 0.67,
    interrupted_smash: 1.2,
    hitstun: 0.4,
    launch_speed: 0.03,
    tumble_threshold: 32,
    hitlag: {
        mult: 0.3846154,
        constant: 5
    },
    hitstunCancel: {
        frames: {
            aerial: 45,
            airdodge: 40
        },
        launchSpeed: {
            aerial: 2,
            airdodge: 2.5
        }
    },
    paralyzer: {
        constant: 14,
        mult:0.025
    }
};

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
    new Parameter("staleness", ""),
    new Parameter("preDamage", "0"),
    new Parameter("chargeFrames", "0"),
    new Parameter("hitFrame", "9"),
    new Parameter("faf", "26"),
    new Parameter("kbModifier", "none"),
    new Parameter("electric", "0"),
    new Parameter("lsi", "none"),
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
    new Parameter("chargeable", "0"),
    new Parameter("pDI", defaultParameters.di.toString()),
    new Parameter("pMinLSI", defaultParameters.lsi_min.toString()),
    new Parameter("pMaxLSI", defaultParameters.lsi_max.toString()),
    new Parameter("pHitstun", defaultParameters.hitstun),
    new Parameter("pDecay", defaultParameters.decay),
    new Parameter("pLaunchSpeed", defaultParameters.launch_speed),
    new Parameter("pGMult", defaultParameters.gravity.mult),
    new Parameter("pGConst", defaultParameters.gravity.constant),
    new Parameter("pHitlagMult", defaultParameters.hitlag.mult),
    new Parameter("pHitlagConst", defaultParameters.hitlag.constant),
    new Parameter("pHCdodgef", defaultParameters.hitstunCancel.frames.airdodge),
    new Parameter("pHCdodgem", defaultParameters.hitstunCancel.launchSpeed.airdodge),
    new Parameter("pHCaerialf", defaultParameters.hitstunCancel.frames.aerial),
    new Parameter("pHCaerialm", defaultParameters.hitstunCancel.launchSpeed.aerial),
    new Parameter("damageDealt", "1"),
    new Parameter("kbDealt", "1"),
    new Parameter("weight", "84"),
    new Parameter("gravity", "0.12"),
    new Parameter("fallSpeed", "1.77"),
    new Parameter("damageReceived", "1"),
    new Parameter("kbReceived", "1"),
    new Parameter("traction", "0.055"),
    new Parameter("setWeight", "0"),
    new Parameter("theme", "Normal"),
    new Parameter("launchRate", "1"),
    new Parameter("pParalConst", defaultParameters.paralyzer.constant),
    new Parameter("pParalMult", defaultParameters.paralyzer.mult),
    new Parameter("paralyzer", "0"),
    new Parameter("useLandingLag","no")
];

function checkUndefined(value) {
    return value == undefined;
};

function boolToString(value) {
    return value ? "1" : "0";
}

function boolArrayToString(value) {
    //Prints string with position+1 separated by , when true
    var str = "";
    for (var i = 0; i < value.length; i++) {
        if (value[i]) {
            str += (i + 1) + ",";
        }
    }
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
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
    if (paramsList[12].value != $scope.wbkb) {
        params.push(new Parameter(paramsList[12].param, $scope.wbkb));
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
    if (paramsList[17].value != boolArrayToString($scope.stale)) {
        params.push(new Parameter(paramsList[17].param, boolArrayToString($scope.stale)));
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
    if (paramsList[59].value != $scope.attacker_damage_dealt) {
        params.push(new Parameter(paramsList[59].param, $scope.attacker_damage_dealt));
    }
    if (paramsList[60].value != $scope.attacker_kb_dealt) {
        params.push(new Parameter(paramsList[60].param, $scope.attacker_kb_dealt));
    }
    if (paramsList[61].value != $scope.target_weight) {
        params.push(new Parameter(paramsList[61].param, $scope.target_weight));
    }
    if (paramsList[62].value != $scope.target_gravity) {
        params.push(new Parameter(paramsList[62].param, $scope.target_gravity));
    }
    if (paramsList[63].value != $scope.target_fall_speed) {
        params.push(new Parameter(paramsList[63].param, $scope.target_fall_speed));
    }
    if (paramsList[64].value != $scope.target_damage_taken) {
        params.push(new Parameter(paramsList[64].param, $scope.target_damage_taken));
    }
    if (paramsList[65].value != $scope.target_kb_received) {
        params.push(new Parameter(paramsList[65].param, $scope.target_kb_received));
    }
    if (paramsList[66].value != $scope.target_traction) {
        params.push(new Parameter(paramsList[66].param, $scope.target_traction));
    }
    if (paramsList[67].value != boolToString($scope.set_weight)) {
        params.push(new Parameter(paramsList[67].param, boolToString($scope.set_weight)));
    }
    if (paramsList[68].value != $scope.theme) {
        params.push(new Parameter(paramsList[68].param, $scope.theme));
    }
    if (paramsList[69].value != $scope.launch_rate) {
        params.push(new Parameter(paramsList[69].param, $scope.launch_rate));
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
        if (paramsList[45].value != $scope.params.di) {
            params.push(new Parameter(paramsList[45].param, $scope.params.di));
        }
        if (paramsList[46].value != $scope.params.lsi_min) {
            params.push(new Parameter(paramsList[46].param, $scope.params.lsi_min));
        }
        if (paramsList[47].value != $scope.params.lsi_max) {
            params.push(new Parameter(paramsList[47].param, $scope.params.lsi_max));
        }
        if (paramsList[48].value != $scope.params.hitstun) {
            params.push(new Parameter(paramsList[48].param, $scope.params.hitstun));
        }
        if (paramsList[49].value != $scope.params.decay) {
            params.push(new Parameter(paramsList[49].param, $scope.params.decay));
        }
        if (paramsList[50].value != $scope.params.launch_speed) {
            params.push(new Parameter(paramsList[50].param, $scope.params.launch_speed));
        }
        if (paramsList[51].value != $scope.params.gravity.mult) {
            params.push(new Parameter(paramsList[51].param, $scope.params.gravity.mult));
        }
        if (paramsList[52].value != $scope.params.gravity.constant) {
            params.push(new Parameter(paramsList[52].param, $scope.params.gravity.constant));
        }
        if (paramsList[53].value != $scope.params.hitlag.mult) {
            params.push(new Parameter(paramsList[53].param, $scope.params.hitlag.mult));
        }
        if (paramsList[54].value != $scope.params.hitlag.constant) {
            params.push(new Parameter(paramsList[54].param, $scope.params.hitlag.constant));
        }
        if (paramsList[55].value != $scope.params.hitstunCancel.frames.airdodge) {
            params.push(new Parameter(paramsList[55].param, $scope.params.hitstunCancel.frames.airdodge));
        }
        if (paramsList[56].value != $scope.params.hitstunCancel.launchSpeed.airdodge) {
            params.push(new Parameter(paramsList[56].param, $scope.params.hitstunCancel.launchSpeed.airdodge));
        }
        if (paramsList[57].value != $scope.params.hitstunCancel.frames.aerial) {
            params.push(new Parameter(paramsList[57].param, $scope.params.hitstunCancel.frames.aerial));
        }
        if (paramsList[58].value != $scope.params.hitstunCancel.launchSpeed.aerial) {
            params.push(new Parameter(paramsList[58].param, $scope.params.hitstunCancel.launchSpeed.aerial));
        }
        if (paramsList[70].value != $scope.params.paralyzer.constant) {
            params.push(new Parameter(paramsList[70].param, $scope.params.paralyzer.constant));
        }
        if (paramsList[71].value != $scope.params.paralyzer.mult) {
            params.push(new Parameter(paramsList[71].param, $scope.params.paralyzer.mult));
        }
        if (paramsList[72].value != $scope.paralyzer) {
            params.push(new Parameter(paramsList[72].param, boolToString($scope.paralyzer)));
        }
        if (paramsList[73].value != $scope.use_landing_lag) {
            params.push(new Parameter(paramsList[73].param, $scope.use_landing_lag));
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
    var andIns = false;
    for (var i = 0; i < params.length; i++) {
        if (params[i].value === undefined) {
            continue;
        }
        if (andIns) {
            p += "&";
        }
        andIns = true;
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
        $scope.wbkb = parseFloat(param);
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
        var s = param.split(",");
        for (var i = 0; i < s.length; i++) {
            try {
                var n = parseFloat(s[i]);
                $scope.stale[n - 1] = true;

            } catch (e) {

            }
        }
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
    param = Parameter.get(get_params, "pDI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.di = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitstun");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstun = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pMinLSI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.lsi_min = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pMaxLSI");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.lsi_max = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pDecay");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.decay = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pLaunchSpeed");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.launch_speed = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pGMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.gravity.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pGConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.gravity.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitlagMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitlag.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHitlagConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitlag.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHCdodgef");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.frames.airdodge = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "pHCdodgem");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.launchSpeed.airdodge = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pHCaerialf");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.frames.airdodge = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "pHCaerialm");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.hitstunCancel.launchSpeed.airdodge = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pParalConst");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.paralyzer.constant = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "pParalMult");
    if (param) {
        if ($scope.params != undefined) {
            $scope.params.paralyzer.mult = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "damageDealt");
    if (param) {
        if ($scope.attacker_damage_dealt != undefined) {
            $scope.attacker_damage_dealt = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "kbDealt");
    if (param) {
        if ($scope.attacker_kb_dealt != undefined) {
            $scope.attacker_kb_dealt = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "damageReceived");
    if (param) {
        if ($scope.target_damage_taken != undefined) {
            $scope.target_damage_taken = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "kbReceived");
    if (param) {
        if ($scope.target_kb_received != undefined) {
            $scope.target_kb_received = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "weight");
    if (param) {
        if ($scope.target_weight != undefined) {
            $scope.target_weight = Math.floor(parseFloat(param));
        }
    }
    param = Parameter.get(get_params, "gravity");
    if (param) {
        if ($scope.target_gravity != undefined) {
            $scope.target_gravity = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "fallSpeed");
    if (param) {
        if ($scope.target_fall_speed != undefined) {
            $scope.target_fall_speed = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "traction");
    if (param) {
        if ($scope.target_traction != undefined) {
            $scope.target_traction = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "setWeight");
    if (param) {
        if ($scope.set_weight != undefined) {
            $scope.set_weight = param == 1;
        }
    }
    param = Parameter.get(get_params, "paralyzer");
    if (param) {
        if ($scope.paralyzer != undefined) {
            $scope.paralyzer = param == 1;
        }
    }
    param = Parameter.get(get_params, "theme");
    if (param) {
        $scope.theme = param;
        $scope.changeTheme();
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
    param = Parameter.get(get_params, "launchRate");
    if (param) {
        if ($scope.launch_rate != undefined) {
            $scope.launch_rate = parseFloat(param);
        }
    }
    param = Parameter.get(get_params, "useLandingLag");
    if (param) {
        $scope.delayed_landing_lag = param;
    }
}

var styleList = loadJSONPath("./css/themes.json");

var defaultStyle = styleList[0];

function checkAndChangeMedia(id, style) {
    if (style == undefined) {
        return;
    }
    if ($(id).attr("media") != style) {
        $(id).attr("media", style);
    }
}

function changeStyle(style) {
    for(var i=0;i<styleList.length;i++){
        if (styleList[i].name == style) {
            $("#mainStyle").attr("href", styleList[i].main);
            if (styleList[i].style2) {
                $("#style2").attr("href", styleList[i].style2);
                checkAndChangeMedia("#style2", styleList[i].media2);
            } else {
                $("#style2").attr("href", defaultStyle.style2);
                checkAndChangeMedia("#style2", defaultStyle.media2);
            }
            if (styleList[i].style3) {
                $("#style3").attr("href", styleList[i].style3);
                checkAndChangeMedia("#style3", styleList[i].media3);
            } else {
                $("#style3").attr("href", defaultStyle.style3);
                checkAndChangeMedia("#style3", defaultStyle.media3);
            }
            if (styleList[i].style4) {
                $("#style4").attr("href", styleList[i].style4);
                checkAndChangeMedia("#style4", styleList[i].media4);
            } else {
                $("#style4").attr("href", defaultStyle.style4);
                checkAndChangeMedia("#style4", defaultStyle.media4);
            }
            return;
        }
    }
    
}

var inhttp = getWebProtocol() == "http";

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
//April Fools
//var names = ["Not top 5", "Green Mario", "UpB with 180 WBKB", "Uthrow-Uair", "Egg shield", "Luma", "Clown Kart", "Wah", "Expand", "Banana-Dtilt-Usmash", "Mr. Bucket & 9", "Good frame data/horrible aerials", "Lonk", "Link?", "Can't kill past 130%", "DISRESPECT", "Bomb-Fair", "Spamus", "Zero Skill Samus", "Hot spring maniac", "Top tier with customs", "Morth", "Slow Marth", "Magical Marth", "Dog & Duck", "Hi!", "Sakurai's voice", "Not Brawl", "Honest", "Revali", "Quick Attack", "Orange flying lizard", "Aura is Broken", "Never buffed", "Nerfed", "Beep Boop", "Okay", "Dthrow to knee is not true", "Killager", "Pikmin", "Feel the burn", "Commentator's nightmare", "Doc is In", "Edgy Pit", "Female Marth", "Useless grab", "Lemons", "Sanic", "Heavier than Charizard in Pokemon", "Zair/PK Fire spacing", "Boy Marth", "Utilt", "Genkai wo Koeru", "Instapin", "BANonetta", "Nonexistant Swordfighter", "Nonexistant Brawler", "Nonexistant Gunner"];
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
        } else if (this.name == "Bowser Jr") {
            this.modifiers = [new Modifier("Clown Kart", 1, 0.88, 1, 1, 1, 1, 1, 1, 1), new Modifier("Body", 1, 1.15, 1, 1, 1, 1, 1, 1, 1)];
            this.modifier = this.modifiers[0];
        }else if (this.name == "Wii Fit Trainer") {
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

class Result {
    constructor(name, training, vs, hidetraining, hidevs) {
        this.name = name;
        this.title = getTitle(name);
        this.training = training;
        this.vs = vs;
        this.hidetraining = false;
        this.hidevs = false;
        this.style = "";

        this.addStyle = function (style) {
            this.style = style;
            return this;
        }

        if (hidetraining != undefined) {
            this.hidetraining = hidetraining;
        }
        if (hidevs != undefined) {
            this.hidevs = hidevs;
        }

        if (typeof training === "number" && isNaN(training)) {
            this.addStyle({ 'color': 'red' });
            this.training = "Invalid data";
        } else {
            if (name == "Hitstun" || name == "Attacker Hitlag" || name == "Target Hitlag" || name == "Shield stun" || name == "Shield Hitlag" || name == "Shield Advantage" || name == "Hit Advantage" || name == "Paralysis time" || name == "Reeling hitstun" || name == "Luma hitstun") {
                this.training = training + (training == 1 ? " frame" : " frames");
            } else if (name == "Airdodge hitstun cancel" || name == "Aerial hitstun cancel" || name == "First Actionable Frame" || name == "Reeling FAF") {
                this.training = "Frame " + training;
            } else {
                this.training = training;
            }
        }

        if (typeof vs === "number" && isNaN(vs)) {
            this.addStyle({ 'color': 'red' });
            this.vs = "Invalid data";
        } else {
			if (name == "Hitstun" || name == "Attacker Hitlag" || name == "Target Hitlag" || name == "Shield stun" || name == "Shield Hitlag" || name == "Shield Advantage" || name == "Hit Advantage" || name == "Paralysis time" || name == "Reeling hitstun" || name == "Luma hitstun") {
                this.vs = vs + (vs == 1 ? " frame" : " frames");
            } else if (name == "Airdodge hitstun cancel" || name == "Aerial hitstun cancel" || name == "First Actionable Frame" || name == "Reeling FAF") {
                this.vs = "Frame " + vs;
            } else {
                this.vs = vs;
            }
        }

        if (typeof (this.training) == "string") {
            this.training = this.training;
        } else {
            this.training = +this.training.toFixed(4);
        }

        if (typeof (this.vs) == "string") {
            this.vs = this.vs;
        } else {
            this.vs = +this.vs.toFixed(4);
        }


    }


};

class ResultRow {
    constructor(name, title, style, v1, v2, h1, h2) {
        this.name = name;
        this.title = title;
        this.val1 = v1;
        this.val2 = v2;
        this.h1 = h1;
        this.h2 = h2;
        this.style = style;
        this.onlyOne = v1 == v2 && !h1 && !h2;
        this.valc = this.onlyOne ? this.val1 : "";
        if (h1 || this.onlyOne) {
            this.val1 = "";
        }
        if (h2 || this.onlyOne) {
            this.val2 = "";
        }

    }
};

class ResultList {
    constructor(resultList, firstvs) {
        this.resultList = resultList;
        this.firstvs = firstvs;
        this.list = [];
        for (var i = 0; i < resultList.length; i++) {
            if (!resultList[i].hidetraining || !resultList[i].hidevs) {
                if (!firstvs) {
                    this.list.push(new ResultRow(resultList[i].name, resultList[i].title, resultList[i].style, resultList[i].training, resultList[i].vs, resultList[i].hidetraining, resultList[i].hidevs));
                } else {
                    this.list.push(new ResultRow(resultList[i].name, resultList[i].title, resultList[i].style, resultList[i].vs, resultList[i].training, resultList[i].hidevs, resultList[i].hidetraining));
                }
            }
        }
    }
};

function List(trainingvalues, vsvalues) {
    var list = [];
    var attributes = ["Damage", "Attacker Hitlag", "Target Hitlag", "Total KB", "Angle", "X", "Y", "Hitstun", "First Actionable Frame", "Airdodge hitstun cancel", "Aerial hitstun cancel", "LSI", "Horizontal Launch Speed", "Gravity boost", "Vertical Launch Speed", "Max Horizontal Distance", "Max Vertical Distance"];
    var titles = ["Damage dealt to the target",
    ];
    var hitstun = -1;
    for (var i = 0; i < attributes.length && i < vsvalues.length; i++) {
        if (attributes[i] == "Hitstun") {
            hitstun = +vsvalues[i].toFixed(4);
        }
        if (hitstun != -1 && (attributes[i] == "Airdodge hitstun cancel" || attributes[i] == "Aerial hitstun cancel")) {
            if (hitstun + 1 == +values[i].toFixed(4)) {
                continue;
            }
            if (hitstun == 0) {
                continue;
            }
        }
        if (attributes[i] == "LSI") {
            if (values[i] == 1) {
                continue;
            }
            values[i] = "x" + +values[i].toFixed(4);
        }
        if (attributes[i] == "Gravity boost") {
            if (values[i] == 0) {
                continue;
            }
        }
        if (typeof (values[i]) == "string") {
            list.push(new ListItem(attributes[i], values[i], titles[i]));
        } else {
            list.push(new ListItem(attributes[i], +values[i].toFixed(4), titles[i]));
        }
        if (attributes[i] == "Angle") {
            if (values[i] > 361) {
                i += 2;
            }
        }
    }
    return list;
}

//Bit Flagged state
var CharacterState = {
	LAUNCH_START: 1, //Start launch
	GROUNDED: 2, //Grounded
	SLIDING: 4, //Sliding
	AERIAL: 8, //In the air
	COLLIDING_FLOOR: 16, //Colliding with floor
	COLLIDING_WALL: 32, //Colliding with floor
	COLLIDING_CEILING: 64 //Colliding with floor
};

class Collision {
	constructor(frame, stage, position, next_position, momentum, state, tumble, launch_speed, angle) {
		this.collisionOccurred = false;
		this.collision_data = {
			"next_position": next_position,
			"resetGravity": false,
			"launchSpeed": launch_speed,
			"angle": angle,
			"momentum": momentum,
			"state": state,
			"collision": null,
			"intersection": null,
			"lineType": null,
			"slideDirection" : 0 //0 none, -1 left, 1 right
		};

		if (stage == null)
			return;

		var launch_line = [position, next_position];
		var launch_angle = LineAngle(launch_line);

		var collisionFound = false;

		//Check stage collisions
		for (var i = 0; i < stage.collisions.length; i++) {

			var intersections = IntersectionLines(launch_line, stage.collisions[i].vertex);

			if (intersections.length == 0)
				continue; //No intersections found

			var material, normal;
			//Calculate distance for all stage lines intersections
			for (var j = 0; j < intersections.length; j++) {
				intersections[j].distance = LineDistance(position, intersections[j].line);
			}

			intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			var intersection = intersections[0];

			//Get passthrough angle
			material = stage.collisions[i].materials[intersection.i];
			//Check if angle between current position and possible next position make collision with line
			if (!LineCollision(launch_angle, material.passthroughAngle))
				break;

			//Found collision
			collisionFound = true;

			//Prepare data
			var lineType = GetLineType(material);
			this.collision_data.next_position = intersection.point;
			this.collision_data.collision = stage.collisions[i];
			this.collision_data.intersection = intersection;
			this.collision_data.lineType = lineType;

			//Check if it bounces off the wall/floor/ceiling
			if (tumble) {
				//Collides and Bounces off
				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.COLLIDING_FLOOR;
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_WALL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_CEILING;
				}
				//Calculate bounced off angle
				var rAngle = (2 * (material.passthroughAngle)) - 180 - launch_angle;
				launch_speed.x = Math.abs(launch_speed.x * 0.8);
				launch_speed.y = Math.abs(launch_speed.y * 0.8);
				if (Math.cos(rAngle * Math.PI / 180) < 0) {
					launch_speed.x *= -1;
				}
				if (Math.sin(rAngle * Math.PI / 180) < 0) {
					launch_speed.y *= -1;
				}

				this.collision_data.angle = rAngle;
				this.collision_data.launchSpeed = launch_speed;

				if (Math.sin(rAngle * Math.PI / 180) > 0) {
					momentum = 1;
				} else if (Math.sin(rAngle * Math.PI / 180) < 0) {
					momentum = -1;
				} else {
					momentum = 0;
				}

				this.collision_data.momentum = momentum;



			} else {
				//Doesn't collide/bounce off

				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.SLIDING;

					var sAngle = LineAngle(intersection.line);
					//Direction of the slope
					if (Math.cos(angle * Math.PI / 180) > 0) {
						this.collision_data.slideDirection = 1;
						if (Math.cos(sAngle * Math.PI / 180) < 0) {
							sAngle = ((sAngle - 180) + 360) % 360;
						}
					} else if (Math.cos(angle * Math.PI / 180) < 0) {
						this.collision_data.slideDirection = -1;
						if (Math.cos(sAngle * Math.PI / 180) > 0) {
							sAngle = (sAngle + 180) % 360;
						}
					}
					this.collision_data.angle = sAngle;

					if (this.collision_data.launchSpeed.x > 8.3) {
						this.collision_data.launchSpeed.x = 8.3;
					}
					this.collision_data.launchSpeed.y = 0;

					if (Math.sin(sAngle * Math.PI / 180) > 0) {
						momentum = 1;
					} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
						momentum = -1;
					} else {
						momentum = 0;
					}

					var p = ClosestPointToLine(GetPointFromSlide(intersection.point, this.collision_data.launchSpeed, sAngle, intersection.line), intersection.line);
					this.collision_data.next_position = [p[0], p[1]];
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}

				
				
			}

			if (collisionFound)
				break;
		}

		this.collisionOccurred = collisionFound;

		if (collisionFound)
			return;

		//Check platforms

		//If momentum isn't -1 (character is going down) don't check platform collisions
		if (momentum != -1)
			return;

		for (var i = 0; i < stage.platforms.length; i++) {
			var intersections = IntersectionLines(launch_line, stage.platforms[i].vertex);


			if (intersections.length == 0)
				continue; //No intersections found

			var material, normal;
			//Calculate distance for all stage lines intersections
			for (var j = 0; j < intersections.length; j++) {
				intersections[j].distance = LineDistance(position, intersections[j].line);
			}

			intersections.sort(function (a, b) {
				if (a.distance < b.distance) {
					return -1;
				} else if (a.distance > b.distance) {
					return 1;
				}
				return 0;
			});

			var intersection = intersections[0];

			//Get passthrough angle
			material = stage.platforms[i].materials[intersection.i];
			//Check if angle between current position and possible next position make collision with line
			if (!LineCollision(launch_angle, material.passthroughAngle))
				return;

			//Found collision
			collisionFound = true;

			//Prepare data
			var lineType = GetLineType(material);
			this.collision_data.next_position = intersection.point;
			this.collision_data.collision = stage.platforms[i];
			this.collision_data.intersection = intersection;
			this.collision_data.lineType = lineType;

			//Check if it bounces off the wall/floor/ceiling
			if (tumble) {
				//Collides and Bounces off
				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.COLLIDING_FLOOR;
				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_WALL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.COLLIDING_CEILING;
				}
				//Calculate bounced off angle
				var rAngle = (2 * (material.passthroughAngle)) - 180 - launch_angle;
				launch_speed.x = Math.abs(launch_speed.x * 0.8);
				launch_speed.y = Math.abs(launch_speed.y * 0.8);
				if (Math.cos(rAngle * Math.PI / 180) < 0) {
					launch_speed.x *= -1;
				}
				if (Math.sin(rAngle * Math.PI / 180) < 0) {
					launch_speed.y *= -1;
				}

				this.collision_data.angle = rAngle;
				this.collision_data.launchSpeed = launch_speed;

				if (Math.sin(rAngle * Math.PI / 180) > 0) {
					momentum = 1;
				} else if (Math.sin(rAngle * Math.PI / 180) < 0) {
					momentum = -1;
				} else {
					momentum = 0;
				}

				this.collision_data.momentum = momentum;



			} else {
				//Doesn't collide/bounce off

				if (lineType == LineTypes.FLOOR) {
					this.collision_data.resetGravity = true;
					this.collision_data.state = CharacterState.SLIDING;

					var sAngle = LineAngle(intersection.line);
					//Direction of the slope
					if (Math.cos(angle * Math.PI / 180) > 0) {
						this.collision_data.slideDirection = 1;
						if (Math.cos(sAngle * Math.PI / 180) < 0) {
							sAngle = ((sAngle - 180) + 360) % 360;
						}
					} else if (Math.cos(angle * Math.PI / 180) < 0) {
						this.collision_data.slideDirection = -1;
						if (Math.cos(sAngle * Math.PI / 180) > 0) {
							sAngle = (sAngle + 180) % 360;
						}
					}
					this.collision_data.angle = sAngle;

					if (Math.sin(sAngle * Math.PI / 180) > 0) {
						momentum = 1;
					} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
						momentum = -1;
					} else {
						momentum = 0;
					}

					if (this.collision_data.launchSpeed.x > 8.3) {
						this.collision_data.launchSpeed.x = 8.3;
					}
					this.collision_data.launchSpeed.y = 0;

					var p = ClosestPointToLine(GetPointFromSlide(intersection.point, this.collision_data.launchSpeed, sAngle, intersection.line), intersection.line);
					this.collision_data.next_position = [p[0],p[1]];

				}
				else if (lineType == LineTypes.WALL) {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}
				else {
					this.collision_data.resetGravity = false;
					this.collision_data.state = CharacterState.AERIAL;
				}



			}

			if (collisionFound) {
				this.collisionOccurred = true;
				return;
			}
		}
	}
}

class Distance{
    constructor(kb, x_launch_speed, y_launch_speed, hitstun, angle, di, gravity, faf, fall_speed, traction, inverseX, onSurface, position, stage, doPlot, extraFrames){
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
        this.extraFrames = 20;
        this.finalPosition = position;
		this.extra = [];
		this.collisions = 0;
        if (extraFrames !== undefined) {
            this.extraFrames = extraFrames;
        }
        
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

        var x_speed = +this.x_launch_speed.toFixed(4);
		var y_speed = +this.y_launch_speed.toFixed(4);

		this.KO = false;

        if(this.inverseX){
            angle = InvertXAngle(angle);
        }
        if(Math.cos(angle * Math.PI / 180) < 0){
            x_speed *= -1;
        }
        if(Math.sin(angle * Math.PI / 180) < 0){
            y_speed *= -1;
        }
        this.x = [this.position.x];
        this.y = [this.position.y];
        var decay = { 'x': parameters.decay * Math.cos(angle * Math.PI / 180), 'y': parameters.decay * Math.sin(angle * Math.PI / 180) };
        var character_position = {'x':this.position.x,'y':this.position.y};
		var launch_speed = { 'x': x_speed, 'y': y_speed };
		var next_position = { 'x': 0, 'y': 0 };
        var character_speed = { 'x': 0, 'y': 0 };
        this.vertical_speed = [];
        var momentum = 1;
        var g = 0;
        var fg = 0;
        this.bounce_frame = -1;
		this.bounce_speed = 0;
		var state = CharacterState.LAUNCH_START;

		//if (aerial) {
		//	state |= CharacterState.AERIAL;
		//} else {
		//	state |= CharacterState.GROUNDED;
		//}

        this.launch_speeds = [];
		var limit = hitstun < 200 ? hitstun + this.extraFrames : 200;

		var previousCollisionIntersection = null;
		var previousCollision = null;

		var slidingDirection = 0;

		for (var i = 0; i < limit; i++){

            var next_x = character_position.x + launch_speed.x + character_speed.x;
			var next_y = character_position.y + launch_speed.y + character_speed.y;

			var prev_state = state;

			next_position.x = next_x;
			next_position.y = next_y;

            this.launch_speeds.push(Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2)));

            this.vertical_speed.push((launch_speed.y));

            //Vertical direction
            if(next_y > character_position.y){
				momentum = 1;
            }else if(next_y < character_position.y){
				momentum = -1;
            }else{
                momentum = 0;
            }

			var countGravity = true;

            //Stage detection
			if (this.stage != null) {
				var c = new Collision(i, this.stage, [character_position.x, character_position.y], [next_x, next_y], momentum, state, this.tumble, launch_speed, angle);

				if (c.collisionOccurred) {
					this.collisions++;
					launch_speed = c.collision_data.launchSpeed;
					next_x = c.collision_data.next_position[0];
					next_y = c.collision_data.next_position[1];
					angle = c.collision_data.angle;
					momentum = c.collision_data.momentum;
					state = c.collision_data.state;
					previousCollision = c.collision_data.collision;
					previousCollisionIntersection = c.collision_data.intersection;
					slidingDirection = c.collision_data.slideDirection;
					decay = { 'x': parameters.decay * Math.cos(angle * Math.PI / 180), 'y': parameters.decay * Math.sin(angle * Math.PI / 180) };

					if (c.collision_data.resetGravity) {
						g = 0;
						fg = 0;
						countGravity = false;
					}
				} else {
					if (((state & CharacterState.SLIDING) == CharacterState.SLIDING) && previousCollision != null) {
						countGravity = false;
						g = 0;
						fg = 0;
						character_speed.y = 0;
						if (!PointInLine([character_position.x, character_position.y], previousCollisionIntersection.line)) {
							//Check if the next position is in the line next to the one that started the slide
							var prev_index = (previousCollisionIntersection.i - 1) % previousCollision.vertex.length;
							var next_index = (previousCollisionIntersection.i + 1) % previousCollision.vertex.length;
							var next_index2 = (previousCollisionIntersection.i + 2) % previousCollision.vertex.length;
							if (prev_index == -1) {
								prev_index = previousCollision.vertex.length-1;
							}
							//Get line that is on the direction of sliding direction
							var prev_line = [previousCollision.vertex[prev_index], previousCollision.vertex[previousCollisionIntersection.i]];
							var next_line = [previousCollision.vertex[next_index], previousCollision.vertex[next_index2]];
							var prev_line_floor = GetLineType(previousCollision.materials[prev_index]) == LineTypes.FLOOR;
							var next_line_floor = GetLineType(previousCollision.materials[next_index]) == LineTypes.FLOOR;
							var material = null;
							var selected_line = null;
							var selected_index = 0;
							if (slidingDirection == -1) {
								//Left
								if (prev_line[0][0] < previousCollisionIntersection.line[0][0] && prev_line_floor) {
									selected_line = prev_line;
									selected_index = prev_index;
									material = previousCollision.materials[prev_index];
								} else if (next_line[0][0] < previousCollisionIntersection.line[0][0] && next_line_floor) {
									selected_line = next_line;
									selected_index = next_index;
									material = previousCollision.material[next_index];
								}
							} else if (slidingDirection == 1) {
								//Right
								if (prev_line[0][0] > previousCollisionIntersection.line[0][0] && prev_line_floor) {
									selected_line = prev_line;
									selected_index = prev_index;
									material = previousCollision.materials[prev_index];
								} else if (next_line[0][0] > previousCollisionIntersection.line[0][0] && next_line_floor) {
									selected_line = next_line;
									selected_index = next_index;
									material = previousCollision.materials[next_index];
								}
							} else {
								//Landed on this point and doesn't have horizontal momentum, so we end here
								for (var ii = i; ii <= hitstun; i++) {
									//Fill the rest of the data until hitstun end
									this.x.push(+character_position.x.toFixed(6));
									this.y.push(+character_position.y.toFixed(6));
								}
								break;
							}

							if (selected_line != null) {

								//We have the next line the character will continue to slide, recalculate angle and get next point
								previousCollisionIntersection.line = selected_line;
								previousCollisionIntersection.i = selected_index;
								previousCollisionIntersection.point = p;

								var sAngle = LineAngle(selected_line);
								//Direction of the slope
								if (slidingDirection == 1) {
									if (Math.cos(sAngle * Math.PI / 180) < 0) {
										sAngle = ((sAngle - 180) + 360) % 360;
									}
								} else if (slidingDirection == -1) {
									if (Math.cos(sAngle * Math.PI / 180) > 0) {
										sAngle = (sAngle + 180) % 360;
									}
								}
								angle = sAngle;

								launch_speed.y = 0;

								if (Math.sin(sAngle * Math.PI / 180) > 0) {
									momentum = 1;
								} else if (Math.sin(sAngle * Math.PI / 180) < 0) {
									momentum = -1;
								} else {
									momentum = 0;
								}

								var p = ClosestPointToLine(GetPointFromSlide([character_position.x, character_position.y],launch_speed,angle,selected_line), selected_line);
								next_x = p[0];
								next_y = p[1];

							} else {
								state &= 0x9;
								state |= CharacterState.AERIAL;
								slidingDirection = 0;
							}
						} else {
							//Same line
							var p = ClosestPointToLine(GetPointFromSlide([character_position.x, character_position.y], launch_speed, angle, previousCollisionIntersection.line), previousCollisionIntersection.line);
							next_x = p[0];
							next_y = p[1];

						}
					} else {
						state &= 0x9;
						state |= CharacterState.AERIAL;
						slidingDirection = 0;
					}
				}
			} else {
				state &= 0x9;
				state |= CharacterState.AERIAL;
				slidingDirection = 0;
			}

			if (((state & CharacterState.SLIDING) == CharacterState.SLIDING)) {
				//Sliding on surface
				//Traction applied here
				if (launch_speed.x != 0) {
					var x_dir = launch_speed.x / Math.abs(launch_speed.x);
					if (launch_speed.x < 0) {
						launch_speed.x += traction;
					} else {
						launch_speed.x -= traction;
					}
					launch_speed.x = +launch_speed.x.toFixed(6);
					if (x_dir == -1 && launch_speed.x > 0) {
						launch_speed.x = 0;
					} else if (x_dir == 1 && launch_speed.x < 0) {
						launch_speed.x = 0;
					}
				}
				if (launch_speed.y != 0) {
					var y_dir = launch_speed.y / Math.abs(launch_speed.y);
					launch_speed.y -= decay.y;
					launch_speed.y = +launch_speed.y.toFixed(6);
					if (y_dir == -1 && launch_speed.y > 0) {
						launch_speed.y = 0;
					} else if (y_dir == 1 && launch_speed.y < 0) {
						launch_speed.y = 0;
					}
				}
				character_speed.y = 0;
				//launch_speed.y = 0;
				g = 0;
			} else if ((state & (CharacterState.COLLIDING_FLOOR - 1)) != 0) { //Not colliding
				//Apply decay
				if (launch_speed.x != 0) {
					var x_dir = launch_speed.x / Math.abs(launch_speed.x);
					launch_speed.x -= decay.x;
					launch_speed.x = +launch_speed.x.toFixed(6);
					if (x_dir == -1 && launch_speed.x > 0) {
						launch_speed.x = 0;
					} else if (x_dir == 1 && launch_speed.x < 0) {
						launch_speed.x = 0;
					}
				}
				if (launch_speed.y != 0) {
					var y_dir = launch_speed.y / Math.abs(launch_speed.y);
					launch_speed.y -= decay.y;
					launch_speed.y = +launch_speed.y.toFixed(6);
					if (y_dir == -1 && launch_speed.y > 0) {
						launch_speed.y = 0;
					} else if (y_dir == 1 && launch_speed.y < 0) {
						launch_speed.y = 0;
					}
				}
				//Gravity
				if (countGravity) {
					g -= gravity;
					fg = Math.max(g, -fall_speed);
					character_speed.y = fg;
					character_speed.y = +character_speed.y.toFixed(6);
				} else {
					character_speed.y = 0;
				}
			}

            character_position.x = next_x;
            character_position.y = next_y;

            this.x.push(+character_position.x.toFixed(6));
            this.y.push(+character_position.y.toFixed(6));

            
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

            if (i == hitstun) {
                this.finalPosition = { "x": character_position.x, "y": character_position.y };
			}

			if (i == 0) {
				state &= 0xFE; //Clear launch start flag
			}
		}

		this.vertical_speed.push((launch_speed.y));

        this.graph_x = Math.abs(this.max_x);
        this.graph_y = Math.abs(this.max_y);

        this.max_x = Math.abs(this.max_x - this.position.x);
		this.max_y = Math.abs(this.max_y - this.position.y);

		this.ko_data = [];

		this.di_plot = [];

		if (this.stage != null) {
			var data = [];
			var ko = false;
			var crossed = false;
			var character_size = 0;

			//Calculate if KO in blast zones
			for (var i = 0; i <= hitstun && !ko; i++) {
				if (this.y[i] >= this.stage.blast_zones[2] + 30 || this.y[i] <= this.stage.blast_zones[3] - 30) {
					this.ko_data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
					this.extra.push(new Result("KO", "Frame " + i, "", false, true));
					ko = true;
					break;
				}
				if (this.x[i] - character_size <= this.stage.blast_zones[0] || this.x[i] + character_size >= this.stage.blast_zones[1] || this.y[i] - character_size <= this.stage.blast_zones[3]) {
					this.ko_data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
					this.extra.push(new Result("KO", "Frame " + i, "", false, true));
					ko = true;
					break;
				} else {
					if (this.y[i] + character_size >= this.stage.blast_zones[2]) {
						if (this.vertical_speed[i] >= 2.4) { //If it has lower launch speed it will pass the blast zone without a KO
							this.ko_data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
							this.extra.push(new Result("KO", "Frame " + i, "", false, true));
							ko = true;
							break;
						} else {
							if (hitstun < (2.4 / 0.03) * 0.4) { //Hitstun frames is lower than 2.4 launch speed, this is used if the target is hit ON the blast zone
								this.ko_data.push({ 'calcValue': "KO", 'x': [this.x[i]], 'y': [this.y[i]], 'mode': 'markers', 'marker': { 'color': 'red', size: 15 }, 'name': "KO" });
								this.extra.push(new Result("KO", "Frame " + i, "", false, true));
								ko = true;
								break;
							} else {
								//At least get launch speed the opponent had when crossing the blast zone
								if (!crossed) {
									crossed = true;
									this.extra.push(new Result("Vertical launch speed when crossing blast zone", this.vertical_speed[i], "", false, true));
									this.extra.push(new Result("Required vertical launch speed to KO", "2.4", "", false, true));
									this.extra.push(new Result("Frame crossing blast zone", "Frame " + i, "", false, true));
								}
							}
						}
					}
				}

			}

			this.KO = ko;
		}

		this.doPlot = function () {
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
			for (var i = 0; i < this.x.length; i++) {
				var xdata = [];
				var ydata = [];
				var change = false;
				do {
					px = this.x[i];
					py = this.y[i];
					if (i == 0) {
						if (i + 1 < this.x.length) {
							if (py > this.y[i + 1]) {
								if (dir == 1) {
									change = true;
									dir = -1;
								}
							} else {
								if (py < this.y[i + 1]) {
									if (dir == -1) {
										change = true;
										dir = 1;
									}
								}
							}
						}
					} else {
						if (py < cy) {
							if (dir == 1) {
								change = true;
							}
							dir = -1;
						} else {
							if (dir == -1) {
								change = true;
							}
							dir = 1;
						}
					}
					if (!change) {
						xdata.push(px);
						ydata.push(py);
						cx = px;
						cy = py;
						i++;
					} else {
						if (i != 0) {
							xdata.push(px);
							ydata.push(py);
						}
						i--;
					}
				} while (!change && i < this.x.length);
				if (xdata.length > 0) {
					data.push({ 'calcValue': "Launch", 'x': xdata, 'y': ydata, 'mode': 'lines+markers', 'marker': { 'color': color }, 'line': { 'color': color }, 'name': color == 'blue' ? "" : "" });
				}
				switch (color) {
					case 'blue':
						color = "red";
						break;
					case 'red':
						color = "blue";
						break;
				}
			}

			if (hitstun < this.x.length) {
				data.push({ 'calcValue': "Launch", 'x': [this.x[hitstun]], 'y': [this.y[hitstun]], 'mode': 'markers', 'marker': { 'color': 'brown', 'size': 14 }, 'name': "Hitstun end" });
			}

			if (faf >= 0) {
				if (faf < this.x.length) {
					data.push({ 'calcValue': "Launch", 'x': [this.x[faf]], 'y': [this.y[faf]], 'mode': 'markers', 'marker': { 'color': '#0066FF', 'size': 14 }, 'name': "Attacker FAF" });
				}
			}

			var adxdata = [];
			var adydata = [];

			for (var i = hitstun + 1; i < this.x.length; i++) {
				adxdata.push(this.x[i]);
				adydata.push(this.y[i]);
			}

			if (adxdata.length > 0) {
				data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'orange' }, 'name': "Actionable frame" });
			}

			adxdata = [];
			adydata = [];

			if (airdodge < hitstun) {
				for (var i = airdodge; i < hitstun; i++) {
					adxdata.push(this.x[i]);
					adydata.push(this.y[i]);
				}


				if (adxdata.length > 0) {
					data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'yellow' }, 'name': "Airdodge cancel" });
				}

			}

			if (aerial < hitstun) {
				adxdata = [];
				adydata = [];
				for (var i = aerial; i < hitstun; i++) {
					adxdata.push(this.x[i]);
					adydata.push(this.y[i]);
				}
				if (adxdata.length > 0) {
					data.push({ 'calcValue': "Launch", 'x': adxdata, 'y': adydata, 'mode': 'markers', 'marker': { 'color': 'green' }, 'name': "Aerial cancel" });
				}

			}

			//Stage blast zones
			if (this.stage != null) {
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

				data.push({ 'calcValue': "Blast zone", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'red' }, 'name': "Blast zone" });

				//Stage Camera bounds
				adxdata = [];
				adydata = [];
				adxdata.push(this.stage.camera[0]);
				adxdata.push(this.stage.camera[1]);
				adxdata.push(this.stage.camera[1]);
				adxdata.push(this.stage.camera[0]);
				adxdata.push(this.stage.camera[0]);

				adydata.push(this.stage.camera[2]);
				adydata.push(this.stage.camera[2]);
				adydata.push(this.stage.camera[3]);
				adydata.push(this.stage.camera[3]);
				adydata.push(this.stage.camera[2]);

				data.push({ 'calcValue': "Camera bounds", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'blue' }, 'name': "Camera bounds" });

				//Stage surface
				adxdata = [];
				adydata = [];
				var adxdata2 = [];
				var adydata2 = [];
				var semi_tech = [];

				for (var i = 0; i < this.stage.collisions.length; i++) {
					adxdata = [];
					adydata = [];
					for (var j = 0; j < this.stage.collisions[i].vertex.length; j++) {
						adxdata.push(this.stage.collisions[i].vertex[j][0]);
						adydata.push(this.stage.collisions[i].vertex[j][1]);

						if (j < this.stage.collisions[i].vertex.length - 1) {
							//Wall jump disabled walls
							adxdata2 = [];
							adydata2 = [];
							if (this.stage.collisions[i].materials[j].noWallJump) {
								adxdata2.push(this.stage.collisions[i].vertex[j][0]);
								adydata2.push(this.stage.collisions[i].vertex[j][1]);
								adxdata2.push(this.stage.collisions[i].vertex[j + 1][0]);
								adydata2.push(this.stage.collisions[i].vertex[j + 1][1]);
								semi_tech.push({ 'calcValue': this.stage.collisions[i].name + " Wall jump disabled wall", 'x': adxdata2, 'y': adydata2, 'mode': 'lines', 'line': { 'color': 'purple' }, 'name': "Wall jump disabled wall" });
							}
							//Small walls
							adxdata2 = [];
							adydata2 = [];
							if (this.stage.collisions[i].materials[j].length <= 7 && (this.stage.collisions[i].materials[j].wall || this.stage.collisions[i].materials[j].ceiling) && !this.stage.collisions[i].materials[j].noWallJump) {
								adxdata2.push(this.stage.collisions[i].vertex[j][0]);
								adydata2.push(this.stage.collisions[i].vertex[j][1]);
								adxdata2.push(this.stage.collisions[i].vertex[j + 1][0]);
								adydata2.push(this.stage.collisions[i].vertex[j + 1][1]);
								semi_tech.push({ 'calcValue': this.stage.collisions[i].name + " small wall", 'x': adxdata2, 'y': adydata2, 'mode': 'lines', 'line': { 'color': 'red' }, 'name': "Semi-techable small wall" });
							}
						}
					}
					data.push({ 'calcValue': this.stage.collisions[i].name, 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'green' }, 'name': "Stage" });
				}

				data = data.concat(semi_tech);



				//Stage platforms
				if (this.stage.platforms !== undefined) {
					for (var i = 0; i < this.stage.platforms.length; i++) {
						adxdata = [];
						adydata = [];
						for (var j = 0; j < this.stage.platforms[i].vertex.length; j++) {
							adxdata.push(this.stage.platforms[i].vertex[j][0]);
							adydata.push(this.stage.platforms[i].vertex[j][1]);
						}
						data.push({ 'calcValue': "Platform", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'green' }, 'name': "Platform: " + this.stage.platforms[i].name });
					}
				}


				data = data.concat(this.ko_data);
				this.graph_x = Math.max(this.graph_x, this.stage.blast_zones[1]);
				this.graph_y = Math.max(this.graph_y, this.stage.blast_zones[2]);
			}

			this.plot = data;
		};

		this.doDIPlot = function (di,d, koAtZero) {
			//Use di angle to make the line and from there try to make the arrow head
			var x_data = [];
			var y_data = [];

			if (koAtZero) {
				//KO regardless of DI
				this.di_plot.push({ 'calcValue': "Position", 'x': [this.position.x], 'y': [this.position.y], 'mode': 'markers', 'marker': { 'color': 'red', 'size': 5 }, 'hoverinfo': 'none' });
				return;
			}

			this.di_plot.push({ 'calcValue': "Position", 'x': [this.position.x], 'y': [this.position.y], 'mode': 'markers', 'marker': { 'color': 'black', 'size': 5 }, 'hoverinfo': 'none' });

			if (this.inverseX) {
				di = InvertXAngle(di);
			}

			x_data.push(this.position.x);
			y_data.push(this.position.y);

			var point = { x: this.position.x, y: this.position.y };
			point.x += (d * Math.cos(di * Math.PI / 180));
			point.y += (d * Math.sin(di * Math.PI / 180));
			x_data.push(point.x);
			y_data.push(point.y);

			var head_angle = 135;

			x_data.push(point.x + ((d / 3) * Math.cos((di + head_angle) * Math.PI / 180)));
			y_data.push(point.y + ((d / 3) * Math.sin((di + head_angle) * Math.PI / 180)));

			x_data.push(point.x);
			y_data.push(point.y);

			x_data.push(point.x + ((d / 3) * Math.cos((di - head_angle) * Math.PI / 180)));
			y_data.push(point.y + ((d / 3) * Math.sin((di - head_angle) * Math.PI / 180)));

			
			this.di_plot.push({ 'calcValue': "DI", 'x': x_data, 'y': y_data, 'mode': 'lines', 'line': { 'color': 'black' }, 'hoverinfo':'none' });

		}

        if(!doPlot){
            this.data = [];
			this.plot = [];
			this.di_plot = [];
            return;
        }

		this.doPlot();

    }
};

class Knockback {
    constructor(kb, angle, gravity, fall_speed, aerial, windbox, electric, percent, set_weight, di, launch_rate) {
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
        }
        this.kb = this.base_kb;
        this.original_angle = angle;
        this.base_angle = angle;
        this.angle_with_di = angle;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
		this.windbox = windbox;
		this.set_weight = set_weight;
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.fall_speed = fall_speed;
        this.add_gravity_speed = parameters.gravity.mult * (this.gravity - parameters.gravity.constant);
        this.percent = percent;
        this.reeling = false;
        this.spike = false;
        this.di_change = 0;
        this.launch_speed = LaunchSpeed(kb);
        this.lsi = lsi;
        this.horizontal_launch_speed = 0;
        this.vertical_launch_speed = 0;
        this.launch_rate = launch_rate;
        this.electric = electric;
        if (this.launch_rate == undefined) {
            this.launch_rate = 1;
        }
        if(this.lsi == undefined){
            this.lsi = 1;
        }
        this.hitstun = Hitstun(this.base_kb, this.windbox, this.electric);
        if (di !== undefined) {
            this.di = di;
        } else {
            this.di = -1;
        }
        this.calculate = function () {
            this.kb = this.base_kb * this.launch_rate;
            if (this.original_angle == 361) {
                this.base_angle = SakuraiAngle(this.kb, this.aerial);
            }
            this.angle = this.base_angle;
            if (this.base_angle != 0 && this.base_angle != 180) {
                this.tumble = this.kb > 80 && !windbox;
            }
            if ((this.base_angle == 0 || this.base_angle == 180) && this.aerial) {
                this.tumble = this.kb > 80 && !windbox;
            }
            this.di_able = this.tumble;
            if (this.di_able) {
                this.di_change = DI(this.di, this.angle);
                this.angle += this.di_change;
            }
            this.angle_with_di = this.angle;
            this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
            this.y = Math.abs(Math.sin(this.angle * Math.PI / 180) * this.kb);
            this.add_gravity_speed = parameters.gravity.mult * (this.gravity - parameters.gravity.constant);
			if (!this.tumble || this.set_weight){
                this.add_gravity_speed = 0;
            }
            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0 && !this.windbox && !this.aerial) {
                    this.can_jablock = true;
                }
            }
            this.spike = this.angle >= 230 && this.angle <= 310;
            if (this.spike) {
                if (this.kb != 0 && !this.windbox && !this.aerial) {
                    this.can_jablock = !this.tumble;
                }
            }

            if (this.angle <= 70 || this.angle >= 110) {
                this.reeling = this.tumble && !this.windbox && this.percent >= 100;
            }
            this.launch_speed = LaunchSpeed(this.kb);
            this.horizontal_launch_speed = LaunchSpeed(this.x);
            this.vertical_launch_speed = LaunchSpeed(this.y);

			if (this.tumble && !this.set_weight) {
                this.vertical_launch_speed += this.add_gravity_speed;
				//Gravity boost changes launch angle
				var x_ref = Math.cos(this.angle * Math.PI / 180);
				var y_ref = Math.sin(this.angle * Math.PI / 180);
				this.angle = Math.atan2(this.vertical_launch_speed, this.horizontal_launch_speed) * 180 / Math.PI;
				if (x_ref < 0) {
					this.angle = InvertXAngle(this.angle);
				}
				if (y_ref < 0) {
					this.angle = InvertYAngle(this.angle);
				}
            }
            if (this.tumble) {
                this.lsi = LSI(this.di, this.angle);
            } else {
                this.lsi = 1;
            }
            this.horizontal_launch_speed *= this.lsi;
            this.vertical_launch_speed *= this.lsi;
            this.hitstun = Hitstun(this.base_kb, this.windbox, this.electric);
        };
        this.addModifier = function (modifier) {
            this.base_kb *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.vertical_launch_speed *= parameters.bounce;
                this.horizontal_launch_speed *= parameters.bounce;
            }
        }
        this.calculate();
    }

    

};

class PercentFromKnockback{
    constructor(kb, type, base_damage, damage, preDamage, angle, weight, gravity, fall_speed, aerial, bkb, kbg, wbkb, attacker_percent, r, queue, ignoreStale, windbox, electric, launch_rate){
        this.base_kb = kb;
        if(this.base_kb > 2500){
            //this.base_kb = 2500;
        }
        this.type = type;
        this.original_angle = angle;
        this.base_angle = angle;
        this.base_damage = base_damage;
        this.preDamage = preDamage;
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
        this.queue = queue;
        this.ignoreStale = ignoreStale;
        this.lsi = lsi;
        this.wbkb_kb = -1;
        this.wbkb_modifier = 1;
        this.electric = electric;
        
        this.launch_rate = launch_rate;
        if (this.launch_rate == undefined) {
            this.launch_rate = 1;
        }

        this.best_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };
        this.worst_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };

        this.training_formula = function(kb, base_damage, damage, weight, kbg, bkb, r){
            var s = 1;
            return (500 * kb * (weight + 100) - (r * (kbg * (7 * damage * s * (3 * base_damage * s + 7 * base_damage + 20) + 90 * (weight + 100)) + 500 * bkb * (weight + 100)))) / (7 * kbg * r * (base_damage * (3 * s + 7) + 20)) - preDamage;
        }
        this.vs_formula = function(kb, base_damage, damage, weight, kbg, bkb, r, attacker_percent, queue, ignoreStale){
            var s = StaleNegation(queue, ignoreStale);
            r = r * Rage(attacker_percent) * this.launch_rate;
            return (500 * kb * (weight + 100) - (r * (kbg * (7 * damage * s * (3 * base_damage * s + 7 * base_damage + 20) + 90 * (weight + 100)) + 500 * bkb * (weight + 100)))) / (7 * kbg * r * (base_damage * (3 * s + 7) + 20)) - preDamage;
        }

        if(this.wbkb == 0){
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


        if (this.wbkb == 0) {
            this.calculate = function () {


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

                if (this.wbkb!=0) {
                    if (this.type == "x") {
                        this.kb = Math.abs(this.x / Math.cos(this.angle * Math.PI / 180));
                    }
                    if (this.type == "y") {
                        this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                    }
                }


                this.hitstun = Hitstun(this.kb, this.windbox, this.electric);

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
                this.vs_percent = this.vs_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.queue, this.ignoreStale);


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
                        var hitstun = Hitstun(kb, this.windbox, this.electric);
                        var training = this.training_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r);
                        var vs = this.vs_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.queue, this.ignoreStale);
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
				var wbkb = WeightBasedKB(this.weight, this.bkb, this.wbkb, this.kbg, this.gravity, this.fall_speed, this.r, 0, this.damage, 0, this.angle, this.aerial, this.windbox, -1, this.lsi);
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

function getTitle(attribute) {
    var titles = [
        { "attribute": "Damage", "title": "Damage dealt to the target" },
        { "attribute": "Attacker Hitlag", "title": "Amount of frames attacker is in hitlag" },
        { "attribute": "Target Hitlag", "title": "Amount of frames the target can SDI" },
        { "attribute": "Total KB", "title": "Total KB dealt" },
        { "attribute": "Angle", "title": "Angle target is launched without DI" },
        { "attribute": "X", "title": "KB X component" },
        { "attribute": "Y", "title": "KB Y component" },
        { "attribute": "Hitstun", "title": "Hitstun target gets while being launched" },
        { "attribute": "Reeling hitstun", "title": "Hitstun target gets if it gets launched with a reeling animation" },
        { "attribute": "Reeling FAF", "title": "Frame the target can do any action if it gets launched with a reeling animation" },
        { "attribute": "First Actionable Frame", "title": "Frame the target can do any action" },
        { "attribute": "Airdodge hitstun cancel", "title": "Frame target can cancel hitstun by airdodging" },
        { "attribute": "Aerial hitstun cancel", "title": "Frame target can cancel hitstun by using an aerial" },
        { "attribute": "LSI", "title": "Launch speed multiplier caused by LSI" },
        { "attribute": "Horizontal Launch Speed", "title": "Initial horizontal speed target will be launched" },
        { "attribute": "Vertical Launch Speed", "title": "Initial vertical speed target will be launched" },
        { "attribute": "Max Horizontal Distance", "title": "Horizontal distance travelled being launched after hitstun" },
        { "attribute": "Max Vertical Distance", "title": "Vertical distance travelled being launched after hitstun" },
        { "attribute": "Gravity boost", "title": "Vertical launch speed increase caused by gravity when KB causes tumble" },
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
        { "attribute": "Tumble", "title": "Target will enter tumble if KB > 80" },
        { "attribute": "Reeling/Spin animation", "title": "Also called Untechable spin, special animation caused when KB > 80, angle isn't between 71 and 109 and target's percent is 100 or higher after the attack damage" },
        { "attribute": "Can Jab lock", "title": "If target is in the ground after tumble during the bounce animation the attack can jab lock if Y = 0 or for spikes KB <= 80 and is grounded" },
        { "attribute": "Angle with DI", "title": "Angle the target is launched affected by DI" },
        { "attribute": "Launch angle", "title": "Angle the target is launched with gravity boost" },
        { "attribute": "Luma KB", "title": "Luma KB is calculated with weight = 100 and an additional 15%" },
        { "attribute": "Luma launched", "title": "If Luma KB > 80 it will be launched" },
        { "attribute": "Shield Damage", "title": "Damage done to target shield, (damage + SD) * 1.19" },
        { "attribute": "Full HP shield", "title": "Maximum HP target shield has, can only be increased using Shield Monado Art" },
        { "attribute": "Shield Break", "title": "Yes will appear here if you can break the target shield at full HP in one hit" },
        { "attribute": "Shield stun", "title": "Amount of frames target cannot do any action after shielding an attack" },
        { "attribute": "Shield Hitlag", "title": "Amount of frames target suffers hitlag while shielding" },
        { "attribute": "Shield Advantage", "title": "" },
        { "attribute": "Unblockable attack", "title": "This attack cannot be blocked using shield" },
        { "attribute": "Hit Advantage", "title": "" },
        { "attribute": "Launch rate", "title": "KB multiplier set in the VS mode rules" },
        { "attribute": "Paralysis time", "title": "Amount of frames the target will be paralyzed" }];
    for (var i = 0; i < titles.length; i++) {
        if (attribute == titles[i].attribute) {
            return titles[i].title;
        }
    }
    return "";
};

function ShieldList(values) {
    var list = [];
    var attributes = ["Shield stun", "Shield Hitlag", "Shield Advantage"];
    for (var i = 0; i < attributes.length; i++) {
        list[i] = new ListItem(attributes[i], values[i]);
    }
    return list;
}

function getStages(){
    return loadJSONPath("./Data/Stages/legalstagedata.json");
}


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

var attacker = new Character(names[0]);
var target = new Character(names[0]);


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

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return parameters.crouch_cancelling;
        case "grounded":
            return 1; //0.8 applied after hitstun
        case "charging":
            return parameters.interrupted_smash;
        case "none":
            return 1;
    }
    return 1;
}

function HitlagCrouch(value) {
    switch (value) {
        case "crouch":
            return parameters.crouch_hitlag;
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

var lsi = 0;

var landing_lag = 0;
var stock_dif = "0";

var set_weight = false;
var paralyzer = false;

var launch_rate = 1;