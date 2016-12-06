var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    $scope.app = 'kbcalculator';
    $scope.sharing_url = "";
    $scope.usingHttp = inhttp;
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.name;
    $scope.attacker_icon = attacker.icon;
    $scope.target_icon = target.icon;
    $scope.attackerName = attacker.name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.name;
    $scope.targetModifiers = target.modifiers;
    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
    $scope.baseDamage = base_damage;
    $scope.angle = angle;
    $scope.in_air = in_air;
    $scope.bkb = bkb;
    $scope.kbg = kbg;
    $scope.stale = stale;
    $scope.kb_modifier = "none";
    $scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.kb = 0;
    $scope.kbType = "total";

    $scope.preDamage = 0;
    $scope.di = di;
    $scope.noDI = true;

    $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
    $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
    $scope.target_weight = target.attributes.weight;
    $scope.target_gravity = target.attributes.gravity;
    $scope.target_damage_taken = target.modifier.damage_taken;
    $scope.target_kb_received = target.modifier.kb_received;

    $scope.attacker_mod = { 'display': $scope.attackerModifiers.length > 0 ? 'initial' : 'none' };
    $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };

    $scope.is_smash = false;
    $scope.is_smash_visibility = { 'display': $scope.is_smash ? 'initial' : 'none' };
    $scope.megaman_fsmash = false;
    $scope.witch_time_charge = false;
    $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
    $scope.is_bayonetta = { 'display': attacker.name == "Bayonetta" ? 'initial' : 'none' };
    $scope.smashCharge = 0;
    $scope.wbkb = false;
    $scope.windbox = false;

    $scope.ignoreStale = false;

    $scope.section_main = { 'background': 'rgba(0, 0, 255, 0.3)' };
    $scope.section_attributes = { 'background': 'transparent' };
    $scope.counterStyle = { "display": "none" };
    $scope.counteredDamage = 0;
    $scope.counterMult = 0;
    $scope.unblockable = false;

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;
    $scope.selected_move = null;

    $scope.st_jab_lock = { "display": "none" };

    $scope.vectoring = "none";

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.is_lucario = { 'display': attacker.name == "Lucario" ? 'initial' : 'none' };
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
    $scope.luma_percent = 0;

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.charging_frames_type = "Charging frames";

    

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
        var a = parseFloat($scope.angle);
        $scope.st_jab_lock = { "display": a == 361 || (a >= 230 && a <= 310) ? 'initial' : 'none' };
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

    $scope.updateAttr = function () {
        attacker.modifier.damage_dealt = parseFloat($scope.attacker_damage_dealt);
        attacker.modifier.kb_dealt = parseFloat($scope.attacker_kb_dealt);
        target.attributes.weight = parseFloat($scope.target_weight);
        target.attributes.gravity = parseFloat($scope.target_gravity);
        target.modifier.damage_taken = parseFloat($scope.target_damage_taken);
        target.modifier.kb_received = parseFloat($scope.target_kb_received);

        $scope.update();
    }

    $scope.show = function (section) {
        $scope.main_style = { 'display': section == "main" ? 'block' : 'none' };
        $scope.attributes_style = { 'display': section == "attributes" ? 'block' : 'none' };
        $scope.section_main = { 'background': section == "main" ? 'rgba(0, 0, 255, 0.3)': 'transparent' };
        $scope.section_attributes = { 'background': section == "attributes" ? 'rgba(0, 0, 255, 0.3)' : 'transparent' };
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
        $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
        $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
        $scope.counterMult = 0;
        $scope.counteredDamage = 0;
        $scope.unblockable = false;
        $scope.selected_move = null;
        $scope.checkCounterVisibility();
        $scope.is_lucario = { 'display': attacker.name == "Lucario" ? 'initial' : 'none' };
        $scope.stock_dif = "0";
        $scope.update();
    }

    $scope.updateAttackerMod = function () {
        var mod = attacker.getModifier($scope.attackerMod);
        if (mod != null) {
            attacker.modifier = mod;
            attacker.updateIcon();
            $scope.attacker_icon = attacker.icon;
            $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
            $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
            $scope.update();
        }
    }

    $scope.updateTargetMod = function () {
        var mod = target.getModifier($scope.targetMod);
        if (mod != null) {
            target.modifier = mod;
            target.updateIcon();
            $scope.target_icon = target.icon;
            $scope.target_weight = target.attributes.weight;
            $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
            $scope.target_damage_taken = target.modifier.damage_taken;
            $scope.target_kb_received = target.modifier.kb_received;
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
            $scope.windbox == attack.windbox){
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
                    $scope.windbox == attack.windbox) {
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
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
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
        attacker_percent = parseFloat($scope.attackerPercent);
        
        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
        stale = parseFloat($scope.stale);

        charge_frames = parseFloat($scope.smashCharge);
        r = KBModifier($scope.kb_modifier);
        bounce = $scope.kb_modifier_bounce;
        ignoreStale = $scope.ignoreStale;

        megaman_fsmash = $scope.megaman_fsmash;
        witch_time_smash_charge = $scope.witch_time_charge;
        electric = $scope.hitlag_modifier;
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = $scope.wbkb;
        windbox = $scope.windbox;

        stock_dif = $scope.stock_dif;
        game_format = $scope.format;

        switch($scope.vectoring){
            case "none":
                vectoring = 0;
            break;
            case "increase":
                vectoring = 1;
            break;
            case "decrease":
                vectoring = -1;
            break;
        }

        if($scope.charge_data == null && $scope.is_smash){
            base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash, witch_time_smash_charge);
        }
        if (attacker.name == "Lucario") {
            base_damage *= Aura(attacker_percent, stock_dif, game_format);
            preDamage *= Aura(attacker_percent, stock_dif, game_format);
        }
        var damage = base_damage;
        
        damage *= attacker.modifier.damage_dealt;
        damage *= target.modifier.damage_taken;
        preDamage *= attacker.modifier.damage_dealt;
        preDamage *= target.modifier.damage_taken;

        var kb = parseFloat($scope.kb);
        var type = $scope.kbType;

        var kb = new PercentFromKnockback(kb, type, base_damage, damage, angle, target.attributes.weight, target.attributes.gravity, target.attributes.fall_speed, in_air, bkb, kbg, wbkb, attacker_percent, r, stale, ignoreStale, windbox, vectoring);
        if (!kb.wbkb) {
            kb.addModifier(attacker.modifier.kb_dealt);
        }
        kb.addModifier(target.modifier.kb_received);
        kb.bounce(bounce);
        var results = {'training':[], 'vs':[]};
        if(kb.wbkb){
            results.training = [];
            if (kb.rage_needed != -1) {
                results.vs.push(new ListItem("Rage multiplier", kb.rage_needed));
                results.vs.push(new ListItem("Attacker percent", kb.vs_percent));
            } else {
                if (kb.vs_percent == -1) {
                    results.vs.push(new ListItem("Cannot reach KB higher than", (kb.wbkb_kb * 1.15).toFixed(4)));
                } else {
                    results.vs.push(new ListItem("WBKB KB is higher than ",+kb.wbkb_kb.toFixed(4)));
                }
            }
        }else{
            var t = kb.training_percent != -1 ? new ListItem("Required Percent", +kb.training_percent.toFixed(4)) : new ListItem("Impossible", "");
            var v = kb.vs_percent != -1 ? new ListItem("Required Percent", +kb.vs_percent.toFixed(4)) : new ListItem("Impossible", "");

            results.training.push(t);
            results.vs.push(v);

            if(kb.type != "total"){
                if(kb.training_percent != -1){
                    if(kb.worst_di.training!=-1){
                        results.training.push(new ListItem("Worst DI angle", +kb.worst_di.angle_training.toFixed(4)));
                        results.training.push(new ListItem("Worst DI percent", +kb.worst_di.training.toFixed(4)));
                        results.training.push(new ListItem("Worst DI hitstun difference", +kb.worst_di.hitstun_dif.toFixed(4) + " frames"));
                    }
                    if(kb.best_di.training!=-1){
                        results.training.push(new ListItem("Best DI angle", +kb.best_di.angle_training.toFixed(4)));
                        results.training.push(new ListItem("Best DI percent", +kb.best_di.training.toFixed(4)));
                        results.training.push(new ListItem("Best DI hitstun difference", +kb.best_di.hitstun_dif.toFixed(4) + " frames"));
                    }
                }
                if(kb.vs_percent != -1){
                    if(kb.worst_di.vs!=-1){
                        results.vs.push(new ListItem("Worst DI angle", +kb.worst_di.angle_vs.toFixed(4)));
                        results.vs.push(new ListItem("Worst DI percent", +kb.worst_di.vs.toFixed(4)));
                        results.vs.push(new ListItem("Worst DI hitstun difference", +kb.worst_di.hitstun_dif.toFixed(4) + " frames"));
                    }
                    if(kb.best_di.vs != -1){
                        results.vs.push(new ListItem("Best DI angle", +kb.best_di.angle_vs.toFixed(4)));
                        results.vs.push(new ListItem("Best DI percent", +kb.best_di.vs.toFixed(4)));
                        results.vs.push(new ListItem("Best DI hitstun difference", +kb.best_di.hitstun_dif.toFixed(4) + " frames"));
                    }
                }
            }
        }
        


        $scope.training = results.training;
        $scope.vs = results.vs;

        $scope.sharing_url = buildURL($scope);
    };

    $scope.get_jablock = function(){
        var a = parseFloat($scope.angle);
        if(a==361){
            $scope.kb = 59.9999;
        }else{
            $scope.kb = 80;
        }
        $scope.update();
    };

    $scope.get_tumble = function(){
        $scope.kb = 80.0001;
        $scope.update();
    };

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

    mapParams($scope);

    $scope.update();
});