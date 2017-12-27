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
	if (names.indexOf(name) < 0)
		return null;
    return gameNames[names.indexOf(name)];
};

function getParams(char) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Params/" + char + "/param.json",
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
};

function getJSON(file) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Params/" + file,
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

function getTag(tags, group) {
    for (var i = 0; i < tags.length; i++) {
        if (tags[i].group == group) {
            return tags[i];
        }
    }
    return null;
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

var generalTags = getJSON("tags.json");

var entry;
var group;

var app = angular.module('paramviewer', []);
app.controller('paramviewer', function ($scope) {
	$scope.app = 'params';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;

    $scope.characters = names;
	$scope.character = character;

    $scope.params = getParams(gamename);

	$scope.hasTags = false;

    $scope.groups = $scope.params;
    $scope.group = "0";

    $scope.entries = $scope.params[0].entries;
    $scope.entry = "0";

    $scope.groupTag = "";
    $scope.entryTag = "";

    $scope.param = [];

    $scope.updateEntry = function () {
        entry = $scope.entries[parseInt($scope.entry)];
		$scope.param = entry.values;

		$scope.hasTags = $scope.updateTags();
    };

    $scope.updateGroup = function () {
        group = $scope.groups[parseInt($scope.group)];
        $scope.entries = group.entries;
        $scope.entry = "0";
        $scope.updateEntry();
    };

    $scope.updateCharacter = function () {
        character = $scope.character;
		gamename = getCharGameName(character);
		if (gamename == null)
			gamename = character;
        $scope.params = getParams(gamename);
        $scope.groups = $scope.params;
        $scope.group = "0";

        $scope.entries = $scope.params[parseInt($scope.group)].entries;
        $scope.entry = "0";
        $scope.updateGroup();
    };

    $scope.updateTags = function () {
        var tag = getTag(generalTags, group.group);
        $scope.groupTag = "";
        $scope.entryTag = "";
        if (tag != null) {
            $scope.groupTag = tag.tag;
            if (!tag.allEntries) {
                $scope.entryTag = tag.entries[entry.entry].tag;
            }
            for (var i = 0; i < tag.values.length && i < $scope.param.length; i++) {
                if (tag.values[i] != null) {
                    $scope.param[i].tag = tag.values[i];
                } else {
                    $scope.param[i].tag = " ";
                }
			}
			return true;
		}
		return false;/*else {
            for (var i = 0; i < $scope.param.length; i++) {
                $scope.param[i].tag = "";
            }
        }*/
	};

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

    $scope.updateCharacter();

});