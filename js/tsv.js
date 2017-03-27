var headers = ["attacker","attacker_modifier","attacker_name","target","target_modifier","target_name","attacker_percent","rage","target_percent",
"move","move_base_damage","charge_frames","base_damage","damage","staleness","staleness_multiplier","aura","stock_difference","angle","bkb","kbg",
"kb_modifier","kb_multiplier","kb","kb_x","kb_y","di_lsi_angle","launch_angle","hitstun","tumble","can_jab_lock","lsi_multiplier","horizontal_launch_speed","vertical_launch_speed",
"horizontal_distance","vertical_distance","x_position","y_position"];

var tsv_rows = [];

class Row{
    constructor(attacker, target, attacker_percent, target_percent, move, base_damage, charge_frames, damage, staleness, aura, stock_dif, kb_multiplier, kb, distance){
        this.attacker = attacker;
        this.target = target;
        this.attacker_percent = attacker_percent;
        this.attackerMod = this.attacker.modifier.name;
        this.targetMod = this.target.modifier.name;
        this.attacker_display = this.attacker.name;
        this.target_display = this.target.name;
        if (this.attackerMod == "Normal" || this.attackerMod == "") {
            this.attackerMod = "";
        } else {
            this.attacker_display = this.attacker.name + " (" + this.attackerMod + ")";
        }
        if (this.targetMod == "Normal" || this.targetMod == "") {
            this.targetMod = "";
        } else {
            this.target_display = this.target.name + " (" + this.targetMod + ")";
        }
        this.target_percent = target_percent;
        this.move = move;
        this.base_damage = base_damage;
        this.charge_frames = charge_frames;
        this.damage = damage;
        this.staleness = staleness;
        this.aura = aura;
        this.stock_dif = stock_dif;
        if(this.attacker.name != "Lucario"){
            this.aura = "";
            this.stock_dif = "";
        }
        this.staleMult = StaleNegation(this.staleness, this.staleness == -1);
        this.kb_multiplier = kb_multiplier;
        this.kb_modifier = this.kb_multiplier == 0.8 ? "Crouch Cancel" : this.kb_multiplier == 1.2 ? "Interrupted charged smash attack" : "None";
        this.kb = kb;
        this.kb.calculate();
        this.distance = distance;
        if(this.kb.angle > 361){
            this.distance.max_x = "";
            this.distance.max_y = "";
            this.h_pos = "";
            this.v_pos = "";
        }
        this.rage = Rage(attacker_percent); 
        this.v_pos = distance.finalPosition.y;
        this.h_pos = distance.finalPosition.x;  
        this.lsi = this.kb.lsi;

        this.tsv = function(){
            return [this.attacker.name, this.attackerMod, this.attacker_display, this.target.name, this.targetMod, this.target_display,
            this.attacker_percent, this.rage, this.target_percent,
            this.move.name, this.move.base_damage, this.charge_frames, this.base_damage, this.damage, this.staleness, this.staleMult, this.aura, this.stock_dif, this.move.angle, this.move.bkb, this.move.kbg,
            this.kb_modifier, this.kb_multiplier, this.kb.kb, this.kb.x, this.kb.y, this.kb.di, this.kb.angle, this.kb.hitstun, this.kb.tumble, this.kb.can_jablock, this.lsi, this.kb.horizontal_launch_speed, this.kb.vertical_launch_speed,
            this.distance.max_x, this.distance.max_y, this.h_pos, this.v_pos];
        }
    }
};

function showSaveDialog(data){
    
    var filename = "data.tsv";
    if(window.navigator.msSaveBlob){
        //Edge
        var blob = new Blob([data],{type : 'text/tsv'});
        window.navigator.msSaveBlob(blob,filename);
    }else{
        //Firefox
        if(window.globalStorage){
            var a = document.createElement('a');
            a.style = "display: none";  
            a.download = filename;
            a.href = "data:application/octet-stream;base64," + btoa(data);
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                a.remove();
            },200);
        }else{
            var a = document.createElement('a');
            a.style = "display: none";  
            var blob = new Blob([data],{type : 'text/tsv'});
            var url = window.URL.createObjectURL(blob);
            a.download = filename;
            a.href = url;
            document.body.appendChild(a);
            a.click();
            setTimeout(function(){
                a.remove();
                window.URL.revokeObjectURL(url);
            },200);
        }
            
    }
}

var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    $scope.app = 'tsvgen';
    $scope.sharing_url = "";
    $scope.usingHttp = inhttp;
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.display_name;
    $scope.attackerName = attacker.display_name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.attackerMod = "Normal";
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.display_name;
    $scope.targetModifiers = target.modifiers;

    $scope.iterations = 1;
    $scope.stored = 0;

    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
    $scope.attackerName = attacker.name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.attacker_icon = attacker.icon;
    $scope.target_icon = target.icon;
    $scope.targetModifiers = target.modifiers;
    $scope.targetMod = "Normal";
    $scope.baseDamage = base_damage;
    $scope.angle = angle;
    $scope.in_air = in_air;
    $scope.bkb = bkb;
    $scope.kbg = kbg;
    $scope.stale = stale;
    $scope.kb_modifier = "none";
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;
    $scope.shield = "normal";
    $scope.hit_frame = hitframe;
    $scope.faf = faf;
    $scope.shieldDamage = 0;

    $scope.preDamage = 0;
    $scope.di = di;
    $scope.noDI = true;

    $scope.set_weight = false;

    $scope.lumaPercent = 0;
    $scope.lumaclass = { 'display': 'none' };

    $scope.attacker_mod = { 'display': $scope.attackerModifiers.length > 0 ? 'initial' : 'none' };
    $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };

    $scope.is_smash = false;
    $scope.is_smash_visibility = { 'display': $scope.is_smash ? 'initial' : 'none' };
    $scope.megaman_fsmash = false;
    $scope.witch_time_charge = false;
    $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
    $scope.is_bayonetta = { 'display': attacker.name == "Bayonetta" ? 'initial' : 'none' };
    $scope.is_lucario = { 'display': attacker.name == "Lucario" ? 'initial' : 'none' };
    $scope.smashCharge = 0;
    $scope.wbkb = false;
    $scope.windbox = false;
    $scope.ignoreStale = false;

    $scope.section_main = { 'background': 'rgba(0, 0, 255, 0.3)' };
    $scope.section_attributes = { 'background': 'transparent' };
    $scope.section_visualizer = { 'background': 'transparent' };
    $scope.counterStyle = { "display": "none" };
    $scope.counteredDamage = 0;
    $scope.counterMult = 0;
    $scope.unblockable = false;

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

    $scope.status = "Calculate and store data";
    $scope.charging_frames_type = "Charging frames";

    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
    $scope.luma_percent = 0;

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.attacker_from = 35;
    $scope.attacker_to = 150;
    $scope.attacker_step = 0.5;
    $scope.target_from = 0;
    $scope.target_to = 150;
    $scope.target_step = 1;

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;
    $scope.selected_move = null;

    $scope.launch_rate = launch_rate;

    $scope.checkSmashVisibility = function () {
        $scope.is_smash_visibility = { 'display': $scope.is_smash ? 'initial' : 'none' };
        $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
        $scope.is_bayonetta = { 'display': attacker.name == "Bayonetta" ? 'initial' : 'none' };
    }

    $scope.checkCounterVisibility = function () {
        $scope.counterStyle = { "display": $scope.counterMult != 0 ? "block" : "none" };
    }

    $scope.charging = function(){
        $scope.checkSmashVisibility();
        $scope.megaman_fsmash = false;
        $scope.witch_time_charge = false;
        $scope.smashCharge = 0;
        charge_frames = 0;

        $scope.updateAttackData();
    };

    $scope.check = function () {
        $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
        if (attacker.name != "Mega Man") {
            $scope.megaman_fsmash = false;
        }
        $scope.is_bayonetta = { 'display': attacker.name == "Bayonetta" ? 'initial' : 'none' };
        if(attacker.name != "Bayonetta"){
            $scope.witch_time_charge = false;
        }
    }

    $scope.check_move = function(){
        if($scope.selected_move == null){
            $scope.charge_min = 0;
            $scope.charge_max = 60;
            $scope.charge_special = false;
            $scope.charging_frames_type = "Charging frames";
        }else{
            if($scope.selected_move.chargeable){
                if($scope.selected_move.charge != null){
                    $scope.charge_data = $scope.selected_move.charge;
                    $scope.charge_min = $scope.charge_data.min;
                    $scope.charge_max = $scope.charge_data.max;
                    if ($scope.smashCharge < $scope.charge_data.min) {
                        $scope.smashCharge = $scope.charge_data.min;
                    } else if ($scope.smashCharge > $scope.charge_data.max) {
                        $scope.smashCharge = $scope.charge_data.max;
                    }
                    $scope.charge_special = true;
                    $scope.is_smash = true;
                    $scope.charging_frames_type = attacker.name == "Donkey Kong" ? "Arm swings" : "Charging frames";
                    $scope.updateCharge();
                    
                }else{
                    $scope.charge_data = null;
                    $scope.charge_min = 0;
                    $scope.smashCharge = 0;
                    $scope.charge_max = 60;
                    $scope.charge_special = false;
                    $scope.is_smash = $scope.selected_move.smash_attack;
                    $scope.charging_frames_type = "Charging frames";
                }
            }else{
                $scope.charge_data = null;
                $scope.charge_min = 0;
                //$scope.smashCharge = 0;
                $scope.charge_max = 60;
                $scope.charge_special = false;
                $scope.is_smash = $scope.selected_move.smash_attack;
                $scope.charging_frames_type = "Charging frames";
            }
            $scope.checkSmashVisibility();
        }
        
    }


    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        $scope.attacker_icon = attacker.icon;
        $scope.attackerName = attacker.name;
        $scope.attackerMod = "Normal";
        $scope.attackerModifiers = attacker.modifiers;
        if (attacker.name == "Cloud" || attacker.name == "Bowser Jr") {
            $scope.attackerModifiers = [];
        }
        $scope.attacker_mod = { 'display': $scope.attackerModifiers.length > 0 ? 'initial' : 'none' };
        getMoveset(attacker, $scope);
        $scope.move = "0";
        $scope.preDamage = 0;
        $scope.counterMult = 0;
        $scope.counteredDamage = 0;
        $scope.unblockable = false;
        $scope.selected_move = null;
        $scope.checkCounterVisibility();
        $scope.is_lucario = { 'display': attacker.name == "Lucario" ? 'initial' : 'none' };
        $scope.stock_dif = "0";
        $scope.it_stock_dif = false;
        $scope.update();
    }

    $scope.updateAttackerMod = function () {
        var mod = attacker.getModifier($scope.attackerMod);
        if (mod != null) {
            attacker.modifier = mod;
            attacker.updateIcon();
            $scope.attacker_icon = attacker.icon;
            $scope.update();
        }
    }

    $scope.updateTargetMod = function () {
        var mod = target.getModifier($scope.targetMod);
        if (mod != null) {
            target.modifier = mod;
            target.updateIcon();
            $scope.target_icon = target.icon;
            $scope.update();
        }
    }

    $scope.updateAttack = function () {
        var attack = $scope.moveset[$scope.move];
        if (attack.valid) {
            if (attack.counterMult == 0) {
                $scope.counteredDamage = 0;
            }
            $scope.angle = attack.angle;
            if(attack.angle < 360){
                $scope.di = attack.angle;
            }
            $scope.baseDamage = attack.base_damage;
            $scope.bkb = attack.bkb;
            $scope.kbg = attack.kbg;
            $scope.wbkb = attack.wbkb;
            $scope.is_smash = attack.smash_attack;
            $scope.preDamage = attack.preDamage;
            $scope.counterMult = attack.counterMult;
            $scope.unblockable = attack.unblockable;
            $scope.windbox = attack.windbox;
            $scope.shieldDamage = attack.shieldDamage;
            if (!isNaN(attack.hitboxActive[0].start)) {
                $scope.hit_frame = attack.hitboxActive[0].start;
            } else {
                $scope.hit_frame = 0;
            }
            $scope.faf = attack.faf;
            if (!$scope.is_smash) {
                $scope.smashCharge = 0;
                charge_frames = 0;
            }
            if(attack.name == "Fsmash" && attacker.name == "Mega Man"){
                $scope.megaman_fsmash = true;
            }else{
                $scope.megaman_fsmash = false;
            }
            $scope.checkSmashVisibility();
            $scope.checkCounterVisibility();
            if ($scope.counterMult != 0) {
                $scope.counterDamage();
            }
            $scope.selected_move = attack;
            $scope.check_move();
        } else {
            //console.debug(attack.name + " not valid");
        }
        $scope.update();
    }

    $scope.updateAttackData = function () {
        var attack = $scope.moveset[$scope.move];
        if (attack.valid) {
            if($scope.angle == attack.angle &&
            $scope.baseDamage == attack.base_damage &&
            $scope.bkb == attack.bkb &&
            $scope.kbg == attack.kbg &&
            $scope.wbkb == attack.wbkb &&
            $scope.is_smash == attack.smash_attack &&
            $scope.windbox == attack.windbox &&
            $scope.shieldDamage == attack.shieldDamage){
            } else {
                if (!$scope.detectAttack()) {
                    $scope.move = "0";
                    $scope.moveset[0].name = "Custom move";
                    $scope.preDamage = 0;
                    $scope.unblockable = false;
                    $scope.selected_move = null;
                    if($scope.angle < 360){
                        $scope.di = $scope.angle;
                    }
                }
            }
        } else {
            if (!$scope.detectAttack()) {
                $scope.move = "0";
                $scope.moveset[0].name = "Custom move";
                $scope.preDamage = 0;
                $scope.unblockable=false;
                $scope.selected_move = null;
                if($scope.angle < 360){
                    $scope.di = $scope.angle;
                }
            }
        }
        $scope.update();
    }

    $scope.counterDamage = function () {
        var attack = $scope.moveset[$scope.move];
        var damage = +(parseFloat($scope.counteredDamage) * attack.counterMult).toFixed(2);
        if (damage > 50) {
            damage = 50;
        }
        if (attack.base_damage < damage) {
            $scope.baseDamage = damage;
        } else {
            $scope.baseDamage = attack.base_damage;
        }
        $scope.update();
    }

    $scope.detectAttack = function () {
        var detected = false;
        for (var i = 1; i < $scope.moveset.length; i++) {
            attack = $scope.moveset[i];
            if (attack.character != $scope.attackerValue) {
                //Using another character moveset
                return false;
            }
            if (attack.valid) {
                if ($scope.angle == attack.angle &&
                    $scope.baseDamage == attack.base_damage &&
                    $scope.bkb == attack.bkb &&
                    $scope.kbg == attack.kbg &&
                    $scope.wbkb == attack.wbkb &&
                    $scope.is_smash == attack.smash_attack &&
                    $scope.windbox == attack.windbox &&
                    $scope.shieldDamage == attack.shieldDamage) {
                        $scope.move = i.toString();
                        $scope.preDamage = attack.preDamage;
                        $scope.counterMult = attack.counterMult;
                        $scope.unblockable = attack.unblockable;
                        $scope.selected_move = attack;
                            $scope.check_move();
                        detected = true;
                        return true;
                } else {

                }
            }
        }
        if (!detected) {
            //Chargeable attacks
            for (var i = 1; i < $scope.moveset.length; i++) {
                attack = $scope.moveset[i];
                if (attack.valid) {
                    if ($scope.angle == attack.angle &&
                        parseFloat($scope.baseDamage) >= parseFloat(attack.base_damage) &&
                        $scope.bkb == attack.bkb &&
                        $scope.kbg == attack.kbg &&
                        $scope.wbkb == attack.wbkb &&
                        $scope.is_smash == attack.smash_attack &&
                        $scope.windbox == attack.windbox &&
                        $scope.shieldDamage == attack.shieldDamage &&
                        (attack.chargeable || attack.counterMult != 0)) {
                            $scope.preDamage = attack.preDamage;
                            $scope.counterMult = attack.counterMult;
                            $scope.unblockable = attack.unblockable;
                            $scope.selected_move = attack;
                            $scope.check_move();
                            $scope.move = i.toString();
                            return true;
                    } else {

                    }
                }
            }
        }
        return false;
    }

    $scope.updateTarget = function () {
        target = new Character($scope.targetValue);
        $scope.targetMod = "Normal";
        $scope.targetModifiers = target.modifiers;
        if (target.name == "Bowser Jr") {
            $scope.targetMod = "Clown Kart";
        }
        $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };
        $scope.target_icon = target.icon;
        $scope.lumaclass = { "display": target.name == "Rosalina And Luma" ? "block" : "none" };
        $scope.lumaPercent = 0;
        $scope.update();
    }

    $scope.updateCharge = function(){
        if($scope.charge_data != null){
            $scope.baseDamage = $scope.selected_move.charge_damage(parseFloat($scope.smashCharge));
        }
        $scope.update();
    }

    $scope.update = function () {
        $scope.check();
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
        attacker_percent = parseFloat($scope.attackerPercent);
        target_percent = parseFloat($scope.targetPercent);
        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
        stale = parseFloat($scope.stale);
        hitlag = parseFloat($scope.hitlag);

        hitframe = parseFloat($scope.hit_frame);
        faf = parseFloat($scope.faf);
        charge_frames = parseFloat($scope.smashCharge);
        r = KBModifier($scope.kb_modifier);
        bounce = $scope.kb_modifier_bounce;
        ignoreStale = $scope.ignoreStale;
        powershield = $scope.shield == "power";
        is_projectile = $scope.is_projectile == true;

        megaman_fsmash = $scope.megaman_fsmash;
        witch_time_smash_charge = $scope.witch_time_charge;
        electric = $scope.hitlag_modifier;
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = $scope.wbkb;
        windbox = $scope.windbox;

        stock_dif = $scope.stock_dif;
        game_format = $scope.format;

        launch_rate = parseFloat($scope.launch_rate);

        if($scope.noDI){
            di = -1;
        }else{
            di = parseFloat($scope.di);
        }

        luma_percent = parseFloat($scope.lumaPercent);

        unblockable = $scope.unblockable;

        shieldDamage = parseFloat($scope.shieldDamage);

        set_weight = $scope.set_weight;
        
        //$scope.changeCharacters($scope.inc_mod, $scope.inc_cust);

        var at_from = parseFloat($scope.attacker_from);
        var at_to = parseFloat($scope.attacker_to);
        var at_step = parseFloat($scope.attacker_step);


        var from = parseFloat($scope.target_from);
        var to = parseFloat($scope.target_to);
        var step = parseFloat($scope.target_step);

        var m;
        if($scope.move == 0){
            m = new Move(0, "Custom", "Custom", base_damage, angle, bkb, kbg, wbkb, [], 0, -1, [], 0, 0, 0, 0);
            m.is_smash = is_smash;
        }else{ 
            m = $scope.moveset[$scope.move];
        }

        var smashcount = 0;
        $scope.moveset.forEach(function(v,i){
            if(v.smash_attack){
                smashcount++;
            }
        });


        smashcount = $scope.it_moves ? ($scope.it_charge ? smashcount : 0) : $scope.it_charge && is_smash ? 1 : 0;
        var imod = $scope.inc_mod && $scope.it_targets ? 23 : ($scope.inc_mod ? (target.modifiers.length > 0 ? target.modifiers.length - 1 : 0) : 0);
        var istale = $scope.it_stale ? 10 : 1;
        var ikbmod = $scope.it_kb_mod ? 3 : 1;
        var imoves = $scope.it_moves ? ($scope.moveset.length > 1 ? $scope.moveset.length - 1 : 1) : 1;
        var itargets = $scope.it_targets ? names.length : 1;
        var ipercent = $scope.it_percent ? Math.floor(((to - from)/step)) + 1 : 1;
        var irage = $scope.it_rage ? Math.floor((at_to - at_from)/at_step) + 1 : 1;
        var istocks = $scope.it_stock_dif ? 5 : 1;
        var idi = $scope.it_di ? 361 : 1;
        var calculations = (istale * ikbmod * (imoves - smashcount) * (itargets + imod) * ipercent * irage * istocks * idi) + (smashcount * 61 * istale * ikbmod * (itargets + imod) * ipercent * irage * istocks * idi);

        $scope.calculations = calculations;

        if($scope.calculations > 200000){
            $scope.status = "Cannot make calculations";
        }else{
            $scope.status = "Calculate and store data";
        }

        $scope.sharing_url = buildURL($scope);

    };

    var bd = base_damage;
    var moves = $scope.moveset.slice();
    var damage = base_damage;
    var kb;
    var distance;
    var move;

    $scope.generate = function(){

        $scope.update();
        
        var at_from = parseFloat($scope.attacker_from);
        var at_to = parseFloat($scope.attacker_to);
        var at_step = parseFloat($scope.attacker_step);


        var from = parseFloat($scope.target_from);
        var to = parseFloat($scope.target_to);
        var step = parseFloat($scope.target_step);

        if(at_step <= 0){
            atr_step = 0.1;
        }

        if(step <= 0){
            step = 0.1;
        }

        var selectedChar = target;
        var selectedMod = $scope.targetMod;
        moves = $scope.moveset.slice();
        bd = base_damage;
        damage = base_damage;

        if($scope.calculations > 100000){
            window.alert("Amount of calculations to be used exceed maximum");
            return;
        }

        if($scope.status != "Calculate and store data"){
            return;
        }
        
        if($scope.move == 0){
            move = new Move(0, "Custom", "Custom", base_damage, angle, bkb, kbg, wbkb, [], 0, -1, [], 0, 0, 0, 0);
            move.is_smash = is_smash;
        }else{ 
            move = $scope.moveset[$scope.move];
            if(move.charge == null){
                move.base_damage = base_damage;
            }
        }

        $scope.status = "Processing...";
        

        var calcDamage = function(){
            if(move.charge == null){
                bd = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge);
            }else{
                bd = move.charge_damage(charge_frames);
            }
            if (attacker.name == "Lucario") {
                bd *= Aura(attacker_percent, stock_dif, game_format);
                preDamage *= Aura(attacker_percent, stock_dif, game_format);
            }
            damage = bd;
            damage *= attacker.modifier.damage_dealt;
            damage *= target.modifier.damage_taken;
            preDamage *= attacker.modifier.damage_dealt;
            preDamage *= target.modifier.damage_taken;
        }

        var addRow = function () {
            calcDamage();
            if(!wbkb){
                kb = VSKB(target_percent + preDamage, bd, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, di, launch_rate);
            }else{
                kb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, di, launch_rate);
            }
            kb.addModifier(attacker.modifier.kb_dealt);
            kb.addModifier(target.modifier.kb_received);
            kb.bounce(bounce);
            distance = new Distance(kb.kb, kb.horizontal_launch_speed, kb.vertical_launch_speed, kb.hitstun, kb.base_angle, kb.di_change, target.attributes.gravity * target.modifier.gravity, 0, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction);
            tsv_rows.push(new Row(attacker,target,attacker_percent,target_percent,move,bd,charge_frames,StaleDamage(damage, stale, ignoreStale),ignoreStale ? -1 : stale, Aura(attacker_percent, stock_dif), stock_dif, r,kb,distance));
        }

        var funlist = [];
        var index = 0;

        funlist.push(function(f){
            addRow();
        });

        if ($scope.it_di) {
            funlist.push(function (f) {
                for (var i = -1; i < 360; i++) {
                    di = i;
                    funlist[f - 1](f - 1);
                }
            });
        }

        if($scope.it_kb_mod){
            funlist.push(function(f){
                r=1;
                funlist[f-1](f-1);
                r=0.85;
                funlist[f-1](f-1);
                r=1.2;
                funlist[f-1](f-1);
            });
        }
    
        if($scope.it_rage){
            funlist.push(function(f){
                for(attacker_percent=at_from;attacker_percent<=at_to;attacker_percent+=at_step){
                    funlist[f-1](f-1);
                }
            });
        }

        if($scope.it_stock_dif){
            funlist.push(function(f){
                for(var i=0; i<$scope.stock_values.length;i++){
                    stock_dif = $scope.stock_values[i];
                    funlist[f-1](f-1);
                }
            });
        }

        if($scope.it_percent){
            funlist.push(function(f){
                for(target_percent=from;target_percent<=to;target_percent+=step){
                    funlist[f-1](f-1);
                }
            });
        }

        if($scope.it_stale){
            funlist.push(function(f){
                ignoreStale = true;
                funlist[f-1](f-1);
                ignoreStale = false;
                for(var i=0;i<=9;i++){
                    stale = i;
                    funlist[f-1](f-1);
                }
            });
        }

        if($scope.it_charge){
            funlist.push(function(f){
                if(move.charge != null){
                    for(var i=move.charge.min;i<=move.charge.max;i++){
                        charge_frames = i;
                        funlist[f-1](f-1);
                    }
                }else{
                    if(is_smash){
                        for(var i=0;i<=60;i++){
                            charge_frames = i;
                            funlist[f-1](f-1);
                        }
                    }else{
                        funlist[f-1](f-1);
                    }
                }
            });
        }

        if($scope.it_moves){
            funlist.push(function(f){
                for(var i=1;i<moves.length;i++){
                    move = moves[i];
                    base_damage = move.base_damage;
                    bkb = move.bkb;
                    kbg = move.kbg;
                    wbkb = move.wbkb;
                    angle = move.angle;
                    is_smash = move.smash_attack;
                    preDamage = move.preDamage;
                    counterMult = move.counterMult;
                    unblockable = move.unblockable;
                    windbox = move.windbox;
                    shieldDamage = move.shieldDamage;
                    charge_frames = 0;
                    if(attacker.name == "Mega Man" && move.name == "Fsmash"){
                        megaman_fsmash = true;
                    }else{
                        megaman_fsmash = false;
                    }
                    funlist[f-1](f-1);
                }
            });
        }

        if ($scope.inc_mod) {
            funlist.push(function (f) {
                if (target.modifiers.length > 0) {
                    for (var i = 0; i < target.modifiers.length; i++) {
                        target.modifier = target.modifiers[i];
                        funlist[f - 1](f - 1);
                    }
                } else {
                    funlist[f - 1](f - 1);
                }
            });
        }

        if($scope.it_targets){
            funlist.push(function(f){
                for(var i=0;i<names.length;i++){
                    target = new Character(names[i]);
                    funlist[f-1](f-1);
                }
            });
        }

        next = funlist.length-1;
        if(next!=-1){
            funlist[next](next);
        }

        target = selectedChar;
        
        target.modifier = target.getModifier(selectedMod);
        $scope.targetModifiers = target.modifiers;
        $scope.targetMod = selectedMod;
        $scope.status = "Calculate and store data";
        $scope.stored = tsv_rows.length;
    };

    $scope.clear = function(){
        if($scope.status != "Calculate and store data"){
            return;
        }
        tsv_rows = [];
        $scope.stored = tsv_rows.length;
    }

    $scope.download = function(){
        if($scope.status != "Calculate and store data"){
            return;
        }
        if(tsv_rows.length > 0){
            var tsv = "";
            $scope.status = "Saving...";
            for(var i=0;i<headers.length;i++){
                tsv += headers[i];
                if(i!=headers.length-1){
                    tsv+="\t";
                }
            }
            tsv+="\n";
            for(var i=0;i<tsv_rows.length;i++){
                var row = tsv_rows[i].tsv();
                for(var j=0;j<row.length;j++){
                    tsv += row[j];
                    if(j!=row.length-1){
                        tsv+="\t";
                    }
                }
                tsv+="\n";
            }
            
            showSaveDialog(tsv);
            $scope.status = "Calculate and store data";
        }
    }

    $scope.tsv_options = function(){
        if($scope.it_rage){
            $scope.rage_step = 0.5;
        }
        if($scope.it_percent){
            $scope.target_from = 0;
            $scope.target_to = 150;
            $scope.target_step = 1;
        }
        $scope.itRage_style = {'display' : $scope.it_rage ? 'block' : 'none'};
        $scope.itTarget_style = {'display' : $scope.it_percent ? 'block' : 'none'};
        $scope.update();
    }

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

    $scope.theme = "Normal";
    $scope.themes = styleList;

    $scope.changeTheme = function () {
        changeStyle($scope.theme);
    }

    mapParams($scope);

    $scope.tsv_options();
});