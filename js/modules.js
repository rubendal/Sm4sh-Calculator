var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    var anames = names.slice();
    anames.splice(anames.indexOf("Cloud (Limit Break)"), 1);
    $scope.attacker_characters = anames;
    $scope.characters = names;
    $scope.attackerValue = attacker.name;
    $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
    $scope.targetValue = target.name;
    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
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
    $scope.hit_frame = 0;
    $scope.faf = 1;
    $scope.shieldDamage = 0;

    $scope.preDamage = 0;
    $scope.di = 0;
    $scope.noDI = true;

    $scope.lumaPercent = 0;
    $scope.lumaclass = { 'display': 'none' };

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
    $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
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

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.game_mode = game_mode;
    $scope.res_mode = "calc";

    $scope.inverseX = false;
    $scope.surface = false;
    $scope.position_x = 0;
    $scope.position_y = 0;

    $scope.stages = getStages();
    $scope.stage = null;

    $scope.updateStage = function(){
        $scope.stage = JSON.parse($scope.stageValue);
        $scope.position_x = $scope.stage.center[0];
        $scope.position_y = $scope.stage.center[1];
        $scope.update();
    }

    $scope.checkSmashVisibility = function () {
        $scope.is_smash_visibility = { 'display': $scope.is_smash ? 'initial' : 'none' };
        $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
    }

    $scope.checkCounterVisibility = function () {
        $scope.counterStyle = { "display": $scope.counterMult != 0 ? "block" : "none" };
    }

    $scope.charging = function(){
        $scope.checkSmashVisibility();
        $scope.megaman_fsmash = false;
        $scope.smashCharge = 0;
        charge_frames = 0;

        $scope.updateAttackData();
    };

    $scope.check = function () {
        $scope.is_megaman = { 'display': attacker.name == "Mega Man" ? 'initial' : 'none' };
        if (attacker.name != "Mega Man") {
            $scope.megaman_fsmash = false;
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

    $scope.show = function (section) {
        $scope.main_style = { 'display': section == "main" ? 'block' : 'none' };
        $scope.attributes_style = { 'display': section == "attributes" ? 'block' : 'none' };
        $scope.visualizer_style = { 'display': section == "visualizer" ? 'block' : 'none' };
        $scope.section_main = { 'background': section == "main" ? 'rgba(0, 0, 255, 0.3)': 'transparent' };
        $scope.section_attributes = { 'background': section == "attributes" ? 'rgba(0, 0, 255, 0.3)' : 'transparent' };
        $scope.section_visualizer = { 'background': section == "visualizer" ? 'rgba(0, 0, 255, 0.3)' : 'transparent' };
    }

    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        getMoveset(attacker, $scope);
        $scope.move = "0";
        $scope.preDamage = 0;
        $scope.attacker_damage_dealt = attacker.modifier.damage_dealt;
        $scope.attacker_kb_dealt = attacker.modifier.kb_dealt;
        $scope.counterMult = 0;
        $scope.counteredDamage = 0;
        $scope.unblockable = false;
        $scope.checkCounterVisibility();
        $scope.update();
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
            $scope.checkSmashVisibility();
            $scope.checkCounterVisibility();
            if ($scope.counterMult != 0) {
                $scope.counterDamage();
            }
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
        $scope.target_weight = target.attributes.weight;
        $scope.target_gravity = target.attributes.gravity * target.modifier.gravity;
        $scope.target_damage_taken = target.modifier.damage_taken;
        $scope.target_kb_received = target.modifier.kb_received;
        $scope.target_fall_speed = target.attributes.fall_speed;
        $scope.target_traction = target.attributes.traction;
        $scope.lumaclass = { "display": target.name == "Rosalina And Luma" ? "block" : "none", "margin-left": "292px" };
        $scope.lumaPercent = 0;
        $scope.update();
    }

    $scope.calculate = function (){
        var result = { 'training': [], 'vs': [], 'shield': [] };

        base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash);
        var damage = base_damage;
        if (attacker.name == "Lucario") {
            damage *= Aura(attacker_percent);
            preDamage *= Aura(attacker_percent);
        }
        damage *= attacker.modifier.damage_dealt;
        damage *= target.modifier.damage_taken;
        preDamage *= attacker.modifier.damage_dealt;
        preDamage *= target.modifier.damage_taken;

        if (!wbkb) {
            trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, angle, in_air, windbox, di);
            vskb = VSKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di);
            trainingkb.addModifier(attacker.modifier.kb_dealt);
            vskb.addModifier(attacker.modifier.kb_dealt);
            trainingkb.addModifier(target.modifier.kb_received);
            vskb.addModifier(target.modifier.kb_received);
        } else {
            trainingkb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, di);
            vskb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di);
            trainingkb.addModifier(target.modifier.kb_received);
            vskb.addModifier(target.modifier.kb_received);
        }

        var distance;
        if(game_mode == "training"){
            distance = new Distance(trainingkb.kb, trainingkb.x, trainingkb.y, trainingkb.hitstun, trainingkb.base_angle, trainingkb.di_change, target.attributes.gravity, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
        }else{
            distance = new Distance(vskb.kb, vskb.x, vskb.y, vskb.hitstun, vskb.base_angle, vskb.di_change, target.attributes.gravity, target.attributes.fall_speed, target.attributes.traction, inverseX, onSurface, position, stage, graph);
        }

        if(stage != null){
            if(distance.bounce_speed >= 1){
                $scope.kb_modifier_bounce = distance.bounce;
                bounce = distance.bounce;
            }
        }

        trainingkb.bounce(bounce);
        vskb.bounce(bounce);

        if(!graph){
            var traininglist = List([damage, Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), trainingkb.kb, trainingkb.base_angle, trainingkb.x, trainingkb.y, Hitstun(trainingkb.base_kb, windbox), FirstActionableFrame(trainingkb.base_kb, windbox), AirdodgeCancel(trainingkb.base_kb, windbox), AerialCancel(trainingkb.base_kb, windbox), trainingkb.launch_speed]);
            var vslist = List([StaleDamage(damage, stale, ignoreStale), Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), vskb.kb, vskb.base_angle, vskb.x, vskb.y, Hitstun(vskb.base_kb, windbox), FirstActionableFrame(vskb.base_kb, windbox), AirdodgeCancel(vskb.base_kb, windbox), AerialCancel(vskb.base_kb, windbox), vskb.launch_speed]);
            if(game_mode == "vs"){
                vslist.splice(11, 0, new ListItem("Max Horizontal Distance", + +distance.max_x.toFixed(4)));
                vslist.splice(11, 0, new ListItem("Max Vertical Distance", + +distance.max_y.toFixed(4)));
            }else{
                traininglist.splice(11, 0, new ListItem("Max Horizontal Distance", + +distance.max_x.toFixed(4)));
                traininglist.splice(11, 0, new ListItem("Max Vertical Distance", + +distance.max_y.toFixed(4)));
            }
            if (trainingkb.di_able) {
                traininglist.splice(5, 0, new ListItem("DI angle", + +trainingkb.angle.toFixed(4)));
            }
            if (vskb.di_able) {
                vslist.splice(5, 0, new ListItem("DI angle", + +vskb.angle.toFixed(4)));
            }
            if (trainingkb.tumble) {
                traininglist.splice(7, 0, new ListItem("Gravity KB", +trainingkb.add_gravity_kb.toFixed(4)));
            }
            if (vskb.tumble) {
                vslist.splice(7, 0, new ListItem("Gravity KB", +vskb.add_gravity_kb.toFixed(4)));
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
            if (preDamage != 0) {
                traininglist.splice(0, 0, new ListItem("Before launch damage", "+" + +preDamage.toFixed(4) + "%"));
                vslist.splice(0, 0, new ListItem("Before launch damage", "+" + +(preDamage * StaleNegation(stale, ignoreStale)).toFixed(4) + "%"));
            }
            if(!ignoreStale){
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
                    var luma_vskb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15+luma_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di);
                    luma_vskb.addModifier(target.modifier.kb_received);
                    luma_vskb.addModifier(target.modifier.kb_received);
                    traininglist.push(new ListItem("Luma KB", +luma_trainingkb.kb.toFixed(4)));
                    traininglist.push(new ListItem("Luma launched", luma_trainingkb.tumble ? "Yes" : "No"));
                    vslist.push(new ListItem("Luma KB", +luma_vskb.kb.toFixed(4)));
                    vslist.push(new ListItem("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
                }
            }

            result.training = traininglist;
            result.vs = vslist;

            //Shield stuff
            if(!unblockable){
                result.shield = ShieldList([ShieldStun(damage, is_projectile, powershield), ShieldHitlag(damage, hitlag, HitlagElectric(electric)), ShieldAdvantage(damage, hitlag, hitframe, faf, is_projectile, HitlagElectric(electric), powershield)]);
                if(!powershield){
                    var s = (base_damage * 1.19) + (shieldDamage * 1.19);
                    result.shield.splice(0, 0, new ListItem("Shield Damage", +s.toFixed(4)));
                    result.shield.splice(1, 0, new ListItem("Full HP shield", +(50 * target.modifier.shield).toFixed(4)));
                    result.shield.splice(2, 0, new ListItem("Shield Break", s >= 50 * target.modifier.shield ? "Yes" : "No"));

                }
            }else{
                result.shield = ([new ListItem("Unblockable attack", "Yes")]);
            }
        }else{
            var max_x = distance.graph_x + 10;
            var max_y = distance.graph_y + 10;
            max_x = max_y = Math.max(max_x, max_y);
            max_x = max_y = Math.max(max_x, max_y);
            var data = distance.plot;
            Plotly.newPlot('res_graph', data, {'xaxis':{'range': [-max_x, max_x],'showgrid': false,'zeroline': true, 'showline': false}, 'yaxis':{'range': [-max_y, max_y],'showgrid': false,'zeroline': true, 'showline': false}, 'showlegend':false, 'margin': {'l': 25, 'r': 0, 'b': 25, 't': 0, 'pad': 0  }},{'displayModeBar': false});
        }

        return result;
    };

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
        electric = $scope.hitlag_modifier;
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = $scope.wbkb;
        windbox = $scope.windbox;

        game_mode = $scope.game_mode;
        stage = $scope.stage;
        graph = $scope.res_mode == "vis";
        position = {"x":parseFloat($scope.position_x), "y":parseFloat($scope.position_y)};
        inverseX = $scope.inverseX;
        onSurface = $scope.surface;

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


    };

    $scope.showres = function (section) {
        $scope.res_mode = section;
        $scope.calc_style = { 'display': section == "calc" ? 'block' : 'none' };
        $scope.graph_style = { 'display': section == "vis" ? 'block' : 'none' };
        $scope.section_calculation = { 'background': section == "calc" ? 'rgba(0, 0, 255, 0.3)': 'transparent' };
        $scope.section_graph = { 'background': section == "vis" ? 'rgba(0, 0, 255, 0.3)' : 'transparent' };
        $scope.update();
    }

    $scope.showres($scope.res_mode);

    //$scope.update();
});