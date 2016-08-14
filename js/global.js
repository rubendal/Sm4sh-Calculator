function loadJSON(name) {
    var json = null;
    $.ajax({
        'async': false,
        'url': "./Data/" + name + "/attributes.json",
        'dataType': 'json',
        'success': function (data) {
            json = data;
        }
    });
    return json;
}

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

class Modifier {
    constructor(name, damage_dealt, damage_taken, kb_dealt, kb_received, gravity, shield) {
        this.name = name;
        this.damage_dealt = damage_dealt;
        this.damage_taken = damage_taken;
        this.kb_dealt = kb_dealt;
        this.kb_received = kb_received;
        this.gravity = gravity;
        this.shield = shield;
    }
};

var monado = [
    new Modifier("Jump", 1, 1.22, 1, 1, 1.3, 1),
    new Modifier("Speed", 0.8, 1, 1, 1, 1, 1),
    new Modifier("Shield", 0.7, 0.67, 1, .78, 1, 1.5),
    new Modifier("Buster", 1.4, 1.13, 0.68, 1, 1, 1),
    new Modifier("Smash", 0.5, 1, 1.18, 1.07, 1, 1)
];

var decisive_monado = [
    new Modifier("Decisive Jump", 1, 1.22, 1, 1, 1.43, 1),
    new Modifier("Decisive Speed", 0.8, 1, 1, 1, 1.1, 1),
    new Modifier("Decisive Shield", .7, 0.603, 1, .702, 1, 1.5*1.1),
    new Modifier("Decisive Buster", 1.4 * 1.1, 1.13, 0.68, 1, 1, 1),
    new Modifier("Decisive Smash", 0.5, 1, 1.18 * 1.1, 1.07, 1, 1)
];

var hyper_monado = [
    new Modifier("Hyper Jump", 1, 1.22*1.2, 1, 1, 1.56, 1),
    new Modifier("Hyper Speed", 0.64, 1, 1, 1, 1.2, 1),
    new Modifier("Hyper Shield", 0.56, 0.536, 1, .624, 1, 1.5*1.2),
    new Modifier("Hyper Buster", 1.4 * 1.2, 1.13 * 1.2, 0.544, 1, 1, 1),
    new Modifier("Hyper Smash", 0.4, 1, 1.18 * 1.2, 1.07 * 1.2, 1, 1)
];

class Character {
    constructor(n) {
        this.display_name = n;
        var name = characters[names.indexOf(n)];
        this.addModifier = function (modifier) {
            this.modifier = modifier;
        }
        this.modifier = new Modifier("", 1, 1, 1, 1, 1, 1);
        for (var i = 0; i < monado.length; i++) {
            if (name.includes("(" + decisive_monado[i].name + ")")) {
                this.modifier = decisive_monado[i];
                this.name = name.split(" ")[0];
                break;
            }
            if (name.includes("(" + hyper_monado[i].name + ")")) {
                this.modifier = hyper_monado[i];
                this.name = name.split(" ")[0];
                break;
            }
            if (name.includes("(" + monado[i].name + ")")) {
                this.modifier = monado[i];
                this.name = name.split(" ")[0];
                break;
            }
        }
        if (name.includes("(Deep Breathing (Fastest))")) {
            this.modifier = new Modifier("Deep Breathing (Fastest)", 1.2, 0.9, 1, 1, 1, 1);
            this.name = "Wii Fit Trainer";
        }
        if (name.includes("(Deep Breathing (Slowest))")) {
            this.modifier = new Modifier("Deep Breathing (Fastest)", 1.16, 0.9, 1, 1, 1, 1);
            this.name = "Wii Fit Trainer";
        }
        if(this.name == null){
            this.name = name;
        }
        this.api_name = this.name;
        if (name == "Game And Watch") {
            this.api_name = "Mrgamewatch";
        }
        if (name != "Cloud (Limit Break)") {
            this.attributes = loadJSON(this.name);
        } else {
            this.attributes = loadJSONPath("./Data/Cloud/attributes limit break.json");
            this.api_name = "Cloud";
        }
        
        
    }

};

class Distance{
    constructor(kb, x_kb, y_kb, hitstun, angle, gravity, fall_speed, traction, inverseX, onSurface, position, stage){
        this.kb = kb;
        this.x_kb = x_kb;
        this.y_kb = y_kb;
        this.hitstun = hitstun;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.traction = traction;
        this.max_x = 0;
        this.max_y = 0;
        this.graph_x = 0;
        this.graph_y = 0;
        this.inverseX = inverseX;
        this.onSurface = onSurface;
        this.tumble = false;
        this.position = {"x":0, "y":0};
        if(position !== undefined){
            this.position = position;
        }
        this.stage = null;
        if(stage !== undefined){
            this.stage = stage;
        }
        if(kb > 80 && angle != 0 && angle != 180){
            this.tumble = true;
        }

        var x_speed = LaunchSpeed(+x_kb.toFixed(6));
        var y_speed = LaunchSpeed(+y_kb.toFixed(6));

        var x_a = 0.051 * Math.abs(Math.cos(angle * Math.PI / 180));
        var y_a = 0.051 * Math.abs(Math.sin(angle * Math.PI / 180));
        if(this.inverseX){
            if(angle < 180){
                angle = 180 - angle;
            }else{
                angle = 360 - (angle - 180);
            }
        }
        if(Math.cos(angle * Math.PI / 180) < 0){
            x_speed *= -1;
            x_a *= -1;
        }
        if(Math.sin(angle * Math.PI / 180) < 0){
            y_speed *= -1;
            y_a *= -1;
        }
        this.x = [this.position.x];
        this.y = [this.position.y];
        var xd = this.position.x;
        var yd = this.position.y;
        var xs = x_speed;
        var ys = y_speed;
        var g = 0;
        var fg = 0;
        var sliding = false;
        var limit = hitstun < 200 ? hitstun : 200;
        for(var i=0;i<limit;i++){

            g += gravity;
            fg = Math.min(g, fall_speed);
            
            if(sliding){
                if(!this.tumble){
                    xs -= x_a;
                }
            }else{
                
            }
            if(i!=0){
                xs -= x_a;
                ys -= y_a;
            }            

            if(Math.cos(angle * Math.PI / 180) < 0){
                if(sliding){
                    if(!this.tumble){
                        xd += Math.min(xs,0);
                        this.max_x = Math.min(this.max_x, xd);
                    }
                }else{
                    xd += Math.min(xs,0);
                    this.max_x = Math.min(this.max_x, xd);
                }
                
            }else{
                if(sliding){
                    if(!this.tumble){
                        xd += Math.max(xs,0);
                        this.max_x = Math.max(this.max_x, xd);
                    }
                }else{
                    xd += Math.max(xs,0);
                    this.max_x = Math.max(this.max_x, xd);
                }
                
            }

            if(Math.sin(angle * Math.PI / 180) < 0){
                yd += Math.min(ys,0);
            }else{
                yd += Math.max(ys,0);
            }
            yd -= fg;
            if(this.onSurface && Math.sin(angle * Math.PI / 180) >= 0){
                if(yd < 0){
                    sliding = true;
                    yd = 0;
                    //Traction applied here
                    if(Math.cos(angle * Math.PI / 180) < 0){
                        xd -= traction;
                    }else{
                        xd += traction;
                    }
                }
            }
            if(Math.sin(angle * Math.PI / 180) < 0){
                this.max_y = Math.min(this.max_y, yd);
            }else{
                this.max_y = Math.max(this.max_y, yd);
            }


            this.x.push(+xd.toFixed(4));
            this.y.push(+yd.toFixed(4));

        }

        this.graph_x = Math.abs(this.max_x);
        this.graph_y = Math.abs(this.max_y);

        this.max_x = Math.abs(this.max_x);
        this.max_y = Math.abs(this.max_y);

        this.data = [];
        var px = 0;
        var py = 0;
        var cx = px;
        var cy = py;
        var color = "blue";
        var dir = 1;
        var data = [];
        var airdodge = AirdodgeCancel(kb, false);
        var aerial = AerialCancel(kb, false);
        for(var i = 0; i < this.x.length; i++){
            var xdata = [];
            var ydata = [];
            var change = false;
            do{
                px = this.x[i];
                py = this.y[i];
                if(i==0){
                    if(i+1 < this.x.length){
                        if(py > this.y[i+1]){
                            if(dir==1){
                                change = true;
                                dir=-1;
                            }
                        }else{
                            if(py < this.y[i+1]){
                                if(dir==-1){
                                    change = true;
                                    dir=1;
                                }
                            }
                        }
                    }
                }else{
                    if(py < cy){
                        if(dir == 1){
                            change = true;
                        }
                        dir = -1;
                    }else{
                        if(dir == -1){
                            change = true;
                        }
                        dir = 1;
                    }
                }
                if(!change){
                    xdata.push(px);
                    ydata.push(py);
                    cx = px;
                    cy = py;
                    i++;
                }else{
                    if(i!=0){
                        xdata.push(px);
                        ydata.push(py);
                    }
                    i--;
                }
            }while(!change && i < this.x.length);
            if(xdata.length > 0){
                data.push({'x':xdata, 'y':ydata, 'mode':'lines+markers', 'marker':{'color':color}, 'line':{'color':color}, 'name':color == 'blue' ? "Upward momentum" : "Downward momentum"});
            }
            switch(color){
                case 'blue':
                    color = "red";
                break;
                case 'red':
                    color = "blue";
                break;
            }
        }

        var adxdata = [];
        var adydata = [];

        if(airdodge< limit){
            for(var i = airdodge; i < limit; i++){
                adxdata.push(this.x[i]);
                adydata.push(this.y[i]);
            }
            

            if(adxdata.length>0){
                data.push({'x':adxdata, 'y':adydata, 'mode':'markers', 'marker':{'color':'yellow'}, 'name':"Airdodge cancel"});
            }

        }

        if(aerial < limit){
            adxdata = [];
            adydata = [];
            for(var i = aerial; i < limit; i++){
                adxdata.push(this.x[i]);
                adydata.push(this.y[i]);
            }
            if(adxdata.length>0){
                data.push({'x':adxdata, 'y':adydata, 'mode':'markers', 'marker':{'color':'green'}, 'name':"Aerial cancel"});
            }

        }

        //Stage blast zones
        if(this.stage != null){
            adxdata = [];
            adydata = [];
            adxdata.push(this.stage.blast_zones[0]);
            adxdata.push(this.stage.blast_zones[1]);
            adxdata.push(this.stage.blast_zones[1]);
            adxdata.push(this.stage.blast_zones[0]);
            adxdata.push(this.stage.blast_zones[0]);

            adydata.push(this.stage.blast_zones[2]);
            adydata.push(this.stage.blast_zones[2]);
            adydata.push(this.stage.blast_zones[3]);
            adydata.push(this.stage.blast_zones[3]);
            adydata.push(this.stage.blast_zones[2]);

            data.push({'x':adxdata, 'y':adydata, 'mode':'lines', 'line':{'color':'purple'}, 'name':"Blast zone"});

            //Stage surface
            adxdata = [];
            adydata = [];
            for(var i=0;i<this.stage.surface.length;i++){
                adxdata.push(this.stage.surface[i][0]);
                adydata.push(this.stage.surface[i][1]);
            }

            data.push({'x':adxdata, 'y':adydata, 'mode':'lines', 'line':{'color':'purple'}, 'name':"Stage"});

            //Stage platforms
            if(this.stage.platforms !== undefined){
                for(var i=0;i<this.stage.platforms.length;i++){
                    adxdata = [];
                    adydata = [];
                    for(var j=0;j<this.stage.platforms[i].vertex.length;j++){
                        adxdata.push(this.stage.platforms[i].vertex[j][0]);
                        adydata.push(this.stage.platforms[i].vertex[j][1]);
                    }
                    data.push({'x':adxdata, 'y':adydata, 'mode':'lines', 'line':{'color':'purple'}, 'name':this.stage.platforms[i].name});
                }
            }

            this.graph_x = Math.max(this.graph_x, this.stage.blast_zones[1]);
            this.graph_y = Math.max(this.graph_y, this.stage.blast_zones[2]);
        }


        this.plot = data;


    }
};

class Knockback {
    constructor(kb, angle, gravity, fall_speed, aerial, windbox, percent, di) {
        this.base_kb = kb;
        this.kb = kb;
        this.original_angle = angle;
        this.base_angle = angle;
        this.angle = angle;
        this.gravity = gravity;
        this.aerial = aerial;
        this.windbox = windbox;
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.fall_speed = fall_speed;
        this.add_gravity_speed = (((this.gravity * 21.6) - 1.84) * 5);
        this.add_gravity_kb = ((this.add_gravity_speed / 0.72) / 0.9);
        this.percent = percent;
        this.reeling = false;
        this.spike = false;
        this.launch_speed = LaunchSpeed(kb);
        this.hitstun = Hitstun(this.base_kb, this.windbox);
        if (di !== undefined) {
            this.di = di;
        } else {
            this.di = 0;
        }
        this.calculate = function () {
            if (this.original_angle == 361) {
                this.base_angle = SakuraiAngle(this.kb, this.aerial);
            }
            this.angle = this.base_angle;
            if (this.base_angle != 0 && this.base_angle != 180) {
                this.tumble = this.kb > 80 && !windbox;
                this.di_able = this.tumble;
                if(this.di_able){
                    this.angle += DI(this.di,this.angle);
                }
            }
            this.x = Math.abs(Math.cos(this.angle * Math.PI / 180) * this.kb);
            this.y = Math.abs(Math.sin(this.angle * Math.PI / 180) * this.kb);
            if (this.angle == 0 || this.angle == 180  || (this.angle >= 181 && this.angle < 360)) {
                this.add_gravity_kb = 0;
            }
            if(this.kb > 80 && (this.angle != 0 && this.angle != 180)){
                this.y += this.add_gravity_kb;
            }
            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = true;
                }
            }
            this.spike = this.angle >= 230 && this.angle <= 310;
            if (this.spike) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = !this.tumble;
                }
            }

            if (this.angle <= 70 || this.angle >= 110) {
                this.reeling = this.tumble && !this.windbox && this.percent >= 100;
            }
            this.launch_speed = LaunchSpeed(this.kb);
            this.hitstun = Hitstun(this.base_kb, false);
        };
        this.addModifier = function (modifier) {
            this.kb *= modifier;
            this.base_kb *= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.kb *= 0.8;
                this.calculate();
            }
        }
        this.calculate();
    }

    

};

class PercentFromKnockback{
    constructor(kb, type, base_damage, damage, angle, weight, gravity, fall_speed, aerial, bkb, kbg, wbkb, attacker_percent, r, timesInQueue, ignoreStale, windbox){
        this.base_kb = kb;
        this.type = type;
        this.original_angle = angle;
        this.base_angle = angle;
        this.base_damage = base_damage;
        this.damage = damage;
        this.angle = angle;
        this.gravity = gravity;
        this.fall_speed = fall_speed;
        this.aerial = aerial;
        this.bkb = bkb;
        this.kbg = kbg;
        this.wbkb = wbkb;
        this.r = r;
        this.windbox = windbox;
        this.weight = weight;
        this.attacker_percent = attacker_percent;
        this.rage = Rage(attacker_percent);
        this.tumble = false;
        this.can_jablock = false;
        this.di_able = false;
        this.add_gravity_speed = (((this.gravity * 21.6) - 1.84) * 5);
        this.add_gravity_kb = ((this.add_gravity_speed / 0.72) / 0.9);
        this.reeling = false;
        this.training_percent = 0;
        this.vs_percent = 0;
        this.timesInQueue = timesInQueue;
        this.ignoreStale = ignoreStale;

        this.best_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };
        this.worst_di = {'angle_training':0, 'training':0, 'angle_vs':0, 'vs':0, 'hitstun':0, 'hitstun_dif':0 };

        this.training_formula = function(kb, base_damage, damage, weight, kbg, bkb, r){
            var s=1;
            return (500 * kb * (weight+100)- (r * (kbg * (7 * damage * s * (3 * base_damage * s+7 * base_damage+20)+90 * (weight+100))+ 500 * bkb * (weight+100))))/(7 * kbg * r * (base_damage * (3 *s +7)+20));
        }
        this.vs_formula = function(kb, base_damage, damage, weight, kbg, bkb, r, attacker_percent, timesInQueue, ignoreStale){
            var s = StaleNegation(timesInQueue, ignoreStale);
            r = r * Rage(attacker_percent);
            return (500 * kb * (weight+100)- (r * (kbg * (7 * damage * s * (3 * base_damage * s+7 * base_damage+20)+90 * (weight+100))+ 500 * bkb * (weight+100))))/(7 * kbg * r * (base_damage * (3 *s +7)+20));
        }

        if(!this.wbkb){
            if(this.type == "total"){
                this.kb = kb;
            }
            if(this.type == "x"){
                this.x = kb;
            }
            if(this.type == "y"){
                this.y = kb;
            }
        }



        this.calculate = function () {
            
            if(!this.wbkb){
                if(this.type == "total"){
                    this.kb = this.base_kb;
                }
                if(this.type == "x"){
                    this.x = this.base_kb;
                }
                if(this.type == "y"){
                    this.y = this.base_kb;
                }
            }


            if (this.original_angle == 361) {
                this.base_angle = SakuraiAngle(this.kb, this.aerial);
            }
            this.angle = this.base_angle;

            if (this.original_angle == 361 && !this.aerial && type != "total") {
                //Find the original kb and get the angle
                var angle_found = false;
                for(var temp_kb = 59.999; temp_kb < 88; temp_kb+=0.001){
                    var temp_angle = SakuraiAngle(temp_kb,this.aerial);
                    var temp_var = 0;
                    if(this.type == "x"){
                        temp_var = Math.abs(temp_kb * Math.cos(temp_angle * Math.PI / 180));
                        if(temp_var >= this.x){
                            this.angle = temp_angle;
                            angle_found = true;
                            break;
                        }
                    }
                    if(this.type == "y"){
                        temp_var = Math.abs(temp_kb * Math.sin(temp_angle * Math.PI / 180));
                        if(temp_var >= this.y){
                            this.angle = temp_angle;
                            angle_found = true;
                            break;
                        }
                    }
                }
                if(!angle_found){
                    this.angle = SakuraiAngle(88,this.aerial);
                }
            }

            if(!this.wbkb){
                if(this.type == "x"){
                    this.kb = Math.abs(this.x / Math.cos(this.angle * Math.PI / 180));
                }
                if(this.type == "y"){
                    this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                }
            }

            this.hitstun = Hitstun(this.kb, this.windbox);

            if (this.base_angle != 0 && this.base_angle != 180) {
                this.tumble = this.kb > 80 && !windbox;
                this.di_able = this.tumble;
            }
            
            
            if (this.angle == 0 || this.angle == 180  || (this.angle >= 181 && this.angle < 360)) {
                this.add_gravity_kb = 0;
            }
            if(this.kb > 80 && (this.angle != 0 && this.angle != 180)){
                this.y *= this.gravity_mult;
                if(this.type == "y"){
                    this.kb = Math.abs(this.y / Math.sin(this.angle * Math.PI / 180));
                }
            }
            this.can_jablock = false;
            if (this.angle == 0 || this.angle == 180 || this.angle == 360) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = true;
                }
            }
            if (this.angle >= 240 && this.angle <= 300) {
                if (this.kb != 0 && !this.windbox) {
                    this.can_jablock = !this.tumble;
                }
            }
            if (this.angle <= 70 || this.angle >= 110) {
                this.reeling = this.tumble && !this.windbox && this.percent >= 100;

            }

            this.training_percent = this.training_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r);
            this.vs_percent = this.vs_formula(this.kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.timesInQueue, this.ignoreStale);

            if(this.training_percent < 0){
                this.training_percent = 0;
            }   
            if(this.training_percent > 999 || isNaN(this.training_percent)){
                this.training_percent = -1;
            }
            if(this.vs_percent < 0){
                this.vs_percent = 0;
            }   
            if(this.vs_percent > 999 || isNaN(this.vs_percent)){
                this.vs_percent = -1;
            }

            if(this.di_able && this.type != "total"){
                var di_angles = [];
                for(var i = 0; i < 360; i++){
                    var di = DI(i, this.angle);
                    var angle = this.angle + DI(i,this.angle);
                    var kb = this.base_kb;
                    if(this.type == "x"){
                        kb = Math.abs(kb / Math.cos(angle * Math.PI / 180));
                    }
                    if(this.type == "y"){
                        kb -= this.add_gravity_kb;
                        kb = Math.abs(kb / Math.sin(angle * Math.PI / 180));
                    }
                    var hitstun = Hitstun(kb, this.windbox);
                    var training = this.training_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r);
                    var vs = this.vs_formula(kb, this.base_damage, this.damage, this.weight, this.kbg, this.bkb, this.r, this.attacker_percent, this.timesInQueue, this.ignoreStale);
                    di_angles.push({'angle':i,'training':training,'vs':vs, 'hitstun':hitstun});
                }
                di_angles.sort(function(a,b){
                    return a.training < b.training ? 1 :
                    a.training > b.training ? -1 :
                    0
                });
                this.best_di.angle_training = di_angles[0].angle;
                this.best_di.training = di_angles[0].training;
                this.best_di.hitstun = di_angles[0].hitstun;
                this.best_di.hitstun_dif = this.hitstun - di_angles[0].hitstun;
                this.worst_di.angle_training = di_angles[di_angles.length-1].angle;
                this.worst_di.training = di_angles[di_angles.length-1].training;
                this.worst_di.hitstun = di_angles[di_angles.length-1].hitstun;
                this.worst_di.hitstun_dif = this.hitstun - di_angles[di_angles.length-1].hitstun;
                di_angles.sort(function(a,b){
                    return a.vs < b.vs ? 1 :
                    a.vs > b.vs ? -1 :
                    0
                });
                this.best_di.angle_vs = di_angles[0].angle;
                this.best_di.vs = di_angles[0].vs;
                this.worst_di.angle_vs = di_angles[di_angles.length-1].angle;
                this.worst_di.vs = di_angles[di_angles.length-1].vs;
                if(this.best_di.training < 0){
                    this.best_di.training = 0;
                }
                if(this.best_di.training > 999 || isNaN(this.best_di.training)){
                    this.best_di.training = -1;
                }
                if(this.best_di.vs < 0){
                    this.best_di.vs = 0;
                }
                if(this.best_di.vs > 999 || isNaN(this.best_di.vs)){
                    this.best_di.vs = -1;
                }
                if(this.worst_di.training < 0){
                    this.worst_di.training = 0;
                }
                if(this.worst_di.training > 999 || isNaN(this.worst_di.training)){
                    this.worst_di.training = -1;
                }
                if(this.worst_di.vs < 0){
                    this.worst_di.vs = 0;
                }
                if(this.worst_di.vs > 999 || isNaN(this.worst_di.vs)){
                    this.worst_di.vs = -1;
                }
            }

        };
        this.addModifier = function (modifier) {
            this.kb /= modifier;
            this.base_kb /= modifier;
            this.add_gravity_kb /= modifier;
            this.calculate();
        };
        this.bounce = function (bounce) {
            if (bounce) {
                this.kb /= 0.8;
                this.calculate();
            }
        }
        this.calculate();
    }
};

class ListItem {
    constructor(attribute, value, title) {
        this.attribute = attribute;
        this.addStyle = function (style) {
            this.style = style;
            return this;
        }
        if (title !== undefined) {
            this.title = title;
        } else {
            this.title = ListItem.getTitle(this.attribute);
        }
        this.style = "";
        if (typeof value === "number" && isNaN(value)) {
            this.addStyle({ 'color': 'red' });
            this.value = "Invalid data";
        } else {
            if (attribute == "Hitstun" || attribute == "Attacker Hitlag" || attribute == "Target Hitlag" || attribute == "Shield stun" || attribute == "Shield Hitlag" || attribute == "Shield Advantage") {
                this.value = value + " frames";
            } else if (attribute == "Airdodge hitstun cancel" || attribute == "Aerial hitstun cancel" || attribute == "First Actionable Frame") {
                this.value = "Frame " + value;
            } else {
                this.value = value;
            }
        }

        
    }

    static getTitle(attribute) {
        var titles = [{ "attribute": "Gravity KB", "title": "KB added to Y component caused by gravity" },
        { "attribute": "KB modifier", "title": "KB multiplier used when target is crouching or charging a smash attack" },
        { "attribute": "Rage", "title": "KB multiplier used on total KB based on attacker's percent " },
        { "attribute": "Aura", "title": "Lucario aura damage increase based on his percent" },
        { "attribute": "KB dealt", "title": "Additional KB multiplier mostly used by attacker Monado Buster/Smash" },
        { "attribute": "KB received", "title": "Additional KB multiplier mostly used by target Monado Shield/Smash" },
        { "attribute": "Charged Smash", "title": "Damage multiplier used when using a charged smash attack" },
        { "attribute": "Damage taken", "title": "Additional damage multiplier target receives caused by the target used in multiple powerups like Monado Jump/Shield/Buster and Deep Breathing" },
        { "attribute": "Damage dealt", "title": "Additional damage multiplier target receives caused by the attacker used in multiple powerups like Monado Speed/Buster/Smash and Deep Breathing" },
        { "attribute": "Before launch damage", "title": "Throws can deal some damage during their animations like Pikachu's fthrow, this is added to the target percent before calculating KB" },
        { "attribute": "Stale-move negation", "title": "Damage reduction caused when using an attack repeatedly, if the attack isn't in the queue it gets a freshness bonus and increases damage a little" },
        { "attribute": "Tumble", "title": "Target will enter tumble if KB > 80 and angle isn't 0 or 180" },
        { "attribute": "Reeling/Spin animation", "title": "Also called Untechable spin, special animation caused when KB > 80, angle isn't between 71 and 109 and target's percent is 100 or higher after the attack damage" },
        { "attribute": "Can Jab lock", "title": "If target is in the ground after tumble during the bounce animation the attack can jab lock if Y = 0 or for spikes KB <= 80" },
        { "attribute": "DI angle", "title": "Angle affected by DI" },
        { "attribute": "Luma KB", "title": "Luma KB is calculated with weight = 100 and an additional 15%" },
        { "attribute": "Luma launched", "title": "If Luma KB > 80 it will be launched" },
        { "attribute": "Shield Damage", "title": "Damage done to target shield, (damage + SD) * 1.19" },
        { "attribute": "Full HP shield", "title": "Maximum HP target shield has, can only be increased using Monado Shield" },
        { "attribute": "Shield Break", "title": "" },
        { "attribute": "Shield stun", "title": "Amount of frames target target cannot do any action after shielding an attack" },
        { "attribute": "Shield Hitlag", "title": "Amount of frames target suffers hitlag while shielding" },
        { "attribute": "Shield Advantage", "title": "" },
        { "attribute": "Unblockable attack", "title": "This attack cannot be blocked using shield" }];
        for (var i = 0; i < titles.length; i++) {
            if (attribute == titles[i].attribute) {
                return titles[i].title;
            }
        }
        return "";
    }
};

function List(values) {
    var list = [];
    var attributes = ["Damage", "Attacker Hitlag", "Target Hitlag", "Total KB", "Angle", "X", "Y", "Hitstun", "First Actionable Frame", "Airdodge hitstun cancel", "Aerial hitstun cancel", "Launch Speed", "Max Distance Launched X", "Max Distance Launched Y"];
    var titles = ["Damage dealt to the target",
        "Amount of frames attacker is in hitlag",
        "Amount of frames the target can SDI",
        "Total KB dealt",
        "Angle target is launched without DI",
        "KB X component", "KB Y component, if KB causes tumble gravity KB is added",
        "Hitstun target gets while being launched", "Frame the target can do any action", "Frame target can cancel hitstun by airdodging",
        "Frame target can cancel hitstun by using an aerial",
        "",
        "",
        ""];
    var hitstun = -1;
    for (var i = 0; i < attributes.length && i < values.length; i++) {
        if (attributes[i] == "Hitstun") {
            hitstun = +values[i].toFixed(4);
        }
        if (hitstun != -1 && (attributes[i] == "Airdodge hitstun cancel" || attributes[i] == "Aerial hitstun cancel")) {
            if (hitstun + 1 == +values[i].toFixed(4)) {
                continue;
            }
            if (hitstun == 0) {
                continue;
            }
        }
        list.push(new ListItem(attributes[i], +values[i].toFixed(4),titles[i])); //.addStyle({'text-decoration':'line-through'})
        if (attributes[i] == "Angle") {
            if (values[i] > 361) {
                i += 2;
            }
        }
    }
    return list;
}

function ShieldList(values) {
    var list = [];
    var attributes = ["Shield stun", "Shield Hitlag", "Shield Advantage"];
    for (var i = 0; i < attributes.length; i++) {
        list[i] = new ListItem(attributes[i], values[i]);
    }
    return list;
}

function getStages(){
    return loadJSONPath("./Data/Stages/stagedata.json");
}

var characters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Cloud (Limit Break)", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var names = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina & Luma", "Bowser Jr.", "Wario", "Donkey Kong", "Diddy Kong", "Mr. Game & Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Cloud (Limit Break)", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];
var KHcharacters = ["Mario", "Luigi", "Peach", "Bowser", "Yoshi", "Rosalina And Luma", "Bowser Jr", "Wario", "Donkey Kong", "Diddy Kong", "Game And Watch", "Little Mac", "Link", "Zelda", "Sheik", "Ganondorf", "Toon Link", "Samus", "Zero Suit Samus", "Pit", "Palutena", "Marth", "Ike", "Robin", "Duck Hunt", "Kirby", "King Dedede", "Meta Knight", "Fox", "Falco", "Pikachu", "Charizard", "Lucario", "Jigglypuff", "Greninja", "R.O.B", "Ness", "Captain Falcon", "Villager", "Olimar", "Wii Fit Trainer", "Shulk", "Dr. Mario", "Dark Pit", "Lucina", "PAC-MAN", "Mega Man", "Sonic", "Mewtwo", "Lucas", "Roy", "Ryu", "Cloud", "Corrin", "Bayonetta", "Mii Swordfighter", "Mii Brawler", "Mii Gunner"];

var attacker = new Character("Bayonetta");
var target = new Character("Bayonetta");


var attacker_percent = 0;
var target_percent = 0;
var base_damage = 2.5;
var angle = 361;
var in_air = false;
var bkb = 15;
var kbg = 100;
var stale = 0;
var hitlag = 1;

var charge_frames = 0;

for (var i = 0; i < monado.length; i++) {
    characters.push("Shulk (" + monado[i].name + ")");
    characters.push("Shulk (" + decisive_monado[i].name + ")");
    characters.push("Shulk (" + hyper_monado[i].name + ")");
    characters.push("Kirby (" + monado[i].name + ")");
    names.push("Shulk (" + monado[i].name + ")");
    names.push("Shulk (" + decisive_monado[i].name + ")");
    names.push("Shulk (" + hyper_monado[i].name + ")");
    names.push("Kirby (" + monado[i].name + ")");
}

characters.push("Wii Fit Trainer (Deep Breathing (Fastest))");
characters.push("Wii Fit Trainer (Deep Breathing (Slowest))");
names.push("Wii Fit Trainer (Deep Breathing (Fastest))");
names.push("Wii Fit Trainer (Deep Breathing (Slowest))");

function sorted_characters() {
    var list = [];
    for (var i = 0; i < characters.length; i++) {
        list.push({ 'character': characters[i], 'name': names[i] });
    }
    list.sort(function (a, b) {
        return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
    });
    for (var i = 0; i < list.length; i++) {
        characters[i] = list[i].character;
        names[i] = list[i].name;
    }
}

sorted_characters();

var r = 1;

function KBModifier(value) {
    switch (value) {
        case "crouch":
            return  0.85;
        case "grounded":
            return 1; //0.8 applied after hitstun
        case "charging":
            return 1.2;
        case "none":
            return 1;
    }
    return 1;
}

function HitlagCrouch(value) {
    switch (value) {
        case "crouch":
            return 0.67;
    }
    return 1;
}

function HitlagElectric(value) {
    switch (value) {
        case "electric":
            return 1.5;
        case "none":
            return 1;
    }
    return 1;
}

var hitframe = 0;
var faf = 1;

var bounce = false;
var ignoreStale = false;

var powershield = false;
var is_projectile = false;

var megaman_fsmash = false;
var electric = "none";
var crouch = "none";
var is_smash = false;

var wbkb = false;
var windbox = false;
var di = 0;
var luma_percent = 0;

var shieldDamage = 0;

var unblockable = false;

function getResults(){
    var result = { 'training': [], 'vs': [], 'shield': [] };

    base_damage = ChargeSmash(base_damage, charge_frames, megaman_fsmash);
    var damage = base_damage;
    if (attacker.name == "Lucario") {
        damage *= Aura(attacker_percent);
        preDamage *= Aura(attacker_percent);
    }
    damage *= attacker.modifier.damage_dealt;
    damage *= target.modifier.damage_taken;
    preDamage *= attacker.modifier.damage_dealt;
    preDamage *= target.modifier.damage_taken;

    if (!wbkb) {
        trainingkb = TrainingKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, angle, in_air, windbox, di);
        vskb = VSKB(target_percent + preDamage, base_damage, damage, target.attributes.weight, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di);
        trainingkb.addModifier(attacker.modifier.kb_dealt);
        vskb.addModifier(attacker.modifier.kb_dealt);
        trainingkb.addModifier(target.modifier.kb_received);
        vskb.addModifier(target.modifier.kb_received);
    } else {
        trainingkb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, damage, 0, angle, in_air, windbox, di);
        vskb = WeightBasedKB(target.attributes.weight, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, target_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di);
        trainingkb.addModifier(target.modifier.kb_received);
        vskb.addModifier(target.modifier.kb_received);
    }
    trainingkb.bounce(bounce);
    vskb.bounce(bounce);

    var trainingDistance = new Distance(trainingkb.kb, trainingkb.x, trainingkb.y, trainingkb.hitstun, trainingkb.angle, target.attributes.gravity, target.attributes.fall_speed);
    var vsDistance = new Distance(vskb.kb, vskb.x, vskb.y, vskb.hitstun, vskb.angle, target.attributes.gravity, target.attributes.fall_speed);

    var traininglist = List([damage, Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), trainingkb.kb, trainingkb.base_angle, trainingkb.x, trainingkb.y, Hitstun(trainingkb.base_kb, windbox), FirstActionableFrame(trainingkb.base_kb, windbox), AirdodgeCancel(trainingkb.base_kb, windbox), AerialCancel(trainingkb.base_kb, windbox), trainingkb.launch_speed, trainingDistance.max_x, trainingDistance.max_y]);
    var vslist = List([StaleDamage(damage, stale, ignoreStale), Hitlag(damage, is_projectile ? 0 : hitlag, 1, 1), Hitlag(damage, hitlag, HitlagElectric(electric), HitlagCrouch(crouch)), vskb.kb, vskb.base_angle, vskb.x, vskb.y, Hitstun(vskb.base_kb, windbox), FirstActionableFrame(vskb.base_kb, windbox), AirdodgeCancel(vskb.base_kb, windbox), AerialCancel(vskb.base_kb, windbox), vskb.launch_speed, vsDistance.max_x, vsDistance.max_y]);
    if (trainingkb.di_able) {
        traininglist.splice(5, 0, new ListItem("DI angle", + +trainingkb.angle.toFixed(4)));
    }
    if (vskb.di_able) {
        vslist.splice(5, 0, new ListItem("DI angle", + +vskb.angle.toFixed(4)));
    }
    if (trainingkb.tumble) {
        traininglist.splice(7, 0, new ListItem("Gravity KB", +trainingkb.add_gravity_kb.toFixed(4)));
    }
    if (vskb.tumble) {
        vslist.splice(7, 0, new ListItem("Gravity KB", +vskb.add_gravity_kb.toFixed(4)));
    }
    if (r != 1) {
        traininglist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
        vslist.splice(3, 0, new ListItem("KB modifier", "x" + +r.toFixed(4)));
    }
    vslist.splice(3, 0, new ListItem("Rage", "x" + +Rage(attacker_percent).toFixed(4)));
    if (target.modifier.kb_received != 1) {
        traininglist.splice(3, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
        vslist.splice(4, 0, new ListItem("KB received", "x" + +target.modifier.kb_received.toFixed(4)));
    }
    if (attacker.modifier.kb_dealt != 1) {
        traininglist.splice(3, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
        vslist.splice(4, 0, new ListItem("KB dealt", "x" + +attacker.modifier.kb_dealt.toFixed(4)));
    }
    if (attacker.name == "Lucario") {
        traininglist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
        vslist.splice(0, 0, new ListItem("Aura", "x" + +Aura(attacker_percent).toFixed(4)));
    }
    if (is_smash) {
        traininglist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash).toFixed(4)));
        vslist.splice(0, 0, new ListItem("Charged Smash", "x" + +ChargeSmashMultiplier(charge_frames, megaman_fsmash).toFixed(4)));
    }
    if (target.modifier.damage_taken != 1) {
        traininglist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
        vslist.splice(0, 0, new ListItem("Damage taken", "x" + +target.modifier.damage_taken.toFixed(4)));
    }
    if (attacker.modifier.damage_dealt != 1) {
        traininglist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
        vslist.splice(0, 0, new ListItem("Damage dealt", "x" + +attacker.modifier.damage_dealt.toFixed(4)));
    }
    if (preDamage != 0) {
        traininglist.splice(0, 0, new ListItem("Before launch damage", "+" + +preDamage.toFixed(4) + "%"));
        vslist.splice(0, 0, new ListItem("Before launch damage", "+" + +(preDamage * StaleNegation(stale, ignoreStale)).toFixed(4) + "%"));
    }
    if(!ignoreStale){
        vslist.splice(0, 0, new ListItem("Stale-move negation", "x" + +StaleNegation(stale, ignoreStale).toFixed(4)));
    }

    traininglist.push(new ListItem("Tumble", trainingkb.tumble ? "Yes" : "No"));
    vslist.push(new ListItem("Tumble", vskb.tumble ? "Yes" : "No"));
    if (trainingkb.reeling) {
        traininglist.push(new ListItem("Reeling/Spin animation", "30%"));
    }
    if (vskb.reeling) {
        vslist.push(new ListItem("Reeling/Spin animation", "30%"));
    }
    traininglist.push(new ListItem("Can Jab lock", trainingkb.can_jablock ? "Yes" : "No"));
    vslist.push(new ListItem("Can Jab lock", vskb.can_jablock ? "Yes" : "No"));

    if (target.name == "Rosalina And Luma") {
        if (!wbkb) {
            var luma_trainingkb = TrainingKB(15 + luma_percent + preDamage, base_damage, damage, 100, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, angle, in_air, windbox, di);
            var luma_vskb = VSKB(15 + luma_percent + preDamage, base_damage, damage, 100, kbg, bkb, target.attributes.gravity, target.attributes.fall_speed, r, stale, ignoreStale, attacker_percent, angle, in_air, windbox, di);
            luma_trainingkb.addModifier(attacker.modifier.kb_dealt);
            luma_vskb.addModifier(attacker.modifier.kb_dealt);
            luma_trainingkb.addModifier(target.modifier.kb_received);
            luma_vskb.addModifier(target.modifier.kb_received);
            traininglist.push(new ListItem("Luma KB", +luma_trainingkb.kb.toFixed(4)));
            traininglist.push(new ListItem("Luma launched", luma_trainingkb.tumble ? "Yes" : "No"));
            vslist.push(new ListItem("Luma KB", +luma_vskb.kb.toFixed(4)));
            vslist.push(new ListItem("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
        } else {
            var luma_trainingkb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15 + luma_percent, damage, 0, angle, in_air, windbox, di);
            var luma_vskb = WeightBasedKB(100, bkb, kbg, target.attributes.gravity, target.attributes.fall_speed, r, 15+luma_percent, StaleDamage(damage, stale, ignoreStale), attacker_percent, angle, in_air, windbox, di);
            luma_vskb.addModifier(target.modifier.kb_received);
            luma_vskb.addModifier(target.modifier.kb_received);
            traininglist.push(new ListItem("Luma KB", +luma_trainingkb.kb.toFixed(4)));
            traininglist.push(new ListItem("Luma launched", luma_trainingkb.tumble ? "Yes" : "No"));
            vslist.push(new ListItem("Luma KB", +luma_vskb.kb.toFixed(4)));
            vslist.push(new ListItem("Luma launched", luma_vskb.tumble ? "Yes" : "No"));
        }
    }

    result.training = traininglist;
    result.vs = vslist;

    //Shield stuff
    if(!unblockable){
        result.shield = ShieldList([ShieldStun(damage, is_projectile, powershield), ShieldHitlag(damage, hitlag, HitlagElectric(electric)), ShieldAdvantage(damage, hitlag, hitframe, faf, is_projectile, HitlagElectric(electric), powershield)]);
        if(!powershield){
            var s = (base_damage * 1.19) + (shieldDamage * 1.19);
            result.shield.splice(0, 0, new ListItem("Shield Damage", +s.toFixed(4)));
            result.shield.splice(1, 0, new ListItem("Full HP shield", +(50 * target.modifier.shield).toFixed(4)));
            result.shield.splice(2, 0, new ListItem("Shield Break", s >= 50 * target.modifier.shield ? "Yes" : "No"));

        }
    }else{
        result.shield = ([new ListItem("Unblockable attack", "Yes")]);
    }

    return result;
}