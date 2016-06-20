var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    loadGitHubData();
    $scope.characters = characters.sort();
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
    $scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;

    $scope.is_smash = false;
    $scope.is_smash_visibility = { 'visibility': $scope.is_smash ? 'visible' : 'hidden' };
    $scope.smashCharge = 0;
    $scope.set_kb = false;

    $scope.charging = function(){
        $scope.is_smash_visibility = { 'visibility': $scope.is_smash ? 'visible' : 'hidden' };
        $scope.smashCharge = 0;
        charge_frames = 0;
        $scope.update();
    };

    $scope.update = function () {
        attacker = new Character($scope.attackerValue);
        target = new Character($scope.targetValue);
        $scope.encodedAttackerValue = encodeURI(attacker.name.split("(")[0].trim());
        attacker_percent = parseFloat($scope.attackerPercent);
        target_percent = parseFloat($scope.targetPercent);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
        stale = parseFloat($scope.stale);
        hitlag = parseFloat($scope.hitlag);
        charge_frames = parseFloat($scope.smashCharge);
        KBModifier($scope.kb_modifier);
        base_damage = ChargeSmash(base_damage, charge_frames);
        var bounce = $scope.kb_modifier_bounce;
        var damage = base_damage;
        if (attacker.name == "Lucario") {
            damage *= Aura(attacker_percent);
        }
        if (target.modifier.damage_taken < 1) {
            damage *= target.modifier.damage_taken;
        }
        if (attacker.modifier.damage_dealt > 1 && monado.indexOf(attacker.modifier) == -1) {
            damage *= attacker.modifier.damage_dealt;
        }
        if (!$scope.set_kb) {
            trainingkb = TrainingKB(target_percent, damage, target.params.weight, kbg, bkb, target.params.gravity, r, angle, in_air);
            vskb = VSKB(target_percent, damage, target.params.weight, kbg, bkb, target.params.gravity, r, stale, attacker_percent, angle, in_air);
        } else {
            trainingkb = new Knockback(bkb * r, angle, target.params.gravity, in_air);
            vskb = new Knockback(bkb * r * Rage(attacker_percent), angle, target.params.gravity, in_air);
        }
        var at_kb_dealt = attacker.modifier.kb_dealt;
        if (attacker.modifier.name == "Buster") {
            //Buster KB dealt is based on target weight and base damage (Result could be wrong, unknown formula)
            at_kb_dealt -= (((1.7 * (target.params.weight - 68) / (130 - 68)) / 100) * (base_damage / 11));
        }
        base_damage *= attacker.modifier.damage_dealt * target.modifier.damage_taken;
        trainingkb.addModifier(at_kb_dealt);
        trainingkb.addModifier(target.modifier.kb_received);
        vskb.addModifier(at_kb_dealt);
        vskb.addModifier(target.modifier.kb_received);
        trainingkb.bounce(bounce);
        vskb.bounce(bounce);
        var traininglist = List([base_damage, Hitlag(base_damage, $scope.is_projectile ? 0 : hitlag, 1, 1), Hitlag(base_damage, hitlag, HitlagElectric($scope.hitlag_modifier), HitlagCrouch($scope.kb_modifier)), trainingkb.kb, trainingkb.angle, trainingkb.x, trainingkb.y, Hitstun(trainingkb.base_kb), FirstActionableFrame(trainingkb.base_kb), AirdodgeCancel(trainingkb.base_kb), AerialCancel(trainingkb.base_kb)]);
        var vslist = List([StaleDamage(base_damage, stale), Hitlag(base_damage, $scope.is_projectile ? 0 : hitlag, 1, 1), Hitlag(base_damage, hitlag, HitlagElectric($scope.hitlag_modifier), HitlagCrouch($scope.kb_modifier)), vskb.kb, vskb.angle, vskb.x, vskb.y, Hitstun(vskb.base_kb), FirstActionableFrame(vskb.base_kb), AirdodgeCancel(vskb.base_kb), AerialCancel(vskb.base_kb)]);
        traininglist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(3, 0, new ListItem("Rage", "x" + +Rage(attacker_percent).toFixed(4)));
        if (target.modifier.kb_received != 1) {
            traininglist.splice(3, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
            vslist.splice(4, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
        }
        if (at_kb_dealt != 1) {
            traininglist.splice(3, 0, new ListItem("KB dealt", "x" + +at_kb_dealt.toFixed(4)));
            vslist.splice(4, 0, new ListItem("KB dealt", "x" + +at_kb_dealt.toFixed(4)));
        }
        if (attacker.name == "Lucario") {
            traininglist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
            vslist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
        }
        if ($scope.is_smash) {
            traininglist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames).toFixed(4)));
            vslist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames).toFixed(4)));
        }
        if (target.modifier.damage_taken != 1) {
            traininglist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
            vslist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
        }
        if (attacker.modifier.damage_dealt != 1) {
            traininglist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
            vslist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
        }
        vslist.splice(0, 0, new ListItem("Stale-move negation", "x" + +StaleNegation(stale).toFixed(4)));
        
        traininglist.push(new ListItem("Tumble", trainingkb.tumble ? "Yes" : "No"));
        vslist.push(new ListItem("Tumble", vskb.tumble ? "Yes" : "No"))
        traininglist.push(new ListItem("Can Jab lock", trainingkb.can_jablock ? "Yes" : "No"));
        vslist.push(new ListItem("Can Jab lock", vskb.can_jablock ? "Yes" : "No"))

        $scope.training = traininglist;
        $scope.vs = vslist;
    };

    $scope.update();
});



