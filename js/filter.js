class FilterListItem {
    constructor(character, move) {
        this.character = character.name;
        this.move = move;
        if (character.color !== undefined) {
            this.color = character.color;
        } else {
            this.color = "transparent";
        }
        this.addStyle = function (style) {
            this.style = style;
            return this;
        }
        this.style = "";
        var string = "";
        for(var i=0;i<this.move.hitboxActive.length;i++){
            string += (this.move.hitboxActive[i].start != 0 ? (isNaN(this.move.hitboxActive[i].start) ? "" : this.move.hitboxActive[i].start) : "") + ((this.move.hitboxActive[i].start != 0 || this.move.hitboxActive[i].end != 0 ) ? (!(!isNaN(this.move.hitboxActive[i].start) && this.move.hitboxActive[i].end == 0) ? "-" : "") : "") + (this.move.hitboxActive[i].end != 0 ? (isNaN(this.move.hitboxActive[i].end) ? "" : this.move.hitboxActive[i].end) : "");
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
        this.move.base_damage_print = this.move.base_damage;
        if (isNaN(this.move.base_damage)) {
            this.move.base_damage_print = "-";
        } else {
            if (this.move.preDamage != 0) {
                this.move.base_damage_print = this.move.preDamage + ", " + this.move.base_damage;
            }else{
                if (this.move.counterMult != 0) {
                    this.move.base_damage_print = this.move.base_damage + " (Counter: x" + this.move.counterMult + ")";
                }
            }
        }
        this.move.wbkb_print = this.move.wbkb ? "Yes" : "No";

    }
};

class CharacterId {
    constructor(name, id, color) {
        this.name = name;
        this.id = id;
        this.color = color;
    }

    static getName(list, id){
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                return list[i];
            }
        }
        return null;
    }

    static getId(list, name) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == name) {
                return list[i].id;
            }
        }
        return -1;
    }
};

class Condition {
    constructor(condition) {
        this.condition = condition.toLowerCase();
        this.type = "Name";
        if (this.condition.includes("character:")) {
            this.type = "Character";

            this.eval = function (move) {
                return CharacterId.getName(characterListId, move.character).toLowerCase() == this.condition.toLowerCase().split("character:")[1];
            }

        } else {
            if (this.condition.includes("type:")) {
                this.type = "Type";

                this.eval = function (move) {
                    var types = move.type.split(",");
                    for (var i = 0; i < types.length; i++) {
                        if(types[i].toLowerCase() == this.condition.toLowerCase().split("type:")[1]){
                            return true;
                        }
                    }
                    return false;
                }

            } else {

                this.eval = function (move) {
                    return move.name.toLowerCase().includes(this.condition);
                }

            }
        }
    }
};

class NameFilter {
    constructor(name) {
        this.name = name.toLowerCase().replace(/\&/gi, ",&");
        var conditions = this.name.split(",");
        this.OrConditions = [];
        this.AndConditions = [];
        this.NotConditions = [];
        for (var i = 0; i < conditions.length; i++) {
            if (conditions[i] == "" || conditions[i] == "-" || conditions[i] == "&") {
                continue;
            }
            if (conditions[i].charAt(0) == "&") {
                this.AndConditions.push(new Condition(conditions[i].replace("&", "").trim()));
            } else {
                if (conditions[i].charAt(0) == "-") {
                    this.NotConditions.push(new Condition(conditions[i].replace("-", "").trim()));
                } else {
                    this.OrConditions.push(new Condition(conditions[i].trim()));
                }
            }
        }

        this.check = function (move) {
            
            for (var i = 0; i < this.AndConditions.length; i++) {
                if (!this.AndConditions[i].eval(move)) {
                    return false;
                }
            }
            for (var i = 0; i < this.NotConditions.length; i++) {
                if (this.NotConditions[i].eval(move)) {
                    return false;
                }
            }
            for (var i = 0; i < this.OrConditions.length; i++) {
                if (this.OrConditions[i].eval(move)) {
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

var characterListId = [];


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
    $scope.wbkb_any = true;

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
    $scope.wbkb = false;

    $scope.filteredMoves = [];
    $scope.noResults = 0;

    $scope.compare = function (cond, value1, value2, value3) {
        if (isNaN(value1) && isNaN(value2)) {
            return true;
        }
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
        characterListId = $scope.charactersId;
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
                if (!$scope.wbkb_any) {
                    if (move.wbkb != $scope.wbkb) {
                        return;
                    }
                }
                if (!nameConditions.check(move)) {
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
                if (name != null) {
                    $scope.filteredMoves.push(new FilterListItem(name, move));
                }
                return;
                
            }
        });
        $scope.noResults = $scope.filteredMoves.length;
    }
});

