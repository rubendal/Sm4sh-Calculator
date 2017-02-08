var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "lizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner"];
var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length; i++) {
        list.push({ 'character': characters[i], 'name': names[i], 'game': gameNames[i] });
    }
    list.sort(function (a, b) {
        return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
    });
    for (var i = 0; i < list.length; i++) {
        characters[i] = list[i].character;
        names[i] = list[i].name;
        gameNames[i] = list[i].game;
    }
}

sorted_characters();

function getCharGameName(name) {
    return gameNames[names.indexOf(name)];
};

function getScripts(char) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Scripts/" + char + "/scripts.json",
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
};

function filter() {
    if (!onlyHitboxes) {
        return scripts;
    }
    var list = [];
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i].hitbox) {
            list.push(scripts[i]);
        }
    }
    return list;
};

function getTypes(s) {
    var types = ["Game"];
    var sc = JSON.parse(s);
    if (sc.expression != null) {
        types.push("Expression");
    }
    if (sc.effect != null) {
        types.push("Effect");
    }
    if (sc.sound != null) {
        types.push("Sound");
    }
    return types;
};

var character = "Bayonetta";
var gamename = getCharGameName(character);
var scripts = getScripts(gamename);
var script = scripts[0];
var onlyHitboxes = true;

var app = angular.module('scripts', []);
app.controller('scripts', function ($scope) {
    $scope.app = 'rawscripts';

    $scope.characters = names;
    $scope.character = character;

    $scope.scripts = filter();
    $scope.script = JSON.stringify($scope.scripts[0]);

    $scope.onlyHitboxes = onlyHitboxes;

    $scope.types = getTypes($scope.script);
    $scope.type = $scope.types[0];

    $scope.code = script.script;

    $scope.updateScript = function () {
        script = JSON.parse($scope.script);
        $scope.types = getTypes($scope.script);
        $scope.type = $scope.types[0];
        $scope.code = script.script;
    };

    $scope.updateCharacter = function () {
        character = $scope.character;
        gamename = getCharGameName(character);
        scripts = getScripts(gamename);
        onlyHitboxes = $scope.onlyHitboxes;
        $scope.scripts = filter();
        $scope.script = JSON.stringify($scope.scripts[0]);
        $scope.types = getTypes($scope.script);
        $scope.type = $scope.types[0];
        $scope.updateScript();
    };

    $scope.updateFilter = function () {
        onlyHitboxes = $scope.onlyHitboxes;
        scripts = getScripts(gamename);
        $scope.scripts = filter();
        $scope.script = JSON.stringify($scope.scripts[0]);
        $scope.types = getTypes($scope.script);
        $scope.type = $scope.types[0];
        $scope.updateScript();
    };

    $scope.updateType = function () {
        switch ($scope.type) {
            case "Game":
                $scope.code = script.script;
                break;
            case "Expression":
                $scope.code = script.expression;
                break;
            case "Effect":
                $scope.code = script.effect;
                break;
            case "Sound":
                $scope.code = script.sound;
                break;
        }
    };

    $scope.updateCharacter();

});