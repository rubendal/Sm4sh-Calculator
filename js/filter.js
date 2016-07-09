class FilterListItem {
    constructor(character, move) {
        this.character = character;
        this.move = move;
        this.addStyle = function (style) {
            this.style = style;
            return this;
        }
        this.style = "";
        var string = "";
        for(var i=0;i<this.move.hitboxActive.length;i++){
            string += (this.move.hitboxActive[i].start != 0 ? (isNaN(this.move.hitboxActive[i].start) ? "" : this.move.hitboxActive[i].start) : "") + ((this.move.hitboxActive[i].start != 0 || this.move.hitboxActive[i].end != 0) ? "-" : "") + (this.move.hitboxActive[i].end != 0 ? (isNaN(this.move.hitboxActive[i].end) ? "" : this.move.hitboxActive[i].end) : "");
            if(i<this.move.hitboxActive.length-1){
                string+=",";
            }
        }
        this.move.hitboxActiveString = string;
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

class NameFilter {
    constructor(name) {
        this.name = name.toLowerCase().replace(/\&/gi, ",&");
        var conditions = this.name.split(",");
        this.OrConditions = [];
        this.AndConditions = [];
        this.NotConditions = [];
        for (var i = 0; i<conditions.length; i++) {
            if (conditions[i] == "" || conditions[i] == "-" || conditions[i] == "&") {
                conditions.splice(i, 1);
                continue;
            }
            if (conditions[i].charAt(0) == "&") {
                this.AndConditions.push(conditions[i].replace("&","").trim());
            } else {
                if (conditions[i].charAt(0) == "-") {
                    this.NotConditions.push(conditions[i].replace("-", "").trim());
                } else {
                    this.OrConditions.push(conditions[i].trim());
                }
            }

        }

        this.check = function (name) {
            for (var i = 0; i < this.AndConditions.length; i++) {
                if (!name.includes(this.AndConditions[i])) {
                    return false;
                }
            }
            for (var i = 0; i < this.NotConditions.length; i++) {
                if (name.includes(this.NotConditions[i])) {
                    return false;
                }
            }
            for (var i = 0; i < this.OrConditions.length; i++) {
                if (name.includes(this.OrConditions[i])) {
                    return true;
                }
            }
            if (this.OrConditions.length == 0) {
                return true;
            }
            return false;
        }
    }
};


var filter_app = angular.module('filter', []);
filter_app.controller('filter', function ($scope) {
    loadGitHubData();

    $scope.name = "";
    $scope.hitbox_start_cond = "any";
    $scope.hitbox_frame_cond = true;
    $scope.base_damage_cond = "any";
    $scope.angle_cond = "any";
    $scope.bkb_cond = "any";
    $scope.kbg_cond = "any";
    $scope.set_kb_any = true;

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
                $scope.status = "Parsing moves...";
            } else {
                $scope.status = "Moves parsed, Loading characters...";
            }
        }
    }

    $scope.status = "Loading...";
    $scope.loading = { "display": "block", "margin-left" : "10px" };
    $scope.filter_interface = { "display": "none" };

    getCharactersId(KHcharacters, $scope);
    getAllMoves($scope);

    $scope.hitbox_start = 0;
    $scope.hitbox_start2 = 0;
    $scope.hitbox_frame = 0;
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
            case "any":
                return true;
        }
        return value1 == value2;
    }

    
    $scope.update = function () {
        $scope.filteredMoves = [];
        var hitbox_start = parseFloat($scope.hitbox_start);
        var hitbox_start2 = parseFloat($scope.hitbox_start2);
        var hitbox_frame = parseFloat($scope.hitbox_frame);
        var hitbox_frame2 = parseFloat($scope.hitbox_frame2);
        var base_damage = parseFloat($scope.base_damage);
        var base_damage2 = parseFloat($scope.base_damage2);
        var angle = parseFloat($scope.angle);
        var angle2 = parseFloat($scope.angle2);
        var bkb = parseFloat($scope.bkb);
        var bkb2 = parseFloat($scope.bkb2);
        var kbg = parseFloat($scope.kbg);
        var kbg2 = parseFloat($scope.kbg2);
        var nameConditions = new NameFilter($scope.name);

        $scope.moves.forEach(function (move, index) {
            if ($scope.compare($scope.base_damage_cond, move.base_damage, base_damage, base_damage2) &&
                $scope.compare($scope.angle_cond, move.angle, angle, angle2) &&
                $scope.compare($scope.bkb_cond, move.bkb, bkb, bkb2) &&
                $scope.compare($scope.kbg_cond, move.kbg, kbg, kbg2)) {
                if (!$scope.set_kb_any) {
                    if (move.set_kb != $scope.set_kb) {
                        return;
                    }
                }
                if (!nameConditions.check(move.name.toLowerCase())) {
                    return;
                }
                for (var i = 0; i < move.hitboxActive.length; i++) {
                    if ($scope.compare($scope.hitbox_start_cond, move.hitboxActive[i].start, hitbox_start, hitbox_start2)) {
                        i = move.hitboxActive.length + 1;
                    }
                    if (i == move.hitboxActive.length - 1) {
                        return;
                    }
                }
                if (!$scope.hitbox_frame_cond) {
                    for (var i = 0; i < move.hitboxActive.length; i++) {
                        if ($scope.compare("between", hitbox_frame, move.hitboxActive[i].start, move.hitboxActive[i].end)) {
                            i = move.hitboxActive.length + 1;
                        }
                        if (i == move.hitboxActive.length - 1) {
                            return;
                        }
                    }
                }
                var name = CharacterId.getName($scope.charactersId, move.character);
                if (name != "") {
                    $scope.filteredMoves.push(new FilterListItem(name, move));
                }
                return;
                
            }
        });
    }
});

