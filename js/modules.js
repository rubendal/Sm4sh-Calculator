var app = angular.module('calculator', []);
app.controller('calculator', function ($scope) {
    $scope.characters = characters.sort();
    $scope.attackerValue = attacker.name;
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
    $scope.training = List([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    $scope.vs = List([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    $scope.update = function () {
        attacker = new Character($scope.attackerValue);
        target = new Character($scope.targetValue);
        attacker_percent = parseFloat($scope.attackerPercent);
        target_percent = parseFloat($scope.targetPercent);
        base_damage = parseFloat($scope.baseDamage);
        angle = parseFloat($scope.angle);
        in_air = $scope.in_air;
        bkb = parseFloat($scope.bkb);
        kbg = parseFloat($scope.kbg);
        stale = parseFloat($scope.stale);
        KBModifier($scope.kb_modifier);
        trainingkb = TrainingKB(target_percent, base_damage, attacker.params.weight, kbg, bkb, attacker.params.gravity, r, angle, in_air);
        vskb = VSKB(target_percent, base_damage, attacker.params.weight, kbg, bkb, attacker.params.gravity, r, stale, attacker_percent, angle, in_air);
        $scope.training = List([base_damage, trainingkb.kb, trainingkb.x, trainingkb.y, trainingkb.angle, Hitstun(trainingkb.kb), AirdodgeCancel(trainingkb.kb), AerialCancel(trainingkb.kb)]);
        $scope.vs = List([StaleDamage(base_damage, stale), vskb.kb, vskb.x, vskb.y, vskb.angle, Hitstun(vskb.kb), AirdodgeCancel(vskb.kb), AerialCancel(vskb.kb)]);
        console.debug(in_air);
    };
});

