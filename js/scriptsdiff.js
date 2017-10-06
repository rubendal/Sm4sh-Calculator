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
        'url': "./ScriptsDiff/" + char + "/diff.json",
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
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

var character = names[0];
var gamename = getCharGameName(character);
var scripts = getScripts(gamename);
var script = scripts.scripts[0];

var app = angular.module('scripts', []);


app.controller('scripts', ['$scope', '$sce', function ngBindHtmlCtrl($scope, $sce) {
	$scope.app = 'scriptdiff';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

    $scope.characters = names;
	$scope.character = character;

	$scope.scripts = scripts.scripts;
	$scope.script = JSON.stringify($scope.scripts[0]);

	$scope.ignoreNew = true;

	$scope.v1 = "";
	$scope.v2 = "";

	$scope.ver1 = "3DS 1.0.0";
	$scope.ver2 = "1.1.7";


    $scope.updateScript = function () {
		script = JSON.parse($scope.script);
		$scope.v1 = $sce.trustAsHtml(script.v1);
		$scope.v2 = $sce.trustAsHtml(script.v2);
	};

	$scope.updateFilter = function () {
		scripts = getScripts(gamename);
		if (!$scope.ignoreNew) {
			$scope.scripts = scripts.scripts;
			$scope.script = JSON.stringify($scope.scripts[0]);
			$scope.updateScript();
			return;
		}
		var list = [];
		for (var i = 0; i < scripts.scripts.length; i++) {
			if (!scripts.scripts[i].newScript) {
				list.push(scripts.scripts[i]);
			}
		}
		$scope.scripts = list;
		$scope.script = JSON.stringify($scope.scripts[0]);
		$scope.updateScript();
	}

    $scope.updateCharacter = function () {
        character = $scope.character;
        gamename = getCharGameName(character);
		scripts = getScripts(gamename);

		switch (character) {
			case "Mewtwo":
			case "Lucas":
			case "Ryu":
			case "Roy":
				$scope.ver1 = "1.0.8";
				break;
			case "Cloud":
				$scope.ver1 = "1.1.3";
				break;
			case "Corrin":
			case "Bayonetta":
				$scope.ver1 = "1.1.4";
				break;
			default:
				$scope.ver1 = "3DS 1.0.0";
				break;
		}

		$scope.updateFilter();
        
    };

    $scope.updateCharacter();

}]);