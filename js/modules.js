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
    $scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.hitlag_modifier = "none";
    $scope.hitlag = hitlag;
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
        KBModifier($scope.kb_modifier);
        var damage = base_damage;
        if (attacker.name == "Lucario") {
            damage *= Aura(attacker_percent);
        }
        if (target.modifier.damage_taken < 1) {
            damage *= target.modifier.damage_taken;
        }
        trainingkb = TrainingKB(target_percent, damage, attacker.params.weight, kbg, bkb, attacker.params.gravity, r, angle, in_air);
        vskb = VSKB(target_percent, damage, attacker.params.weight, kbg, bkb, attacker.params.gravity, r, stale, attacker_percent, angle, in_air);
        base_damage *= attacker.modifier.damage_dealt * target.modifier.damage_taken;
        trainingkb.addModifier(attacker.modifier.kb_dealt);
        trainingkb.addModifier(target.modifier.kb_received);
        vskb.addModifier(attacker.modifier.kb_dealt);
        vskb.addModifier(target.modifier.kb_received);
        var traininglist = List([base_damage, Hitlag(base_damage, hitlag, HitlagElectric($scope.hitlag_modifier), HitlagCrouch($scope.kb_modifier)), trainingkb.kb, trainingkb.x, trainingkb.y, trainingkb.angle, Hitstun(trainingkb.kb), AirdodgeCancel(trainingkb.kb), AerialCancel(trainingkb.kb)]);
        var vslist = List([StaleDamage(base_damage, stale), Hitlag(base_damage, hitlag, HitlagElectric($scope.hitlag_modifier), HitlagCrouch($scope.kb_modifier)), vskb.kb, vskb.x, vskb.y, vskb.angle, Hitstun(vskb.kb), AirdodgeCancel(vskb.kb), AerialCancel(vskb.kb)]);
        traininglist.splice(1, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(1, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(1, 0, new ListItem("Rage", "x" + +Rage(attacker_percent).toFixed(4)));
        if (target.modifier.kb_received != 1) {
            traininglist.splice(1, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
            vslist.splice(2, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
        }
        if (attacker.modifier.kb_received != 1) {
            traininglist.splice(1, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
            vslist.splice(2, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
        }
        if (attacker.name == "Lucario") {
            traininglist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
            vslist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
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
        
        $scope.training = traininglist;
        $scope.vs = vslist;
    };

    $scope.update();
});



