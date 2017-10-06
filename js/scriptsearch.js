var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "lizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner", "items"];
var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Items"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Items"];

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length-1; i++) {
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

class CharScript {
    constructor(character, scripts) {
        this.character = character;
        this.scripts = scripts;
    }
};

var allScripts = [];

for (var i = 0; i < gameNames.length; i++) {
    allScripts.push(new CharScript(names[i], getScripts(gameNames[i])));
}

class ScriptResult {
    constructor(character, scriptName, lines, no) {
        this.character = character;
        this.scriptName = scriptName;
        this.lines = lines;
        this.no = no;
        this.matches = "";
        for (var i = 0; i < this.lines.length; i++) {
            this.matches += this.lines[i];
            if (i < this.lines.length - 1) {
                this.matches += "\n\n";
            }
        }
    }
};

var appSelection = [
	{ appName: "calculator", title: "Calculator", link: "./index.html" },
	{ appName: "movesearch", title: "Move Search", link: "./movesearch.html" },
	{ appName: "kbcalculator", title: "Percentage Calculator", link: "./percentcalc.html" },
	{ appName: "kocalculator", title: "KO Calculator", link: "./kocalc.html" },
	{ appName: "scriptviewer", title: "Script Viewer", link: "./scripts.html" },
	{ appName: "scriptdiff", title: "Script Diff Viewer", link: "./scriptdiff.html" },
	{ appName: "scriptsearch", title: "Script Search", link: "./scriptsearch.html" },
	{ appName: "params", title: "Param Viewer", link: "./params.html" }
];

function GetApps(current) {
	var list = [];
	for (var i = 0; i < appSelection.length; i++) {
		if (appSelection[i].appName != current)
			list.push(appSelection[i]);
	}
	return list;
}

var app = angular.module('scripts', []);

app.controller('scriptsearch', function ($scope) {
	$scope.app = "scriptsearch";
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
    $scope.regex = "";
    $scope.name = "";
    $scope.negate = "";
    $scope.results = [];
    $scope.resultLenght = 0;
    $scope.error = "";
    $scope.matches = 0;

    $scope.update = function () {
        $scope.error = "";
        $scope.matches = 0;
        $scope.results = [];
        $scope.resultLenght = 0;
        try{
            var regex = null;
            var name = null;
            var negate = null;
            if ($scope.regex != "") {
                regex = new RegExp($scope.regex);
            }
            if ($scope.name != "") {
                name = new RegExp($scope.name);
            }
            if ($scope.negate != "") {
                negate = new RegExp($scope.negate);
            }
            if (regex == null && negate == null && name == null) {
                return;
            }
            for (var i = 0; i < allScripts.length; i++) {
                for (var j = 0; j < allScripts[i].scripts.length; j++) {
                    if (allScripts[i].scripts[j].script == null) {
                        continue;
                    }
                    var pass = false;
                    var l = allScripts[i].scripts[j].script.split('\n');
                    var lines = [];
                    var no = 0;
                    if (name != null) {
                        if (name.test(allScripts[i].scripts[j].name)) {
                            pass = true;
                        }
                    } else {
                        pass = true;
                    }
                    var matches = false;
                    if (regex == null && negate == null) {
                        matches = true;
                    } else {
                        for (var x = 0; x < l.length; x++) {
                            if (regex != null && negate != null) {
                                if (regex.test(l[x].trim()) && !negate.test(l[x].trim())) {
                                    matches = true;
                                    lines.push(l[x].trim());
                                    no++;
                                }
                            }
                            else {
                                if (regex != null) {
                                    if (regex.test(l[x].trim())) {
                                        matches = true;
                                        lines.push(l[x].trim());
                                        no++;
                                    }
                                }
                                if (negate != null) {
                                    if (!negate.test(l[x].trim())) {
                                        matches = true;
                                        lines.push(l[x].trim());
                                        no++;
                                    }
                                }
                            }
                        }
                    }
                    if (matches && pass) {
                        if (name != null || regex != null || negate != null) {
                            $scope.results.push(new ScriptResult(allScripts[i].character, allScripts[i].scripts[j].name, lines, no));
                            $scope.matches += no;
                        }
                    }
                }
            }
            $scope.resultLenght = $scope.results.length;
        } catch (e) {
            $scope.results = [];
            $scope.resultLenght = 0;
            $scope.matches = 0;
            $scope.error = "Error in regular expression";
        }
    };
});