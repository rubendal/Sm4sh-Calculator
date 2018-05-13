var gameNames = ["mario", "luigi", "peach", "koopa", "yoshi", "rosetta", "koopajr", "wario", "donkey", "diddy", "gamewatch", "littlemac", "link", "zelda", "sheik", "ganon", "toonlink", "samus", "szerosuit", "pit", "palutena", "marth", "ike", "reflet", "duckhunt", "kirby", "dedede", "metaknight", "fox", "falco", "pikachu", "lizardon", "lucario", "purin", "gekkouga", "robot", "ness", "captain", "murabito", "pikmin", "wiifit", "shulk", "mariod", "pitb", "lucina", "pacman", "rockman", "sonic", "mewtwo", "lucas", "roy", "ryu", "cloud", "kamui", "bayonetta", "miiswordsman", "miifighter", "miigunner", "common"];
var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Common"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner", "Common"];

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
        'url': "./Msc/" + char + "/msc.json",
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

class CharFiles {
    constructor(character, files) {
        this.character = character;
        this.files = files;
    }
};

var allScripts = [];

for (var i = 0; i < gameNames.length; i++) {
    allScripts.push(new CharFiles(names[i], getScripts(gameNames[i])));
}

class ScriptResult {
    constructor(character, file, scriptName, lines, no) {
		this.character = character;
		this.file = file;
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

app.controller('scriptsearch', function ($scope) {
	$scope.app = "mscsearch";
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
    $scope.regex = "";
    $scope.name = "";
    $scope.negate = "";
    $scope.results = [];
    $scope.resultLength = 0;
    $scope.error = "";
    $scope.matches = 0;

    $scope.update = function () {
        $scope.error = "";
        $scope.matches = 0;
        $scope.results = [];
        $scope.resultLength = 0;
        try{
            var regex = null;
            var name = null;
            var negate = null;
            if ($scope.regex != "") {
                regex = new RegExp($scope.regex, "g");
            }
            if (regex == null && negate == null && name == null) {
                return;
            }
            for (var i = 0; i < allScripts.length; i++) {
				for (var j = 0; j < allScripts[i].files.length; j++) {
					for (var k = 0; k < allScripts[i].files[j].list.length; k++) {
						var script = allScripts[i].files[j].list[k].script;
						var lines = [];

						var no = 0;

						var matches = false;

						var m;

						do {
							m = regex.exec(script);

							if (m) {
								matches = true;

								var line = "";
								var start = 1;
								var end = 0;

								//Get line beginning

								for (var x = m.index; x > 0; x--) {
									if (script.charAt(x - 1) == '\n') {
										start = x;
										break;
									}
								}

								//Get line end

								for (var x = m.index + m[m.length - 1].length; x < script.length; x++) {
									if (script.charAt(x - 1) == '\n') {
										end = x-2; //\r\n
										break;
									}
								}


								lines.push(script.substr(start, end-start));

								no++;
							}
						} while (m);

						if (matches) {
							if (regex != null) {
								$scope.results.push(new ScriptResult(allScripts[i].character, allScripts[i].files[j].file, allScripts[i].files[j].list[k].name, lines, no));
								$scope.matches += no;
							}
						}



					}
                    
                    
                }
            }
            $scope.resultLength = $scope.results.length;
        } catch (e) {
            $scope.results = [];
            $scope.resultLength = 0;
            $scope.matches = 0;
			$scope.error = "Error in regular expression";
        }
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
});