var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "lizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner", "items", "enemies"];
var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Items", "Enemies"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Items", "Enemies"];

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length-2; i++) {
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

function loadJSONPath(path) {
	var json = null;
	$.ajax({
		'async': false,
		'url': path,
		'dataType': 'json',
		'success': function (data) {
			json = data;
		}
	});
	return json;
}

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
    var types = [];
    if (s.script != null) {
        types.push("Game");
    }
    if (s.expression != null) {
        types.push("Expression");
    }
    if (s.effect != null) {
        types.push("Effect");
    }
    if (s.sound != null) {
        types.push("Sound");
    }
    return types;
};

var character = names[0];
var gamename = getCharGameName(character);
var scripts = getScripts(gamename);
var script = scripts[0];
var onlyHitboxes = true;

var appSelection = [
	{ appName: "calculator", title: "Calculator", link: "./index.html" },
	{ appName: "kocalculator", title: "KO Calculator", link: "./kocalc.html" },
	{ appName: "kbcalculator", title: "Percentage Calculator", link: "./percentcalc.html" },
	{ appName: "movesearch", title: "Move Search", link: "./movesearch.html" },
	{ appName: "scriptviewer", title: "Script Viewer", link: "./scripts.html" },
	{ appName: "scriptdiff", title: "Script Diff Viewer", link: "./scriptdiff.html" },
	{ appName: "scriptsearch", title: "Script Search", link: "./scriptsearch.html" },
	{ appName: "params", title: "Param Viewer", link: "./params.html" },
	{ appName: "mscviewer", title: "MSC Script Viewer", link: "./msc.html" },
	{ appName: "mscsearch", title: "MSC Script Search", link: "./mscsearch.html" }
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
app.controller('scripts', function ($scope) {
	$scope.app = 'scriptviewer';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

    $scope.characters = names;
    $scope.character = character;

    $scope.scripts = filter();
	$scope.script = 0 + "";

	$scope.onlyHitboxes = onlyHitboxes;

	$scope.sf_code_css = { display: "none" };

    $scope.types = getTypes($scope.scripts[$scope.script]);
    if ($scope.types.length > 0) {
        $scope.type = $scope.types[0];
    }

    $scope.code = script.script;

    $scope.index = 0;

	$scope.updateScript = function () {
		script = $scope.scripts[$scope.script];
        $scope.types = getTypes(script);
        $scope.type = $scope.types[0];
        $scope.updateType();
		$scope.index = script.id;
		if (script.scriptHex == null) {
			$scope.sf_code = "";
			$scope.sf_code_css = { "display": "none" };
		} else {
			$scope.sf_code = script.scriptHex.replace(/{|}/g, "").replace(/(\r\n)+/g, "\n"); //.replace(/  +/g, "");
			$scope.sf_code_css = { "display": "inline" };
		}
    };

    $scope.updateCharacter = function () {
        character = $scope.character;
        gamename = getCharGameName(character);
        scripts = getScripts(gamename);
        onlyHitboxes = $scope.onlyHitboxes;
        $scope.scripts = filter();
        $scope.script = 0 + "";
        $scope.types = getTypes($scope.scripts[$scope.script]);
        $scope.type = $scope.types[0];
        $scope.updateScript();
    };

    $scope.updateFilter = function () {
        onlyHitboxes = $scope.onlyHitboxes;
        scripts = getScripts(gamename);
        $scope.scripts = filter();
        $scope.script = 0 + "";
		$scope.types = getTypes($scope.scripts[$scope.script]);
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

	$scope.copyCode = function () {
		var textArea = document.getElementById("copyscriptbox");
		textArea.select();
		document.execCommand("Copy");
		
	};

	$scope.updateCharacter();

	// Themes

	var styleList = loadJSONPath("./css/themes.json");

	$scope.themes = styleList;

	$scope.theme = "Normal";

	function changeStyle(style) {
		for (var i = 0; i < styleList.length; i++) {
			if (styleList[i].name == style) {
				$("#mainStyle").attr("href", styleList[i].main);
				if (styleList[i].visualSettings) {
					settings.stick_color = styleList[i].visualSettings.stick_color;
					settings.visualizer_colors.background = styleList[i].visualSettings.visualizer_bg;
				}
				else {
					settings.stick_color = defaultStyle.visualSettings.stick_color;
					settings.visualizer_colors.background = defaultStyle.visualSettings.visualizer_bg;
				}
				return;
			}
		}

	}

	$scope.changeTheme = function () {
		changeStyle($scope.theme);
	}

	// Themes end

});