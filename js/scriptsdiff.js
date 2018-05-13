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
        'url': "./ScriptsDiff/" + char + "/diff.json",
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

function GetPatches(s) {
	var list = [];
	
	for (var i = 0; i < s.length; i++) {
		if (list.indexOf(s[i].patch1 + " -> " + s[i].patch2) == -1) {
			list.push(s[i].patch1 + " -> " + s[i].patch2);
		}
	}
	return list;
}

function filter(s) {
	var list = [];

	for (var i = 0; i < s.length; i++) {
		
		if (s[i].patch1 + " -> " + s[i].patch2 == patch) {
			list.push(s[i]);
		}
	}
	return list;
};

var character = names[0];
var gamename = getCharGameName(character);
var scripts = getScripts(gamename);
var script = scripts.scripts[0];
var patch = script.patch1 + " -> " + script.patch2;

var sections = ["Game", "Expression", "Effect", "Sound"];

var app = angular.module('scripts', []);


app.controller('scripts', ['$scope', '$sce', function ngBindHtmlCtrl($scope, $sce) {
	$scope.app = 'scriptdiff';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

    $scope.characters = names;
	$scope.character = character;


	$scope.scripts = scripts.scripts;
	$scope.script = 0 + "";

	$scope.patches = GetPatches($scope.scripts);
	$scope.patch = $scope.patches[0];
	patch = $scope.patch;

	$scope.ignoreNew = true;

	script = $scope.scripts[$scope.script];

	$scope.section = "Game";
	$scope.sections = ["Game", "Expression", "Effect", "Sound"];

	$scope.ver1 = script.patch1;
	$scope.ver2 = script.patch2;

	$scope.v1 = "";
	$scope.v2 = "";

	$scope.sf_code_css = { display: "none" };
	$scope.sf_code2_css = { display: "none" };

	$scope.sf_code = "";
	$scope.sf_code2 = "";

	$scope.updateScript = function () {
		script = $scope.scripts[$scope.script];
		$scope.v1 = $sce.trustAsHtml(script.v1);
		$scope.v2 = $sce.trustAsHtml(script.v2);
		$scope.ver1 = script.patch1;
		$scope.ver2 = script.patch2;

		if (script.sf1 == null) {
			$scope.sf_code = "";
			$scope.sf_code_css = { "display": "none" };
		} else {
			$scope.sf_code = script.sf1.replace(/{|}/g, "").replace(/(\r\n)+/g, "\n"); //.replace(/  +/g, "");
			$scope.sf_code_css = { "display": "inline" };
		}

		if (script.sf2 == null) {
			$scope.sf_code2 = "";
			$scope.sf_code2_css = { "display": "none" };
		} else {
			$scope.sf_code2 = script.sf2.replace(/{|}/g, "").replace(/(\r\n)+/g, "\n"); //.replace(/  +/g, "");
			$scope.sf_code2_css = { "display": "inline" };
		}
	};

	$scope.updateFilter = function () {
		patch = $scope.patch;
		//scripts = getScripts(gamename);

		if ($scope.section == "Game") {
			$scope.scripts = scripts.scripts;
		} else if ($scope.section == "Expression") {
			$scope.scripts = scripts.expression;
		} else if ($scope.section == "Effect") {
			$scope.scripts = scripts.effect;
		} else {
			$scope.scripts = scripts.sound;
		}

		$scope.scripts = filter($scope.scripts);
		$scope.script = 0 + "";
		$scope.updateScript();
		//scripts = getScripts(gamename);
		//if (!$scope.ignoreNew) {
		//	$scope.scripts = scripts.scripts;
		//	$scope.script = JSON.stringify($scope.scripts[0]);
		//	$scope.updateScript();
		//	return;
		//}
		//var list = [];
		//for (var i = 0; i < scripts.scripts.length; i++) {
		//	if (!scripts.scripts[i].newScript) {
		//		list.push(scripts.scripts[i]);
		//	}
		//}
		//$scope.scripts = list;
		//$scope.script = JSON.stringify($scope.scripts[0]);
		//$scope.updateScript();
	}

    $scope.updateCharacter = function () {
        character = $scope.character;
        gamename = getCharGameName(character);
		scripts = getScripts(gamename);

		$scope.section = "Game";

		$scope.sections = ["Game"];

		if (scripts.expression.length > 0)
			$scope.sections.push("Expression");

		if (scripts.effect.length > 0)
			$scope.sections.push("Effect");

		if (scripts.sound.length > 0)
			$scope.sections.push("Sound");

		$scope.scripts = scripts.scripts;
		$scope.script = 0 + "";

		$scope.patches = GetPatches($scope.scripts);
		$scope.patch = $scope.patches[0];
		patch = $scope.patch;
		script = $scope.scripts[$scope.script];

		$scope.ver1 = script.patch1;
		$scope.ver2 = script.patch2;

		$scope.updateFilter();
        
	};

	$scope.updateSection = function () {
		if ($scope.section == "Game") {
			$scope.scripts = scripts.scripts;
		} else if ($scope.section == "Expression") {
			$scope.scripts = scripts.expression;
		} else if ($scope.section == "Effect") {
			$scope.scripts = scripts.effect;
		} else {
			$scope.scripts = scripts.sound;
		}
		//$scope.scripts = scripts.scripts;
		$scope.script = 0 + "";

		$scope.patches = GetPatches($scope.scripts);
		$scope.patch = $scope.patches[0];
		patch = $scope.patch;
		script = $scope.scripts[$scope.script];

		$scope.ver1 = script.patch1;
		$scope.ver2 = script.patch2;

		$scope.updateFilter();
	}

	$scope.copyCode = function () {
		var textArea = document.getElementById("copyscriptbox");
		textArea.select();
		document.execCommand("Copy");
	};

	$scope.copyCode2 = function () {
		var textArea = document.getElementById("copyscriptbox2");
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

}]);