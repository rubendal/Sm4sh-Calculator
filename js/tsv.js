var headers = ["attacker","attacker_modifier","attacker_name","target","target_modifier","target_name","attacker_percent","rage","target_percent",
"move","base_damage","damage","staleness","staleness_multiplier","angle","bkb","kbg",
"kb_modifier","kb_multiplier","kb","kb_x","kb_y","launch_angle","hitstun","tumble","can_jab_lock","vectoring_multiplier","horizontal_launch_speed","vertical_launch_speed",
"horizontal_distance","vertical_distance","x_position","y_position"];

var tsv_rows = [];

class Row{
    constructor(attacker, target, attacker_percent, target_percent, move, damage, staleness, kb_multiplier, kb, distance){
        this.attacker = attacker;
        this.target = target;
        this.attacker_percent = attacker_percent;
        this.target_percent = target_percent;
        this.move = move;
        this.damage = damage;
        this.staleness = staleness;
        this.staleMult = StaleNegation(this.staleness, this.staleness == -1);
        this.kb_multiplier = kb_multiplier;
        this.kb_modifier = this.kb_multiplier == 0.8 ? "Crouch Cancel" : this.kb_multiplier == 1.2 ? "Interrupted charged smash attack" : "None";
        this.kb = kb;
        this.kb.calculate();
        this.distance = distance;
        if(this.kb.angle > 361){
            this.distance.max_x = NaN;
            this.distance.max_y = NaN;
        }
        this.rage = Rage(attacker_percent); 
        this.v_pos = this.distance.max_y * (Math.sin(this.kb.angle * Math.PI / 180) < 0 ? -1 : 1);
        this.h_pos = this.distance.max_x * (Math.cos(this.kb.angle * Math.PI / 180) < 0 ? -1 : 1);  
        this.vectoring = this.kb.vectoring == 1 ? 1.095 : this.kb.vectoring == -1 ? 0.92 : 1;

        this.tsv = function(){
            return [this.attacker.name, this.attacker.modifier.name, this.attacker.display_name, this.target.display_name, this.target.modifier.name, this.target.display_name,
            this.attacker_percent, this.rage, this.target_percent,
            this.move.name, this.move.base_damage, this.damage, this.staleness, this.staleMult, this.move.angle, this.move.bkb, this.move.kbg,
            this.kb_modifier, this.kb_multiplier, this.kb.kb, this.kb.x, this.kb.y, this.kb.angle, this.kb.hitstun, this.kb.tumble, this.kb.can_jablock, this.vectoring, this.kb.horizontal_launch_speed, this.kb.vertical_launch_speed,
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

    $scope.changeCharacters = function(mods, customMonado){
        resetCharacterList(mods, customMonado);
        var anames = names.slice();
        anames.splice(anames.indexOf("Cloud (Limit Break)"), 1);
        $scope.attacker_characters = anames;
        $scope.characters = names;
        if(anames.indexOf(attacker.display_name) != -1){
            $scope.attackerValue = attacker.display_name;
        }else{
            $scope.attackerValue = attacker.name;
            $scope.updateAttacker();
        }
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
        if(names.indexOf(target.display_name) != -1){
            $scope.targetValue = target.display_name;
        }else{
            $scope.targetValue = target.name;
            $scope.updateTarget();
        }
    }

    $scope.changeCharacters(false, false);

    $scope.iterations = 1;
    $scope.stored = 0;

    $scope.attackerPercent = attacker_percent;
    $scope.targetPercent = target_percent;
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
    $scope.hit_frame = 0;
    $scope.faf = 1;
    $scope.shieldDamage = 0;

    $scope.preDamage = 0;
    $scope.di = 0;
    $scope.noDI = true;

    $scope.lumaPercent = 0;
    $scope.lumaclass = { 'display': 'none' };

    $scope.vectoring = "none";

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

    $scope.status = "Calculate and store data";

    getMoveset(attacker, $scope);
    $scope.move = "0";

    $scope.attacker_from = 35;
    $scope.attacker_to = 150;
    $scope.attacker_step = 0.5;
    $scope.target_from = 0;
    $scope.target_to = 150;
    $scope.target_step = 1;


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


    $scope.updateAttacker = function(){
        attacker = new Character($scope.attackerValue);
        getMoveset(attacker, $scope);
        $scope.move = "0";
        $scope.preDamage = 0;
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
        $scope.lumaclass = { "display": target.name == "Rosalina And Luma" ? "block" : "none", "margin-left": "292px" };
        $scope.lumaPercent = 0;
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
        electric = $scope.hitlag_modifier;
        crouch = $scope.kb_modifier;

        is_smash = $scope.is_smash;
        wbkb = $scope.wbkb;
        windbox = $scope.windbox;

        if($scope.noDI){
            di = -1;
        }else{
            di = parseFloat($scope.di);
        }

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

        luma_percent = parseFloat($scope.lumaPercent);

        unblockable = $scope.unblockable;

        shieldDamage = parseFloat($scope.shieldDamage);
        
        $scope.changeCharacters($scope.inc_mod, $scope.inc_cust);

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
        var istale = $scope.it_stale ? 10 : 1;
        var ikbmod = $scope.it_kb_mod ? 3 : 1;
        var imoves = $scope.it_moves ? ($scope.moveset.length > 1 ? $scope.moveset.length - 1 : 1) : 1;
        var itargets = $scope.it_targets ? names.length : 1;
        var ipercent = $scope.it_percent ? Math.floor(((to - from)/step)) + 1 : 1;
        var irage = $scope.it_rage ? Math.floor((at_to - at_from)/at_step) + 1 : 1;
        var ivectoring = $scope.it_vectoring ? 3 : 1;
        var calculations = (istale * ikbmod * (imoves-smashcount) * itargets * ipercent * irage * ivectoring) + (smashcount * 61 * istale * ikbmod * itargets * ipercent * irage * ivectoring);

        $scope.calculations = calculations;

        if($scope.calculations > 200000){
            $scope.status = "Cannot make calculations";
        }else{
            $scope.status = "Calculate and store data";
        }

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

        var selectedChar = target.display_name;
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
            move.base_damage = base_damage;
        }

        $scope.status = "Processing...";
        

        var calcDamage = function(){
            bd = ChargeSmash(base_damage, charge_frames, megaman_fsmash);
            damage = bd;
            if (attacker.name == "Lucario") {
                damage *= Aura(attacker_percent);
                preDamage *= Aura(attacker_percent);
            }
            damage *= attacker.modifier.damage_dealt;
            damage *= target.modifier.damage_taken;
            preDamage *= attacker.modifier.damage_dealt;
            preDamage *= target.modifier.damage_taken;
        }

        var addRow = function(){
            calcDamage();
            if(!wbkb){
                kb = VSKB(target_percent + preDamage, bd, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di, vectoring);
            }else{
                kb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity * target.modifier.gravity, target.attributes.fall_speed * target.modifier.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di, vectoring);
            }
            kb.addModifier(attacker.modifier.kb_dealt);
            kb.addModifier(target.modifier.kb_received);
            kb.bounce(bounce);
            distance = new Distance(kb.kb, kb.horizontal_launch_speed, kb.vertical_launch_speed, kb.hitstun, kb.base_angle, kb.di_change, target.attributes.gravity * target.modifier.gravity, target.attributes.gravity2, target.attributes.air_friction * target.modifier.air_friction, target.attributes.fall_speed * target.modifier.fall_speed, target.attributes.traction * target.modifier.traction);
            tsv_rows.push(new Row(attacker,target,attacker_percent,target_percent,move,StaleDamage(damage, stale, ignoreStale),ignoreStale ? -1 : stale,r,kb,distance));
        }

        var funlist = [];
        var index = 0;

        funlist.push(function(f){
            addRow();
        });

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

        if($scope.it_vectoring){
            funlist.push(function(f){
                vectoring = 0;
                funlist[f-1](f-1);
                vectoring = 1;
                funlist[f-1](f-1);
                vectoring = -1;
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
                if(is_smash){
                    for(var i=0;i<=60;i++){
                        charge_frames = i;
                        funlist[f-1](f-1);
                    }
                }else{
                    funlist[f-1](f-1);
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

        target = new Character(selectedChar);
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

    $scope.tsv_options();
});