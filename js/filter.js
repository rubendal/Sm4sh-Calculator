class FilterListItem {
    constructor(character, move) {
        this.character = character;
        this.move = move;
        this.addStyle = function (style) {
            this.style = style;
            return this;
        }
        this.style = "";
        if (isNaN(this.move.hitbox_start)) {
            this.move.hitbox_start = "-";
        }
        if (isNaN(this.move.hitbox_end)) {
            this.move.hitbox_end = "-";
        }
        if (isNaN(this.move.bkb)) {
            this.move.bkb = "-";
        }
        if (isNaN(this.move.kbg)) {
            this.move.kbg = "-";
        }
        if (isNaN(this.move.angle)) {
            this.move.angle = "-";
        }
        if (isNaN(this.move.base_damage)) {
            this.move.base_damage = "-";
        }
        this.move.set_kb_print = this.move.set_kb ? "Yes" : "No";
    }
};

class CharacterId {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    static getName(list, id){
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i].name;
            }
        }
        return "";
    }
};


var filter_app = angular.module('filter', []);
filter_app.controller('filter', function ($scope) {
    loadGitHubData();

    $scope.name = "";
    $scope.hitbox_frame_cond = "ignore";
    $scope.base_damage_cond = "ignore";
    $scope.angle_cond = "ignore";
    $scope.bkb_cond = "ignore";
    $scope.kbg_cond = "ignore";
    $scope.set_kb_ignore = true;

    $scope.updateStatus = function (status) {
        $scope.status = status;
    }

    $scope.ready = function () {
        if ($scope.charactersId.length != 0 && $scope.moves.length != 0) {
            $scope.status = "";
            $scope.loading = { "display": "none" };
            $scope.filter_interface = { "display": "block" };
        } else {
            if ($scope.charactersId.length != 0) {
                $scope.status = "Characters IDs loaded, parsing moves...";
            } else {
                $scope.status = "Moves loaded, Loading characters...";
            }
        }
    }

    $scope.status = "Loading...";
    $scope.loading = { "display": "block", "margin-left" : "10px" };
    $scope.filter_interface = { "display": "none" };

    getCharactersId(KHcharacters, $scope);
    getAllMoves($scope);

    $scope.hitbox_frame = 0;
    $scope.hitbox_frame2 = 0;
    $scope.base_damage = 0;
    $scope.base_damage2 = 0;
    $scope.angle = 0;
    $scope.angle2 = 0;
    $scope.bkb = 0;
    $scope.bkb2 = 0;
    $scope.kbg = 0;
    $scope.kbg2 = 0;
    $scope.set_kb = false;

    $scope.filteredMoves = [];

    $scope.compare = function (cond, value1, value2, value3) {
        switch (cond) {
            case "<":
                return value1 < value2;
                break;
            case ">":
                return value1 > value2;
                break;
            case "<=":
                return value1 <= value2;
                break;
            case ">=":
                return value1 >= value2;
                break;
            case "between":
                return value1 >= value2 && value1 <= value3;
            case "ignore":
                return true;
        }
        return value1 == value2;
    }

    
    $scope.update = function () {
        $scope.filteredMoves = [];
        var hitbox_start = parseFloat($scope.hitbox_frame);
        var hitbox_start2 = parseFloat($scope.hitbox_frame2);
        var base_damage = parseFloat($scope.base_damage);
        var base_damage2 = parseFloat($scope.base_damage2);
        var angle = parseFloat($scope.angle);
        var angle2 = parseFloat($scope.angle2);
        var bkb = parseFloat($scope.bkb);
        var bkb2 = parseFloat($scope.bkb2);
        var kbg = parseFloat($scope.kbg);
        var kbg2 = parseFloat($scope.kbg2);
        $scope.moves.forEach(function (move, index) {
            if (move.name.toLowerCase().includes($scope.name.toLowerCase()) && 
                $scope.compare($scope.hitbox_frame_cond, move.hitbox_start, hitbox_start, hitbox_start2) &&
                $scope.compare($scope.base_damage_cond, move.base_damage, base_damage, base_damage2) &&
                $scope.compare($scope.angle_cond, move.angle, angle, angle2) &&
                $scope.compare($scope.bkb_cond, move.bkb, bkb, bkb2) &&
                $scope.compare($scope.kbg_cond, move.kbg, kbg, kbg2)) {
                if (!$scope.set_kb_ignore) {
                    if (move.set_kb != $scope.set_kb) {
                        return;
                    }
                }
                var name = CharacterId.getName($scope.charactersId, move.character);
                if (name != "") {
                    $scope.filteredMoves.push(new FilterListItem(name, move));
                }
            }
        });
    }
});

