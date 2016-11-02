var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    $scope.app = 'calculator';
    $scope.sharing_url = "";
    $scope.usingHttp = inhttp;
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.name;
    $scope.attackerName = attacker.name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.name;
    $scope.targetModifiers = target.modifiers;
    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
    $scope.attacker_icon = attacker.icon;
    $scope.target_icon = target.icon;
    $scope.baseDamage = base_damage;
    $scope.angle = angle;
    $scope.in_air = in_air;
    $scope.bkb = bkb;
    $scope.kbg = kbg;
    $scope.stale = stale;
    $scope.kb_modifier = "none";
    $scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.shield = ShieldList([0, 0, 0]);
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;
    $scope.shield = "normal";
    $scope.hit_frame = hitframe;
    $scope.faf = faf;
    $scope.shieldDamage = 0;
    $scope.charging_frames_type = "Charging frames";

    $scope.hitbox_active_index = 0;

    $scope.preDamage = 0;
    $scope.di = di;
    $scope.noDI = true;

    $scope.lumaPercent = 0;
    $scope.lumaclass = { 'display': 'none' };

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;
    $scope.luma_percent = 0;

    $scope.attacker_mod = { 'display': $scope.attackerModifiers.length > 0 ? 'initial' : 'none' };
    $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };

    $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
    $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
    $scope.target_weight = target.attributes.weight;
    $scope.target_gravity = target.attributes.gravity;
    $scope.target_damage_taken = target.modifier.damage_taken;
    $scope.target_kb_received = target.modifier.kb_received;
    $scope.target_traction = target.attributes.traction;
    $scope.target_fall_speed = target.attributes.fall_speed;

    $scope.is_smash = false;
    $scope.is_smash_visibility = { 'display': $scope.is_smash ? 'initial' : 'none' };
    $scope.megaman_fsmash = false;
    $scope.witch_time_charge = false;
    $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
    $scope.is_bayonetta = { 'display': attacker.name == "Bayonetta" ? 'initial' : 'none' };
    $scope.is_lucario = { 'display': attacker.name == "Lucario" ? 'initial' : 'none' };
    $scope.is_aerial = { 'display': 'none' };
    $scope.prev_hf = { 'display': 'none' };
    $scope.next_hf = { 'display': 'none' };
    $scope.selected_move = null;
    $scope.smashCharge = 0;
    $scope.wbkb = false;
    $scope.windbox = false;
    $scope.ignoreStale = false;

    $scope.use_landing_lag = "no";

    $scope.section_main = { 'background': 'rgba(0, 0, 255, 0.3)' };
    $scope.section_attributes = { 'background': 'transparent' };
    $scope.section_visualizer = { 'background': 'transparent' };
    $scope.counterStyle = { "display": "none" };
    $scope.counteredDamage = 0;
    $scope.counterMult = 0;
    $scope.unblockable = false;

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.game_mode = game_mode;
    $scope.show_graph = false;

    $scope.inverseX = false;
    $scope.surface = false;
    $scope.position_x = 0;
    $scope.position_y = 0;

    $scope.stages = getStages();
    $scope.stages.unshift({"stage":"No stage"});
    $scope.stage = null;
    $scope.stageValue = {"stage":"No stage"};

    $scope.vectoring = "none";
    $scope.spawns = [];

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

    $scope.stageName = "";

    $scope.getStage = function () {
        for (var i = 0; i < $scope.stages.length; i++) {
            if ($scope.stages[i].stage == $scope.stageName) {
                $scope.stageValue = JSON.stringify($scope.stages[i]);
                $scope.updateStage();
                return;
            }
        }
    }

    $scope.updateStage = function(){
        $scope.stage = JSON.parse($scope.stageValue);
        $scope.stageName = $scope.stage.stage;
        if($scope.stage.stage == "No stage"){
            $scope.stage = null;
            $scope.spawns = [];
            $scope.spawn = "";
            $scope.update();
            return;
        }
        $scope.position_x = $scope.stage.center[0];
        $scope.position_y = $scope.stage.center[1];
        $scope.spawns = ["Center"];
        for(var i=0;i<$scope.stage.spawns.length;i++){
            $scope.spawns.push(i+1);
        }
        $scope.spawn = "Center";
        $scope.update();
    }

    $scope.setPositionSpawn = function(){
        if($scope.spawn != "Center"){
            var i = parseFloat($scope.spawn) - 1;
            $scope.position_x = $scope.stage.spawns[i][0];
            $scope.position_y = $scope.stage.spawns[i][1];
            $scope.update();
        }else{
            $scope.position_x = $scope.stage.center[0];
            $scope.position_y = $scope.stage.center[1];
            $scope.update();
        }
    }

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

    $scope.check_move = function(){
        if($scope.selected_move == null){
            $scope.is_aerial = { 'display': 'none' };
            $scope.prev_hf = { 'display': 'none' };
            $scope.next_hf = { 'display': 'none' };
            $scope.use_landing_lag = "no";
            $scope.charge_min = 0;
            $scope.charge_max = 60;
            $scope.charge_special = false;
            $scope.charging_frames_type = "Charging frames";
        }else{
            $scope.hitbox_active_index = 0;
            $scope.is_aerial = { 'display': $scope.selected_move.aerial ? 'initial' : 'none' };
            $scope.prev_hf = { 'display': 'none' };
            $scope.next_hf = { 'display': $scope.selected_move.hitboxActive.length > 1 ? 'inline' : 'none' };
            $scope.use_landing_lag = "no";
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

    $scope.prev_hit_frame = function(){
        $scope.hitbox_active_index--;
        if (!isNaN($scope.selected_move.hitboxActive[$scope.hitbox_active_index].start)) {
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start;
        } else {
            $scope.hit_frame = 0;
        }
        $scope.prev_hf = { 'display': $scope.hitbox_active_index != 0 ? 'inline' : 'none' };
        $scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length-1 ? 'inline' : 'none' };
        $scope.update();
    }

    $scope.next_hit_frame = function(){
        $scope.hitbox_active_index++;
        if (!isNaN($scope.selected_move.hitboxActive[$scope.hitbox_active_index].start)) {
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start;
        } else {
            $scope.hit_frame = 0;
        }
        $scope.prev_hf = { 'display': $scope.hitbox_active_index != 0 ? 'inline' : 'none' };
        $scope.next_hf = { 'display': $scope.hitbox_active_index < $scope.selected_move.hitboxActive.length-1 ? 'inline' : 'none' };
        $scope.update();
    }

    $scope.update_faf = function(){
        landing_lag = 0;
        switch($scope.use_landing_lag){
            case "no":
                $scope.faf = $scope.selected_move.faf;
            break;
            case "yes":
                $scope.faf = $scope.hit_frame + 1;
                landing_lag = $scope.selected_move.landingLag;
            break;
            case "autocancel":
                var i = $scope.hit_frame;
                var h = $scope.hit_frame+50;
                var f = false;
                for(i = $scope.hit_frame;i<h;i++){
                    for(var x=0;x<$scope.selected_move.autoCancel.length;x++){
                        if($scope.selected_move.autoCancel[x].eval(i)){
                            f = true;
                            break;
                        }
                    }
                    if(f){
                        break;
                    }
                }
                if(f){
                    $scope.faf = i;
                }else{
                    $scope.faf = NaN;
                }
            break;
        }
        $scope.update();
    }

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

    $scope.updateAttr = function () {
        attacker.modifier.damage_dealt = parseFloat($scope.attacker_damage_dealt);
        attacker.modifier.kb_dealt = parseFloat($scope.attacker_kb_dealt);
        target.attributes.weight = parseFloat($scope.target_weight);
        target.attributes.gravity = parseFloat($scope.target_gravity);
        target.modifier.damage_taken = parseFloat($scope.target_damage_taken);
        target.modifier.kb_received = parseFloat($scope.target_kb_received);
        target.attributes.traction = parseFloat($scope.target_traction);
        target.attributes.fall_speed = parseFloat($scope.target_fall_speed);

        $scope.update();
    }

    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        $scope.attackerName = attacker.name;
        $scope.attackerMod = "Normal";
        $scope.attackerModifiers = attacker.modifiers;
        if (attacker.name == "Cloud") {
            $scope.attackerModifiers = [];
        }
        $scope.attacker_icon = attacker.icon;
        $scope.attacker_mod = { 'display': $scope.attackerModifiers.length > 0 ? 'initial' : 'none' };
        getMoveset(attacker, $scope);
        $scope.move = "0";
        $scope.preDamage = 0;
        $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
        $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
        $scope.counterMult = 0;
        $scope.counteredDamage = 0;
        $scope.unblockable = false;
        $scope.hitbox_active_index = 0;
        $scope.check_move(null);
        $scope.checkCounterVisibility();
        $scope.selected_move = null;
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
            $scope.target_fall_speed = target.attributes.fall_speed * target.modifier.fall_speed;
            $scope.target_traction = target.attributes.traction * target.modifier.traction;
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
        
        $scope.check();
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
                        $scope.is_smash == (attack.smash_attack || attack.chargeable) &&
                        $scope.windbox == attack.windbox &&
                        $scope.shieldDamage == attack.shieldDamage &&
                        (attack.chargeable || attack.counterMult != 0)) {
                            $scope.preDamage = attack.preDamage;
                            $scope.counterMult = attack.counterMult;
                            $scope.unblockable = attack.unblockable;
                            $scope.move = i.toString();
                            $scope.selected_move = attack;
                            $scope.check_move();
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
        $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };
        $scope.target_icon = target.icon;
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
        $scope.target_fall_speed = target.attributes.fall_speed * target.modifier.fall_speed;
        $scope.target_traction = target.attributes.traction * target.modifier.traction;
        $scope.lumaclass = { "display": target.name == "Rosalina And Luma" ? "block" : "none", "margin-left": "292px" };
        $scope.lumaPercent = 0;
        $scope.update();
    }

    $scope.calculate = function (){
        var result = { 'training': [], 'vs': [], 'shield': [] };

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

        if (!wbkb) {
            trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, angle, in_air, windbox, di, vectoring);
            vskb = VSKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di, vectoring);
            trainingkb.addModifier(attacker.modifier.kb_dealt);
            vskb.addModifier(attacker.modifier.kb_dealt);
            trainingkb.addModifier(target.modifier.kb_received);
            vskb.addModifier(target.modifier.kb_received);
        } else {
            trainingkb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, di, vectoring);
            vskb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di, vectoring);
            trainingkb.addModifier(target.modifier.kb_received);
            vskb.addModifier(target.modifier.kb_received);
        }

        var distance;
        if(game_mode == "training"){
            distance = new Distance(trainingkb.kb, trainingkb.horizontal_launch_speed, trainingkb.vertical_launch_speed, trainingkb.hitstun, trainingkb.base_angle, trainingkb.di_change, target.attributes.gravity, target.attributes.gravity2, target.attributes.air_friction, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
        }else{
            distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, vskb.base_angle, vskb.di_change, target.attributes.gravity, target.attributes.gravity2, target.attributes.air_friction, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
        }

        if(stage != null){
            if(distance.bounce_speed >= 1){
                //$scope.kb_modifier_bounce = distance.bounce;
                //bounce = distance.bounce;
            }
        }

        
        var trainingDistance;
        var vsDistance;
        if (game_mode == "training") {
            vsDistance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, vskb.base_angle, vskb.di_change, target.attributes.gravity, target.attributes.gravity2, target.attributes.air_friction, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
            trainingDistance = distance;
        } else {
            vsDistance = distance;
            trainingDistance = new Distance(trainingkb.kb, trainingkb.horizontal_launch_speed, trainingkb.vertical_launch_speed, trainingkb.hitstun, trainingkb.base_angle, trainingkb.di_change, target.attributes.gravity, target.attributes.gravity2, target.attributes.air_friction, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
        }
        trainingkb.bounce(bounce);
        vskb.bounce(bounce);
        var traininglist = List([damage, Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), trainingkb.kb, trainingkb.base_angle, trainingkb.x, trainingkb.y, Hitstun(trainingkb.base_kb, windbox), FirstActionableFrame(trainingkb.base_kb, windbox), AirdodgeCancel(trainingkb.base_kb, windbox), AerialCancel(trainingkb.base_kb, windbox), trainingkb.vectoring, trainingkb.horizontal_launch_speed, +trainingkb.add_gravity_speed.toFixed(4), trainingkb.vertical_launch_speed, trainingDistance.max_x, trainingDistance.max_y]);
        var vslist = List([StaleDamage(damage, stale, ignoreStale), Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), vskb.kb, vskb.base_angle, vskb.x, vskb.y, Hitstun(vskb.base_kb, windbox), FirstActionableFrame(vskb.base_kb, windbox), AirdodgeCancel(vskb.base_kb, windbox), AerialCancel(vskb.base_kb, windbox), vskb.vectoring, vskb.horizontal_launch_speed, +vskb.add_gravity_speed.toFixed(4), vskb.vertical_launch_speed, vsDistance.max_x, vsDistance.max_y]);
        if (trainingkb.di_able) {
            traininglist.splice(5, 0, new ListItem("DI angle", + +trainingkb.angle.toFixed(4)));
        }
        if (vskb.di_able) {
            vslist.splice(5, 0, new ListItem("DI angle", + +vskb.angle.toFixed(4)));
        }
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
            traininglist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent, stock_dif, game_format).toFixed(4)));
            vslist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent, stock_dif, game_format).toFixed(4)));
        }
        if (is_smash && $scope.charge_data == null) {
            traininglist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash, witch_time_smash_charge).toFixed(4)));
            vslist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash, witch_time_smash_charge).toFixed(4)));
        }
        if (target.modifier.damage_taken != 1) {
            traininglist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
            vslist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
        }
        if (attacker.modifier.damage_dealt != 1) {
            traininglist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
            vslist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
        }
        if (preDamage != 0) {
            traininglist.splice(0, 0, new ListItem("Before launch damage", "+" + +preDamage.toFixed(4) + "%"));
            vslist.splice(0, 0, new ListItem("Before launch damage", "+" + +(preDamage * StaleNegation(stale, ignoreStale)).toFixed(4) + "%"));
        }
        if (!ignoreStale) {
            vslist.splice(0, 0, new ListItem("Stale-move negation", "x" + +StaleNegation(stale, ignoreStale).toFixed(4)));
        }

        traininglist.push(new ListItem("Tumble", trainingkb.tumble ? "Yes" : "No"));
        vslist.push(new ListItem("Tumble", vskb.tumble ? "Yes" : "No"));
        if (trainingkb.reeling) {
            traininglist.push(new ListItem("Reeling/Spin animation", "30%"));
        }
        if (vskb.reeling) {
            vslist.push(new ListItem("Reeling/Spin animation", "30%"));
        }
        traininglist.push(new ListItem("Can Jab lock", trainingkb.can_jablock ? "Yes" : "No"));
        vslist.push(new ListItem("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));

        if (target.name == "Rosalina And Luma") {
            if (!wbkb) {
                var luma_trainingkb = TrainingKB(15 + luma_percent + preDamage, base_damage, damage, 100, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, angle, in_air, windbox, di);
                var luma_vskb = VSKB(15 + luma_percent + preDamage, base_damage, damage, 100, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di);
                luma_trainingkb.addModifier(attacker.modifier.kb_dealt);
                luma_vskb.addModifier(attacker.modifier.kb_dealt);
                luma_trainingkb.addModifier(target.modifier.kb_received);
                luma_vskb.addModifier(target.modifier.kb_received);
                traininglist.push(new ListItem("Luma KB", +luma_trainingkb.kb.toFixed(4)));
                traininglist.push(new ListItem("Luma launched", luma_trainingkb.tumble ? "Yes" : "No"));
                vslist.push(new ListItem("Luma KB", +luma_vskb.kb.toFixed(4)));
                vslist.push(new ListItem("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
            } else {
                var luma_trainingkb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15 + luma_percent, damage, 0, angle, in_air, windbox, di);
                var luma_vskb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15 + luma_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di);
                luma_vskb.addModifier(target.modifier.kb_received);
                luma_vskb.addModifier(target.modifier.kb_received);
                traininglist.push(new ListItem("Luma KB", +luma_trainingkb.kb.toFixed(4)));
                traininglist.push(new ListItem("Luma launched", luma_trainingkb.tumble ? "Yes" : "No"));
                vslist.push(new ListItem("Luma KB", +luma_vskb.kb.toFixed(4)));
                vslist.push(new ListItem("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
            }
        }

        if (!unblockable) {
            if (!powershield) {
                var s = (base_damage * attacker.modifier.damage_dealt * 1.19) + (shieldDamage * 1.19);
                traininglist.push(new ListItem("Shield Damage", +s.toFixed(4)));
                traininglist.push(new ListItem("Full HP shield", +(50 * target.modifier.shield).toFixed(4)));
                traininglist.push(new ListItem("Shield Break", s >= 50 * target.modifier.shield ? "Yes" : "No"));
                damage /= target.modifier.damage_taken;
                s = (StaleDamage(damage, stale, ignoreStale) * attacker.modifier.damage_dealt * 1.19) + (shieldDamage * 1.19);
                vslist.push(new ListItem("Shield Damage", +s.toFixed(4)));
                vslist.push(new ListItem("Full HP shield", +(50 * target.modifier.shield).toFixed(4)));
                vslist.push(new ListItem("Shield Break", s >= 50 * target.modifier.shield ? "Yes" : "No"));
            }
            traininglist = traininglist.concat(ShieldList([ShieldStun(damage, is_projectile, powershield), ShieldHitlag(damage, hitlag, HitlagElectric(electric)), ShieldAdvantage(damage, hitlag, hitframe, $scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "yes" ? faf + attacker.attributes.hard_landing_lag : faf, is_projectile, HitlagElectric(electric), powershield)]));
            vslist = vslist.concat(ShieldList([ShieldStun(StaleDamage(damage, stale, ignoreStale), is_projectile, powershield), ShieldHitlag(StaleDamage(damage, stale, ignoreStale), hitlag, HitlagElectric(electric)), ShieldAdvantage(StaleDamage(damage, stale, ignoreStale), hitlag, hitframe, $scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "yes" ? faf + attacker.attributes.hard_landing_lag : faf, is_projectile, HitlagElectric(electric), powershield)]));
        } else {
            traininglist.push(new ListItem("Unblockable attack", "Yes"));
            vslist.push(new ListItem("Unblockable attack", "Yes"));
        }

        result.training = traininglist;
        result.vs = vslist;
        if(graph){
            var max_x = distance.graph_x + 10;
            var max_y = distance.graph_y + 10;
            max_x = max_y = Math.max(max_x, max_y);
            max_x = max_y = Math.max(max_x, max_y);
            var data = distance.plot;
            Plotly.newPlot('res_graph', data, {'xaxis':{'range': [-max_x, max_x],'showgrid': false,'zeroline': true, 'showline': false}, 'yaxis':{'range': [-max_y, max_y],'showgrid': false,'zeroline': true, 'showline': false}, 'showlegend':false, 'margin': {'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0  }},{'displayModeBar': false});
        }

        return result;
    };

    $scope.updateCharge = function(){
        if($scope.charge_data != null){
            $scope.baseDamage = $scope.selected_move.charge_damage(parseFloat($scope.smashCharge));
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start + parseFloat($scope.smashCharge);
            $scope.faf = $scope.selected_move.faf + parseFloat($scope.smashCharge);
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

        game_mode = $scope.game_mode;
        stage = $scope.stage;
        graph = $scope.show_graph;
        position = {"x":parseFloat($scope.position_x), "y":parseFloat($scope.position_y)};
        inverseX = $scope.inverseX;
        onSurface = $scope.surface;

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

        if($scope.noDI){
            di = -1;
        }else{
            di = parseFloat($scope.di);
        }
        luma_percent = parseFloat($scope.lumaPercent);

        unblockable = $scope.unblockable;

        shieldDamage = parseFloat($scope.shieldDamage);
        
        var results = $scope.calculate();

        $scope.training = results.training;
        $scope.vs = results.vs;
        $scope.shield_advantage = results.shield;

        $scope.sharing_url = buildURL($scope);
    };

    $scope.check_graph = function () {
        $scope.show_graph = !$scope.show_graph;
        if ($scope.show_graph) {
            $scope.update();
        }
    }

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

    mapParams($scope);

    $scope.update();
});