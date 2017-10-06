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
        var hitbox = "";
        for(var i=0;i<this.move.hitboxActive.length;i++){
            hitbox += (this.move.hitboxActive[i].start != 0 ? (isNaN(this.move.hitboxActive[i].start) ? "" : this.move.hitboxActive[i].start) : "") + ((this.move.hitboxActive[i].start != 0 || this.move.hitboxActive[i].end != 0 ) ? (!(!isNaN(this.move.hitboxActive[i].start) && this.move.hitboxActive[i].end == 0) ? "-" : "") : "") + (this.move.hitboxActive[i].end != 0 ? (isNaN(this.move.hitboxActive[i].end) ? "" : this.move.hitboxActive[i].end) : "");
            if(i<this.move.hitboxActive.length-1){
                hitbox+=",";
            }
        }
        if(this.move.rehitRate != 0){
            hitbox += " (Rehit rate: " + this.move.rehitRate + ")";
        }
        if(this.move.throw){
            if(this.move.weightDependent !== undefined){
                if(this.move.weightDependent){
                    hitbox = "Weight Dependent: Yes";
                }else{
                    hitbox = "Weight Dependent: No";
                }
            }
        }
        this.move.hitboxActive_print = hitbox;
        if (isNaN(this.move.landingLag)) {
            this.move.landingLag = "-";
        }
        var autoCancel = "";
        for(var i=0;i<this.move.autoCancel.length;i++){
            autoCancel += this.move.autoCancel[i].print();
            if(i<this.move.autoCancel.length-1){
                autoCancel+=",";
            }
        }
        if(autoCancel == ""){
            autoCancel = "-";
        }
        this.move.autoCancel_print = autoCancel;
        if (isNaN(this.move.faf)) {
            this.move.faf = "-";
        }
        if (isNaN(this.move.bkb)) {
            this.move.bkb = "-";
		}
		if (isNaN(this.move.wbkb)) {
			this.move.wbkb = "-";
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
            if(this.move.shieldDamage != 0){
                this.move.base_damage_print += " (SD +" + this.move.shieldDamage + ")";
            }
		}
		if (this.move.wbkb != 0 && this.move.wbkb != "-") {
			this.move.bkb_print = this.move.bkb == "-" || this.move.bkb == "0" ? "W: " + this.move.wbkb : this.move.bkb + ",W: " + this.move.wbkb;
        } else {
            this.move.bkb_print = this.move.bkb;
        }

    }
};

class CharacterId {
    constructor(name, id, color) {
        this.name = name;
        this.id = id;
        this.color = color;
    }

	static getName(list, id) {
		if (id < list.length + 1) {
			return list[id-1];
		}
        //for (var i = 0; i < list.length; i++) {
        //    if (list[i].id == id) {
        //        return list[i];
        //    }
        //}
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

	static sort(a, b) {
		if (a.id < b.id) {
			return -1;
		}
		if (a.id > b.id) {
			return 1;
		}
		return 0;
	}
};

class RegexMap{
    constructor(reg, character){
        this.reg = reg;
        this.character = character.toLowerCase();
    }
};

//Regexp on top have higher priority and will apply the next ones
var additionalNames = [
    new RegexMap(/mr(\.)?( )?game( )?\&( )?watch/gi,"Mr. Game And Watch"),
    new RegexMap(/toot( |-)?toot/gi,"character:g&w & dthrow + character:g&w & uair +"),
    new RegexMap(/g( )?\&( )?w/gi,"Mr. Game And Watch"),
    new RegexMap(/rosalina( )?\&( )?luma/gi,"Rosalina And Luma"),
    new RegexMap(/rosalina/gi,"Rosalina And Luma"),
    new RegexMap(/zss/gi,"Zero Suit Samus"),
    new RegexMap(/ddd/gi,"King Dedede"),
    new RegexMap(/dh/gi,"Duck Hunt"),
    new RegexMap(/ding( |-)?dong/gi,"character:dk & Uthrow (Cargo) + character:dk & uair +"),
    new RegexMap(/not( )?top( )?5/gi,"character:mario"),
    new RegexMap(/dk/gi,"Donkey Kong"),
    new RegexMap(/puff/gi,"Jigglypuff"),
    new RegexMap(/dr( )?mario/gi,"Dr. Mario"),
    new RegexMap(/bowser( )?jr/gi,"Bowser Jr."),
    new RegexMap(/5\.99/gi,"character:bayonetta,character:cloud,character:ryu"),
    new RegexMap(/4\.99/gi,"character:corrin"),
    new RegexMap(/3\.99/gi,"character:mewtwo,character:lucas,character:roy"),
    new RegexMap(/character:pocket/gi,"character:cloud"),
    new RegexMap(/our( )?boy/gi,"Roy"),
    new RegexMap(/(i(')?m( )?really( )?feeling( )?it)|(monado( )?boy(s|z))|(feelin(')?( )?it)/gi,"character:Shulk"),
    new RegexMap(/alph/gi,"Olimar"),
    new RegexMap(/hoo( |-)?hah(!)?/gi,"character:diddy kong & dthrow + character:diddy kong & uair +"),
    new RegexMap(/harambe/gi,"donkey kong"),
    new RegexMap(/wft/gi,"Wii Fit Trainer"),
    new RegexMap(/instapin/gi,"character:corrin & dragon lunge +"),
    new RegexMap(/sanic/gi,"Sonic"),
    new RegexMap(/gotta( )?go( )?fast/gi,"character:sonic"),
    new RegexMap(/fiyur/gi,"character:fox & Fire Fox +"),
    new RegexMap(/genkai( )?wo( )?koeru/gi,"type:limitbreak"),
    new RegexMap(/lemons/gi,"character:mega man & type:jab + character:mega man & nair + character:mega man & ftilt +"),
    new RegexMap(/koo( |-)?pah(!)?/gi,"character:bowser & uthrow + character:bowser & uair +"),
    new RegexMap(/monado( )?purge/gi,"character:shulk & uthrow + character:shulk & uair +"),
    new RegexMap(/knee/gi,"character:captain falcon & fair +"),
    new RegexMap(/character:kamui/gi,"character:corrin"),
    new RegexMap(/character:reflet/gi,"character:robin"),
    new RegexMap(/character:koopa/gi,"character:bowser"),
    new RegexMap(/nine/gi,"judge 9"),
    new RegexMap(/checkmate/gi,"character:robin & dthrow + character:robin & uair +"),
    new RegexMap(/beep( |-)?boop/gi,"character:r.o.b & dthrow + character:r.o.b & uair +"),
    new RegexMap(/(dlc)|(pay( )?(2|to)( )?win)/gi,"character:mewtwo,character:lucas,character:roy,character:ryu,character:cloud,character:corrin,character:bayonetta")
];

class Condition {
    constructor(condition) {
        this.condition = condition.toLowerCase();
        this.type = "Name";
        if (this.condition.includes("character:")) {
            this.type = "Character";

			this.eval = function (move) {
				var character = move.characterData;
                if(character == null){
                    return false;
                }
                return character.name.toLowerCase() == this.condition.toLowerCase().split("character:")[1];
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
                    if(this.condition.charAt(0) == '"'){
                        return this.condition.toLowerCase().replace(/\"/gi,"") == move.name.toLowerCase(); // || this.condition.toLowerCase().replace(/\"/gi,"") == move.moveName.toLowerCase();
                    }
                    return move.name.toLowerCase().includes(this.condition.toLowerCase());
                }

            }
        }
    }
};

class NameFilter {
    constructor(name) {
        this.name = name.toLowerCase();
        this.empty = this.name.trim() == "";
        this.name = this.name.replace(/\&/gi, ",&");
        var conditions = this.name.split(",");
        this.OrConditions = [];
        this.AndConditions = [];
        this.NotConditions = [];
        for (var i = 0; i < conditions.length; i++) {
            if (conditions[i] == "" || conditions[i] == "-" || conditions[i] == "&" || conditions[i] == '"' || conditions[i] == '""') {
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
    $scope.usingHttp = inhttp;
	$scope.app = 'movesearch';
	$scope.apps = GetApps($scope.app);
	$scope.appLink = $scope.apps[0].link;
    $scope.name = "";
    $scope.options = ["any", "=", "<", "<=", ">", ">=", "between"];
    $scope.woptions = ["BKB/WBKB", "BKB", "WBKB"];
    $scope.sort_options = ["Character","Name","Base damage","Angle","BKB","KBG"];
    $scope.order_options = ["Asc","Desc"];
    $scope.hitbox_start_cond = "any";
    $scope.hitbox_frame_cond = true;
    $scope.faf_cond = "any";
    $scope.landing_lag_cond = "any";
    $scope.autocancel_cond = true;
    $scope.base_damage_cond = "any";
    $scope.angle_cond = "any";
    $scope.bkb_cond = "any";
    $scope.kbg_cond = "any";
    $scope.wbkb_cond = "BKB/WBKB";
    $scope.data_style = {'display':'none'};
    $scope.data_style_hidden = {'display':'initial'};  

    $scope.sort_by = "Character";
    $scope.order_by = "Asc";

    $scope.show_data = function(v){
        $scope.data_style = {'display': v ? 'initial' : 'none'}; 
        $scope.data_style_hidden = {'display':v ? 'none' : 'initial'}; 
    }

    $scope.updateStatus = function (status) {
        $scope.status = status;
    }

    $scope.charactersId = [];
    $scope.moves = [];
    $scope.fail = false;

    $scope.ready = function (fail) {
        if(fail || $scope.fail){
            $scope.fail = true;
            $scope.status = "Couldn't access API";
            return;
        }
        if ($scope.charactersId.length != 0 && $scope.moves.length != 0) {

            $scope.status = "";
            $scope.loading = { "display": "none" };
            $scope.filter_interface = { "display": "block" };
            $scope.update();
        } else {
			if ($scope.moves.length == 0) {
				getAllMoves($scope);
				$scope.status = "Parsing moves...";
			}
        }
    }

    $scope.status = "Loading...";
    $scope.loading = { "display": "block", "margin-left" : "10px" };
    $scope.filter_interface = { "display": "none" };

    getCharactersId(KHcharacters, $scope);
	$scope.charactersId.sort(CharacterId.sort);

    $scope.hitbox_start = 0;
    $scope.hitbox_start2 = 0;
    $scope.hitbox_frame = 0;
    $scope.faf = 0;
    $scope.faf2 = 0;
    $scope.landing_lag = 0;
    $scope.landing_lag2 = 0;
    $scope.autocancel = 0;
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
            case ">":
                return value1 > value2;
            case "<=":
                return value1 <= value2;
            case ">=":
                return value1 >= value2;
            case "between":
                return value1 >= value2 && value1 <= value3;
            case "any":
                return true;
        }
        return value1 == value2;
    }

    $scope.sort = function(){
        var c = [];
        for(var i = 0; i < $scope.filteredMoves.length; i++){
            c.push($scope.filteredMoves[i]);
        }
        var av = -1;
        var bv = 1;
        if($scope.order_by == "Desc"){
            av = 1;
            bv = -1;
        }
        switch($scope.sort_by){
            case "Character":
                $scope.sortedMoves = c.sort(function(a,b){
                    return a.character < b.character ? av :
                    a.character > b.character ? bv :
                    a.move.compareById(b.move);
                });
            break;
            case "Name":
                $scope.sortedMoves = c.sort(function(a,b){
                    return a.move.name < b.move.name ? av :
                    a.move.name > b.move.name ? bv :
                    a.move.compareById(b.move);
                });
            break;
            case "Base damage":
                $scope.sortedMoves = c.sort(function(a,b){
                    if(isNaN(a.move.base_damage)){
                        if(isNaN(b.move.base_damage)){
                            return a.move.compareById(b.move);
                        }else{
                            return av;
                        }
                    }
                    if(isNaN(b.move.base_damage)){
                        return bv;
                    }
                    return a.move.base_damage < b.move.base_damage ? av :
                    a.move.base_damage > b.move.base_damage ? bv :
                    a.move.compareById(b.move);
                });
            break;
            case "Angle":
                $scope.sortedMoves = c.sort(function(a,b){
                    if(a.move.angle == "-"){
                        if(b.move.angle == "-"){
                            return a.move.compareById(b.move);
                        }else{
                            return av;
                        }
                    }
                    if(b.move.angle == "-"){
                        return bv;
                    }
                    return a.move.angle < b.move.angle ? av :
                    a.move.angle > b.move.angle ? bv :
                    a.move.compareById(b.move);
                });
            break;
            case "BKB":
                $scope.sortedMoves = c.sort(function(a,b){
                    if(a.move.bkb == "-"){
                        if(b.move.bkb == "-"){
                            return a.move.compareById(b.move);
                        }else{
                            return av;
                        }
                    }
                    if(b.move.bkb == "-"){
                        return bv;
                    }
                    return a.move.bkb < b.move.bkb ? av :
                    a.move.bkb > b.move.bkb ? bv :
                    a.move.compareById(b.move);
                });
            break;
            case "KBG":
                $scope.sortedMoves = c.sort(function(a,b){
                    if(a.move.kbg == "-"){
                        if(b.move.kbg == "-"){
                            return a.move.compareById(b.move);
                        }else{
                            return av;
                        }
                    }
                    if(b.move.kbg == "-"){
                        return bv;
                    }
                    return a.move.kbg < b.move.kbg ? av :
                    a.move.kbg > b.move.kbg ? bv :
                    a.move.compareById(b.move);
                });
            break;
        }
    }

    
    $scope.update = function () {
        $scope.filteredMoves = [];
        characterListId = $scope.charactersId;
        var hitbox_start = parseFloat($scope.hitbox_start);
        var hitbox_start2 = parseFloat($scope.hitbox_start2);
        var hitbox_frame = parseFloat($scope.hitbox_frame);
        var hitbox_frame2 = parseFloat($scope.hitbox_frame2);
        var faf = parseFloat($scope.faf);
        var faf2 = parseFloat($scope.faf2);
        var landing_lag = parseFloat($scope.landing_lag);
        var landing_lag2 = parseFloat($scope.landing_lag2);
        var autocancel = parseFloat($scope.autocancel);
        var base_damage = parseFloat($scope.base_damage);
        var base_damage2 = parseFloat($scope.base_damage2);
        var angle = parseFloat($scope.angle);
        var angle2 = parseFloat($scope.angle2);
        var bkb = parseFloat($scope.bkb);
        var bkb2 = parseFloat($scope.bkb2);
        var kbg = parseFloat($scope.kbg);
        var kbg2 = parseFloat($scope.kbg2);
        var n = $scope.name;
        for(var x = 0;x < additionalNames.length;x++){
            if(additionalNames[x].reg.test(n)){
                n = n.replace(additionalNames[x].reg, additionalNames[x].character.toLowerCase());
            }
        }

        var nc = n.split("+");
        var conditions = [];
        for(var ni = 0; ni < nc.length; ni++){
            conditions.push(new NameFilter(nc[ni]));
        }
        $scope.moves.forEach(function (move, index) {
            if ($scope.compare($scope.base_damage_cond, move.base_damage, base_damage, base_damage2) &&
                $scope.compare($scope.landing_lag_cond, move.landingLag, landing_lag, landing_lag2) && 
                $scope.compare($scope.angle_cond, move.angle, angle, angle2) &&
                $scope.compare($scope.bkb_cond, move.bkb, bkb, bkb2) &&
                $scope.compare($scope.kbg_cond, move.kbg, kbg, kbg2) &&
                $scope.compare($scope.faf_cond, move.faf, faf, faf2)) {
                if ($scope.wbkb_cond != "BKB/WBKB") {
                    if (move.wbkb != 0 && $scope.wbkb_cond == "BKB") {
                        return;
                    }
                    if (move.wbkb == 0 && $scope.wbkb_cond == "WBKB") {
                        return;
                    }
                }
                if(!$scope.autocancel_cond){
                    if(move.autoCancel.length < 0){
                        return;
                    }
                    var eval = false;
                    for(var i=0;i<move.autoCancel.length;i++){
                        if(move.autoCancel[i].eval(autocancel)){
                            eval = true;
                            break;
                        }
                    }
                    if(!eval){
                        return;
                    }
                }
                var cond_check = false;
                for(var ni=0;ni<conditions.length;ni++){
                    if(ni==0 && conditions[ni].empty && conditions.length){
                        cond_check = true;
                        continue;
                    }
                    if(conditions[ni].empty){
                        continue;
                    }
                    cond_check = cond_check | conditions[ni].check(move);
                    /*if (!nameConditions.check(move)) {
                        return;
                    }*/
                }
                if(!cond_check){
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
				var name = move.characterData;
                if (name != null) {
                    $scope.filteredMoves.push(new FilterListItem(name, move));
                }
                return;
                
            }
        });
        $scope.noResults = $scope.filteredMoves.length;
        $scope.sort();
    }

    $scope.collapse = function (id) {
        $("#" + id).collapse('toggle');
    }

    $scope.theme = "Normal";
    $scope.themes = styleList;

    $scope.changeTheme = function () {
        changeStyle($scope.theme);
    }
});

