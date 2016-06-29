function loadFunctionJSON(path, success, beforeSend, error) {
    $.ajax({
        'async': false,
        'url': path,
        'dataType': 'json',
        'beforeSend': function () {
            if (beforeSend !== undefined) {
                if (beforeSend != null) {
                    beforeSend();
                }
            }
        },
        'success': function(data) {
            success(data);
        },
        'error': function (xhr) {
            if (error !== undefined) {
                if (error != null) {
                    error(xhr);
                }
            }
        }
    });
}

function loadAsyncFunctionJSON(path, success, beforeSend, error) {
    $.ajax({
        'async': true,
        'url': path,
        'dataType': 'json',
        'beforeSend': function () {
            if (beforeSend !== undefined) {
                if (beforeSend != null) {
                    beforeSend();
                }
            }
        },
        'success': function (data) {
            success(data);
        },
        'error': function (xhr) {
            if (error !== undefined) {
                if (error != null) {
                    error(xhr);
                }
            }
        }
    });
}

class MoveParser {
    constructor(name, base_damage, angle, bkb, kbg, hitbox_start, hitbox_end, faf) {
        this.name = name;
        this.angle = angle;
        this.faf = faf;

        this.base_damage = base_damage;
        this.bkb = bkb;
        this.kbg = kbg;
        this.hitbox_start = hitbox_start;
        this.hitbox_end = hitbox_end;
        
        this.count = 1;
        this.moves = [];
        var set_kb = false;

        var damage = [];
        var angles = [];
        var kbgs = [];
        var bkbs = [];
        var fkbs = [];

        if (this.base_damage !== undefined && this.bkb !== undefined && this.kbg !== undefined) {
            if (this.base_damage == "-" || this.base_damage == "" || this.base_damage == "?") {
                this.base_damage = "";
            }
            if (this.angle == "-" || this.angle == "" || this.angle == "?") {
                this.angle = "";
            }
            if (this.bkb == "-" || this.bkb == "" || this.bkb == "?") {
                this.bkb = "";
            }
            if (this.kbg == "-" || this.kbg == "" || this.kbg == "?") {
                this.kbg = "";
            }
            if (this.base_damage.includes("/") || this.bkb.includes("/") || this.kbg.includes("/")) {
                //multiple hitboxes
                //console.debug(this.name + " has multiple hitboxes");
                //working on this
            } else {
                //single hitbox
                //console.debug(this.name + " is valid");
                if (bkb.includes("W: ")) {
                    set_kb = true;
                    this.bkb = bkb.replace("W: ", "");
                }
                //console.debug(this);
                if (this.base_damage == "" && this.angle == "" && this.bkb == "" && this.kbg == "") {

                } else {
                    this.moves.push(new Move(0, this.name, parseFloat(this.base_damage), parseFloat(this.angle), parseFloat(this.bkb), parseFloat(this.kbg), set_kb, 0, 0, 0));
                }
            }

        } else {
            this.moves.push(new Move(0, this.name, 0, parseFloat(this.angle),0,0,false,0,0,0).invalidate());
        }

    }
}

class Move {
    constructor(id, name, base_damage, angle, bkb, kbg, set_kb, hitbox_start, hitbox_end, faf) {
        this.id = id;
        this.name = name;
        this.base_damage = base_damage;
        this.angle = angle;
        this.bkb = bkb;
        this.kbg = kbg;
        this.set_kb = set_kb;
        this.hitbox_start = hitbox_start;
        this.hitbox_end = hitbox_end;
        this.faf = faf;
        this.valid = true;

        this.invalidate = function () {
            this.valid = false;
            return this;
        }
    }
};

function getMoveset(attacker, $scope) {
    $scope.moveset = [];
    var api_name = attacker.api_name.toLowerCase().replace("and", "").replace("-", "").split(".").join("").split(" ").join("");
    loadFunctionJSON("http://api.kuroganehammer.com/api/characters/name/" + api_name, function (character) {
        if (character != null) {
            var id = character.id;
            var moveset = loadFunctionJSON("http://api.kuroganehammer.com/api/Characters/" + id + "/moves", function (moveset) {
                if (moveset != null) {
                    var moves = [];
                    var count = 1;
                    for (var i = 0; i < moveset.length; i++) {
                        var move = moveset[i];
                        var parser = new MoveParser(move.name, move.baseDamage, move.angle, move.baseKnockBackSetKnockback, move.knockbackGrowth, move.hitboxActive, move.hitboxActive, move.firstActionableFrame);
                        for (var c = 0; c < parser.moves.length; c++) {
                            var m = parser.moves[c];
                            m.id = count;
                            moves.push(m);
                            count++;
                        }
                    }
                    moves.unshift(new Move(0,"Not selected",0,0,0,0,false,0,0,0).invalidate());
                    $scope.moveset = moves;
                } else {
                    $scope.moveset = [new Move(0, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
                }
            },
            function () {
                //$scope.moveset = [new Move(0, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
            }, function () {
                $scope.moveset = [new Move(0, "Couldn't get attacks", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
            });
        } else {
            $scope.moveset = [new Move(0, "Couldn't access API", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
        }
    }, function () {
        $scope.moveset = [new Move(0, "Loading...", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
    }, function () {
        $scope.moveset = [new Move(0, "Couldn't access API", 0, 0, 0, 0, false, 0, 0, 1).invalidate()];
    });
    
}