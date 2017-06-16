var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    $scope.app = 'calculator';
    $scope.sharing_url = "";
    $scope.usingHttp = inhttp;
    $scope.attacker_characters = names;
    $scope.characters = names;
    $scope.attackerValue = attacker.display_name;
    $scope.attackerName = attacker.display_name;
    $scope.attackerModifiers = attacker.modifiers;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.display_name;
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
    $scope.stale = [false, false, false, false, false, false, false, false, false];
    $scope.staleness_table = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    $scope.kb_modifier = "none";
    //$scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //$scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    //$scope.shield = ShieldList([0, 0, 0]);
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;
    $scope.shield = "normal";
    $scope.hit_frame = hitframe;
    $scope.faf = faf;
    $scope.shieldDamage = 0;
    $scope.charging_frames_type = "Charging frames";

    $scope.set_weight = false;
    $scope.paralyzer = false;

    $scope.hitbox_active_index = 0;

    $scope.preDamage = 0;
    $scope.di = di;
    $scope.noDI = true;

    $scope.attackerMod = "Normal";
    $scope.targetMod = "Normal";
    $scope.charge_frames = 0;
    $scope.attacker_percent = 0;
    $scope.target_percent = 0;

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
    $scope.wbkb = 0;
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
    $scope.extra_vis_frames = 0;

	$scope.stages = getStages();
    $scope.stageValue = "0";

    $scope.spawns = [];

    $scope.charge_min = 0;
    $scope.charge_max = 60;
    $scope.charge_special = false;
    $scope.charge_data = null;

    $scope.stock_dif = "0";
    $scope.stock_values = ["-2","-1","0","+1","+2"];
    $scope.formats = ["Singles", "Doubles"];
    $scope.format = "Singles";

	$scope.stage = $scope.stages[0];

	$scope.stageName = $scope.stage.stage;

	$scope.spawns = ["Center"];
	for (var i = 0; i < $scope.stage.spawns.length; i++) {
		$scope.spawns.push(i + 1);
	}
	$scope.spawn = "Center";

	$scope.currentPlot = {};

	$scope.launch_rate = launch_rate;

    $scope.delayed_landing_lag = null;

    $scope.params = parameters;

    $scope.visualizer_extra = [];

	$scope.getStage = function () {
		for (var i = 0; i < $scope.stages.length; i++) {
			if ($scope.stages[i].stage == $scope.stageName) {
				$scope.stageValue = i + "";
				$scope.updateStage();
				return;
			}
		}
	}

	$scope.updateStage = function () {
		$scope.stage = $scope.stages[$scope.stageValue];
		$scope.stageName = $scope.stage.stage;
		if ($scope.stage.stage == "No stage") {
			$scope.stage = null;
			$scope.spawns = [];
			$scope.spawn = "";
			$scope.update();
			return;
		}
		if ($scope.stage.center != null) {
			$scope.position_x = $scope.stage.center[0];
			$scope.position_y = $scope.stage.center[1];
			$scope.spawns = ["Center"];
		} else {
			$scope.position_x = $scope.spawns[0];
			$scope.position_y = $scope.spawns[1];
			$scope.spawns = [];
		}
		for (var i = 0; i < $scope.stage.spawns.length; i++) {
			$scope.spawns.push(i + 1);
		}
		$scope.spawn = "Center";
		$scope.update();
	}

	$scope.setPositionSpawn = function () {
		if ($scope.spawn != "Center") {
			var i = parseFloat($scope.spawn) - 1;
			$scope.position_x = $scope.stage.spawns[i][0];
			$scope.position_y = $scope.stage.spawns[i][1];
			$scope.update();
		} else {
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

    $scope.updateParalyzer = function () {
        $scope.set_weight = $scope.paralyzer;
        $scope.update();
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
            if ($scope.delayed_landing_lag != null) {
                $scope.use_landing_lag = $scope.delayed_landing_lag;
                setTimeout(function () {
                    $scope.delayed_landing_lag = null;
                    $scope.update_faf();
                    $scope.$apply();
                }, 10);
            } else {
                $scope.use_landing_lag = "no";
            }
            $scope.is_aerial = { 'display': $scope.selected_move.aerial ? 'initial' : 'none' };
            $scope.prev_hf = { 'display': 'none' };
            $scope.next_hf = { 'display': $scope.selected_move.hitboxActive.length > 1 ? 'inline' : 'none' };
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

	$scope.updateStaleness = function (value) {
		if (value == "0") {
			$scope.stale = [false, false, false, false, false, false, false, false, false];
		} else if (value == "1") {
			$scope.stale = [true, true, true, true, true, true, true, true, true];
		}
		$scope.update();
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
        if (attacker.name == "Cloud" || attacker.name == "Bowser Jr") {
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
        var damage = +(parseFloat($scope.counteredDamage) * attack.counterMult).toFixed(4);
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
        if (target.name == "Bowser Jr") {
            $scope.targetMod = "Clown Kart";
        }
        $scope.target_mod = { 'display': $scope.targetModifiers.length > 0 ? 'initial' : 'none' };
        $scope.target_icon = target.icon;
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
        $scope.target_fall_speed = target.attributes.fall_speed * target.modifier.fall_speed;
        $scope.target_traction = target.attributes.traction * target.modifier.traction;
        $scope.update();
	}

	$scope.getDistance = function (damage) {
		if (wbkb == 0) {
			trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, angle, in_air, windbox, electric, di);
			vskb = VSKB(target_percent + preDamage, base_damage, damage, set_weight ? 100 : target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, electric, di, launch_rate);
			trainingkb.addModifier(attacker.modifier.kb_dealt);
			vskb.addModifier(attacker.modifier.kb_dealt);
			trainingkb.addModifier(target.modifier.kb_received);
			vskb.addModifier(target.modifier.kb_received);
		} else {
			trainingkb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, electric, di);
			vskb = WeightBasedKB(set_weight ? 100 : target.attributes.weight, bkb, wbkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, electric, di, launch_rate);
			trainingkb.addModifier(target.modifier.kb_received);
			vskb.addModifier(target.modifier.kb_received);
		}

		var distance;
		if (game_mode == "training") {
			distance = new Distance(trainingkb.kb, trainingkb.horizontal_launch_speed, trainingkb.vertical_launch_speed, trainingkb.hitstun, trainingkb.angle, trainingkb.di_change, target.attributes.gravity * target.modifier.gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction, inverseX, onSurface, position, $scope.stage, false, 0);
		} else {
			distance = new Distance(vskb.kb, vskb.horizontal_launch_speed, vskb.vertical_launch_speed, vskb.hitstun, vskb.angle, vskb.di_change, target.attributes.gravity * target.modifier.gravity, ($scope.use_landing_lag == "yes" ? faf + landing_lag : $scope.use_landing_lag == "autocancel" ? faf + attacker.attributes.hard_landing_lag : faf) - hitframe, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction, inverseX, onSurface, position, $scope.stage, false, 0);
		}

		return distance;
	}

	$scope.calc = function (damage) {
		var data = {};
		//Check if it can KO at 999% (if not just stop calculation)
		target_percent = 999;
		var distance = $scope.getDistance(damage);
		var last = 0;
		var found = false;
		if (distance.KO) {
			for (var i = 0; i < 999 && !found; i += 20) {
				target_percent = i;
				distance = $scope.getDistance(damage);
				if (distance.KO) {
					if (i == 0) {
						data = { "ko": true, "ko_percent": 0, "distance": distance };
						found = true;
						break;
					}
					else {
						for (var x = i; x > i - 30; x -= 2) {
							last = x;
							target_percent = x - 2;
							distance = $scope.getDistance(damage);
							if (!distance.KO) {
								for (var y = x+2; y > x; y -= 0.02) {
									last = y;
									target_percent = y - 0.02;
									distance = $scope.getDistance(damage);
									if (!distance.KO) {
										found = true;
										data = { "ko": true, "ko_percent": last, "distance": distance };
										break;
									}
								}
							}
							if (found) {
								break;
							}
						}

					}
				}
			}
		} else {
			data = { "ko": false };
		}
		return data;
	}

    $scope.calculate = function (){
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

		var data = $scope.calc(damage);

		$scope.visualizer_extra = [];

		if (data.ko) {
			data.distance.doPlot();
			$scope.visualizer_extra.push(new Result("Target %", data.ko_percent, "", false, true));
			//$scope.visualizer_extra.push(new Result("KO", data.frame, "", false, true));
			var max_x = data.distance.graph_x + 10;
			var max_y = data.distance.graph_y + 10;
			max_x = max_y = Math.max(max_x, max_y);

			Plotly.newPlot('res_graph', data.distance.plot, { 'xaxis': { 'range': [-max_x, max_x], 'showgrid': false, 'zeroline': true, 'showline': false }, 'yaxis': { 'range': [-max_y, max_y], 'showgrid': false, 'zeroline': true, 'showline': false }, 'showlegend': false, 'margin': { 'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0 } }, { 'displayModeBar': false });
		}
		else {
			$scope.visualizer_extra.push(new Result("Can't KO", "Move doesn't KO at 999%", "", false, true));
		}

	};

	$scope.calculateDI = function () {
		if ($scope.charge_data == null && $scope.is_smash) {
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

		var list = [];
		var data = $scope.calc(damage);

		

		$scope.visualizer_extra = [];

		if (data.ko) {
			for (var i = 0; i < 360; i+=1) {
				di = i;
				var data = $scope.calc(damage);

				list.push({ "di": i, "percent": data.ko_percent, "data": data });
			}

			list.sort(function (a, b) {
				if (a.percent > b.percent) {
					return -1;
				} else if (a.percent < b.percent) {
					return 1;
				}
				return 0;
			});

			list[0].data.distance.doPlot();

			$scope.visualizer_extra.push(new Result("Best DI angle", list[0].di, "", false, true));
			$scope.visualizer_extra.push(new Result("Target % with best DI", list[0].percent, "", false, true));
			//$scope.visualizer_extra.push(new Result("KO", data.frame, "", false, true));
			var max_x = list[0].data.distance.graph_x + 10;
			var max_y = list[0].data.distance.graph_y + 10;
			max_x = max_y = Math.max(max_x, max_y);
			Plotly.newPlot('res_graph', list[0].data.distance.plot, { 'xaxis': { 'range': [-max_x, max_x], 'showgrid': false, 'zeroline': true, 'showline': false }, 'yaxis': { 'range': [-max_y, max_y], 'showgrid': false, 'zeroline': true, 'showline': false }, 'showlegend': false, 'margin': { 'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0 } }, { 'displayModeBar': false });

			if ($scope.noDI) {
				di = -1;
			} else {
				di = parseFloat($scope.di);
			}
			
		}
		else {
			$scope.visualizer_extra.push(new Result("Can't KO", "Move doesn't KO at 999%", "", false, true));
		}

	};
	

    $scope.updateCharge = function(){
        if($scope.charge_data != null){
			$scope.baseDamage = $scope.selected_move.charge_damage(parseFloat($scope.smashCharge));
			if ($scope.charge_data.variable_bkb) {
				$scope.bkb = $scope.selected_move.charge_bkb(parseFloat($scope.smashCharge));
			}
            $scope.hit_frame = $scope.selected_move.hitboxActive[$scope.hitbox_active_index].start + parseFloat($scope.smashCharge);
            $scope.faf = $scope.selected_move.faf + parseFloat($scope.smashCharge);
        }
        $scope.update();
    }

    $scope.update = function () {
        $scope.check();
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
		attacker_percent = parseFloat($scope.attackerPercent);

        preDamage = parseFloat($scope.preDamage);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
        stale = $scope.stale;
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
        wbkb = parseFloat($scope.wbkb);
        windbox = $scope.windbox;

        game_mode = $scope.game_mode;
        inverseX = $scope.inverseX;
        onSurface = $scope.surface;

        stock_dif = $scope.stock_dif;
        game_format = $scope.format;

        if($scope.noDI){
            di = -1;
        }else{
            di = parseFloat($scope.di);
        }

        unblockable = $scope.unblockable;

        shieldDamage = parseFloat($scope.shieldDamage);

        set_weight = $scope.set_weight;

        paralyzer = $scope.paralyzer;
        
        launch_rate = parseFloat($scope.launch_rate);

		//Stage
		var data = [];
		//Stage blast zones
		var adxdata = [];
		var adydata = [];

		position = { "x": parseFloat($scope.position_x), "y": parseFloat($scope.position_y) };

		if (position.x < $scope.stage.blast_zones[0]) {
			position.x = $scope.stage.blast_zones[0];
			$scope.position_x = position.x;
		}
		if (position.x > $scope.stage.blast_zones[1]) {
			position.x = $scope.stage.blast_zones[1];
			$scope.position_x = position.x;
		}

		if (position.y > $scope.stage.blast_zones[2]) {
			position.y = $scope.stage.blast_zones[2];
			$scope.position_y = position.y;
		}
		if (position.y < $scope.stage.blast_zones[3]) {
			position.y = $scope.stage.blast_zones[3];
			$scope.position_y = position.y;
		}

		//Stage blast zones
		adxdata.push($scope.stage.blast_zones[0]);
		adxdata.push($scope.stage.blast_zones[1]);
		adxdata.push($scope.stage.blast_zones[1]);
		adxdata.push($scope.stage.blast_zones[0]);
		adxdata.push($scope.stage.blast_zones[0]);

		adydata.push($scope.stage.blast_zones[2]);
		adydata.push($scope.stage.blast_zones[2]);
		adydata.push($scope.stage.blast_zones[3]);
		adydata.push($scope.stage.blast_zones[3]);
		adydata.push($scope.stage.blast_zones[2]);

		data.push({ 'calcValue': "Blast zone", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'red' }, 'name': "Blast zone" });

		//Stage Camera bounds
		adxdata = [];
		adydata = [];
		adxdata.push($scope.stage.camera[0]);
		adxdata.push($scope.stage.camera[1]);
		adxdata.push($scope.stage.camera[1]);
		adxdata.push($scope.stage.camera[0]);
		adxdata.push($scope.stage.camera[0]);

		adydata.push($scope.stage.camera[2]);
		adydata.push($scope.stage.camera[2]);
		adydata.push($scope.stage.camera[3]);
		adydata.push($scope.stage.camera[3]);
		adydata.push($scope.stage.camera[2]);

		data.push({ 'calcValue': "Camera bounds", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'blue' }, 'name': "Camera bounds" });

		//Stage surface
		adxdata = [];
		adydata = [];
		var adxdata2 = [];
		var adydata2 = [];
		var semi_tech = [];

		for (var i = 0; i < $scope.stage.collisions.length; i++) {
			adxdata = [];
			adydata = [];
			for (var j = 0; j < $scope.stage.collisions[i].vertex.length; j++) {
				adxdata.push($scope.stage.collisions[i].vertex[j][0]);
				adydata.push($scope.stage.collisions[i].vertex[j][1]);

				if (j < $scope.stage.collisions[i].vertex.length - 1) {
					//Wall jump disabled walls
					adxdata2 = [];
					adydata2 = [];
					if ($scope.stage.collisions[i].materials[j].noWallJump) {
						adxdata2.push($scope.stage.collisions[i].vertex[j][0]);
						adydata2.push($scope.stage.collisions[i].vertex[j][1]);
						adxdata2.push($scope.stage.collisions[i].vertex[j + 1][0]);
						adydata2.push($scope.stage.collisions[i].vertex[j + 1][1]);
						semi_tech.push({ 'calcValue': $scope.stage.collisions[i].name + " Wall jump disabled wall", 'x': adxdata2, 'y': adydata2, 'mode': 'lines', 'line': { 'color': 'purple' }, 'name': "Wall jump disabled wall" });
					}
					//Small walls
					adxdata2 = [];
					adydata2 = [];
					if ($scope.stage.collisions[i].materials[j].length <= 7 && ($scope.stage.collisions[i].materials[j].wall || $scope.stage.collisions[i].materials[j].ceiling) && !$scope.stage.collisions[i].materials[j].noWallJump) {
						adxdata2.push($scope.stage.collisions[i].vertex[j][0]);
						adydata2.push($scope.stage.collisions[i].vertex[j][1]);
						adxdata2.push($scope.stage.collisions[i].vertex[j + 1][0]);
						adydata2.push($scope.stage.collisions[i].vertex[j + 1][1]);
						semi_tech.push({ 'calcValue': $scope.stage.collisions[i].name + " small wall", 'x': adxdata2, 'y': adydata2, 'mode': 'lines', 'line': { 'color': 'red' }, 'name': "Semi-techable small wall" });
					}
				}
			}
			data.push({ 'calcValue': $scope.stage.collisions[i].name, 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'green' }, 'name': "Stage" });
		}

		data = data.concat(semi_tech);


		//Stage platforms
		if ($scope.stage.platforms !== undefined) {
			for (var i = 0; i < $scope.stage.platforms.length; i++) {
				adxdata = [];
				adydata = [];
				for (var j = 0; j < $scope.stage.platforms[i].vertex.length; j++) {
					adxdata.push($scope.stage.platforms[i].vertex[j][0]);
					adydata.push($scope.stage.platforms[i].vertex[j][1]);
				}
				data.push({ 'calcValue': "Platform", 'x': adxdata, 'y': adydata, 'mode': 'lines', 'line': { 'color': 'green' }, 'name': $scope.stage.platforms[i].name });
			}
		}

		$scope.graph_x = Math.abs(position.x);
		$scope.graph_y = Math.abs(position.y);

		$scope.graph_x = Math.max($scope.graph_x, $scope.stage.blast_zones[1]) + 10;
		$scope.graph_y = Math.max($scope.graph_y, $scope.stage.blast_zones[2]) + 10;

		data.push({ 'calcValue': "Position", 'x': [position.x], 'y': [position.y], 'mode': 'markers', 'marker': { 'color': 'blue' }, 'name': "Position" });

		Plotly.newPlot('res_graph', data, { 'xaxis': { 'range': [-$scope.graph_x, $scope.graph_x], 'showgrid': false, 'zeroline': true, 'showline': false }, 'yaxis': { 'range': [-$scope.graph_y, $scope.graph_y], 'showgrid': false, 'zeroline': true, 'showline': false }, 'showlegend': false, 'margin': { 'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0 } }, { 'displayModeBar': false });

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

    $scope.updateParameters = function () {
        parameters = $scope.params;
        parameters.hitstunCancel.frames.airdodge = Math.floor(parameters.hitstunCancel.frames.airdodge);
        parameters.hitstunCancel.frames.aerial = Math.floor(parameters.hitstunCancel.frames.aerial);
        parameters.tumble_threshold = Math.floor(parameters.tumble_threshold);
        $scope.update();
    }


    $scope.theme = "Normal";
    $scope.themes = styleList;

    $scope.changeTheme = function () {
        changeStyle($scope.theme);
    }

    mapParams($scope);

    if ($scope.paralyzer && !$scope.set_weight) {
        $scope.set_weight = true;
    }


    $scope.update();
});