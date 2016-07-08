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
    $scope.hitbox_frame_cond = "=";
    $scope.base_damage_cond = "=";

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

    $scope.filteredMoves = [];

    $scope.hitbox_eval = function (value1, value2, value3) {
        switch ($scope.hitbox_frame_cond) {
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
    };

    $scope.base_damage_eval = function (value1, value2, value3) {
        switch ($scope.base_damage_cond) {
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
    };
    
    $scope.update = function () {
        $scope.filteredMoves = [];
        var hitbox_start = parseFloat($scope.hitbox_frame);
        var hitbox_start2 = parseFloat($scope.hitbox_frame2);
        var base_damage = parseFloat($scope.base_damage);
        var base_damage2 = parseFloat($scope.base_damage2);
        $scope.moves.forEach(function (move, index) {
            if (move.name.toLowerCase().includes($scope.name.toLowerCase()) && 
                $scope.hitbox_eval(move.hitbox_start,hitbox_start, hitbox_start2) && 
                $scope.base_damage_eval(move.base_damage, base_damage, base_damage2)) {
                var name = CharacterId.getName($scope.charactersId, move.character);
                if (name != "") {
                    $scope.filteredMoves.push(new FilterListItem(name, move));
                }
            }
        });
    }
});

