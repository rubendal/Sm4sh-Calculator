function TrainingKB(percent, base_damage, damage, weight, kbg, bkb, gravity, fall_speed, r, angle, in_air, windbox, di) {
    return new Knockback((((((((percent + damage) / 10) + (((percent + damage) * base_damage) / 20)) * (200 / (weight + 100)) * 1.4) + 18) * (kbg / 100)) + bkb) * r, angle, gravity, fall_speed, in_air, windbox, percent + damage,di);
}

function Rage(percent) {
    if (percent <= 35) {
        return 1;
    }
    if (percent >= 150) {
        return 1.15;
    }
    return 1 + (percent - 35) * (1.15 - 1) / (150 - 35);
}

function Aura(percent, stock_dif, game_format) {
    if(stock_dif == undefined){
        stock_dif = "0";
    }
    if(game_format == undefined){
        game_format = "Singles";
    }
    var aura = 0;
    if (percent <= 70) {
        aura = (66 + ((17.0 / 35.0) * percent)) / 100;
    }else if (percent <= 190) {
        aura = (100 + ((7.0 / 12.0) * (percent - 70))) / 100;
    }else{
        aura = 1.7;
    }
    //Stock difference data by KuroganeHammer, @A2E_smash and @Rmenaut, https://twitter.com/KuroganeHammer/status/784017200721965057
    //For Doubles https://twitter.com/KuroganeHammer/status/784372918331383808
    var m = 1;
    var min = 0.6;
    var max = 1.7;
    if(stock_dif == "0"){
        return aura;
    }
    if(game_format == "Singles"){
        switch(stock_dif){
            case "-2":
                m = 1.3333;
                min = 0.88;
                max = 1.8;
            break;
            case "-1":
                m = 1.142;
                min = 0.753;
                max = 1.8;
            break;
            case "+1":
                m = 0.8888;
                max = 1.51;
            break;
            case "+2":
                m = 0.8;
                max = 1.36;
            break;
        }
    }else{
        switch(stock_dif){
            case "-2":
                m = 2;
                min = 1.32;
                max = 1.8;
            break;
            case "-1":
                m = 1.3333;
                min = 0.88;
                max = 1.8;
            break;
            case "+1":
                m = 0.8;
                max = 1.36;
            break;
            case "+2":
                m = 0.6333;
                max = 1.076;
            break;
        }
    }
    aura *= m;
    if(aura < min){
        aura = min;
    }else if(aura > max){
        aura = max;
    }
    return aura;
}

function StaleNegation(timesInQueue, ignoreStale) {
    if (ignoreStale) {
        return 1;
    }
    if (timesInQueue > 9) {
        timesInQueue = 9;
    }
    if (timesInQueue == 0) {
        return 1.05;
    }
    var S = [0, 8, 7.594, 6.782, 6.028, 5.274, 4.462, 3.766, 2.954, 2.2];
    var s = 1;
    for(var i = 0; i <= timesInQueue; i++)
    {
        s -= S[i] / 100;
    }
    return s;
}

function Hitstun(kb, windbox) {
    if (windbox) {
        return 0;
    }
    var hitstun = Math.floor(kb * 0.4) - 1;
    if (hitstun < 0) {
        return 0;
    }
    return hitstun;
}

function SakuraiAngle(kb, aerial) {
    if (aerial) {
        return (.79 * 180 / Math.PI);
    }
    if (kb < 60) {
        return 0;
    }
    if (kb >= 88) {
        return 40;
    }
    return (kb - 60) / 0.7;
}

function VSKB(percent, base_damage, damage, weight, kbg, bkb, gravity, fall_speed, r, timesInQueue, ignoreStale, attacker_percent, angle, in_air, windbox, di) {
    var s = StaleNegation(timesInQueue, ignoreStale);
    return new Knockback((((((((percent + damage * s) / 10 + (((percent + damage * s) * base_damage * (1 - (1 - s) * 0.3)) / 20)) * 1.4 * (200 / (weight + 100))) + 18) * (kbg / 100)) + bkb)) * (r * Rage(attacker_percent)), angle, gravity, fall_speed, in_air, windbox, percent + (damage*s),di);
}

function WeightBasedKB(weight, wbkb, kbg, gravity, fall_speed, r, target_percent, damage, attacker_percent, angle, in_air, windbox, di) {
    return new Knockback(((((1 + (wbkb / 2)) * (200 / (weight + 100)) * 1.4) + 18) * (kbg / 100)) * (r * Rage(attacker_percent)), angle, gravity, fall_speed, in_air, windbox, target_percent + damage,di);
}

function StaleDamage(base_damage, timesInQueue, ignoreStale) {
    return base_damage * StaleNegation(timesInQueue, ignoreStale);
}

function FirstActionableFrame(kb, windbox) {
    var hitstun = Hitstun(kb, windbox);
    if (hitstun == 0) {
        return 0;
    }
    return hitstun + 1;
}

function HitstunCancel(kb, launch_speed_x, launch_speed_y, angle, windbox) {
    var res = { 'airdodge': 0, 'aerial': 0 };
    if (windbox) {
        return res;
    }
    var hitstun = Hitstun(kb, windbox);
    var res = { 'airdodge': hitstun + 1, 'aerial': hitstun + 1 };
    var airdodge = false;
    var aerial = false;
    var launch_speed = { 'x': launch_speed_x, 'y': launch_speed_y };
    var decay = { 'x': 0.051 * Math.cos(angle * Math.PI / 180), 'y': 0.051 * Math.sin(angle * Math.PI / 180) };
    for (var i = 0; i < hitstun; i++) {
        if (launch_speed.x != 0) {
            var x_dir = launch_speed.x / Math.abs(launch_speed.x);
            launch_speed.x -= decay.x;
            if (x_dir == -1 && launch_speed.x > 0) {
                launch_speed.x = 0;
            } else if (x_dir == 1 && launch_speed.x < 0) {
                launch_speed.x = 0;
            }
        }
        if (launch_speed.y != 0) {
            var y_dir = launch_speed.y / Math.abs(launch_speed.y);
            launch_speed.y -= decay.y;
            if (y_dir == -1 && launch_speed.y > 0) {
                launch_speed.y = 0;
            } else if (y_dir == 1 && launch_speed.y < 0) {
                launch_speed.y = 0;
            }
        }
        var lc = Math.sqrt(Math.pow(launch_speed.x, 2) + Math.pow(launch_speed.y, 2));
        if (lc < 2.5 && !airdodge) {
            airdodge = true;
            res.airdodge = Math.max(i + 1, 41);
        }
        if (lc < 2 && !aerial) {
            aerial = true;
            res.aerial = Math.max(i + 1, 46);
        }
    }

    if (res.airdodge > hitstun) {
        res.airdodge = hitstun + 1;
    }
    if (res.aerial > hitstun) {
        res.aerial = hitstun + 1;
    }
    
    return res;
}

function Hitlag(base_damage, hitlag_mult, electric, crouch) {
    var h = Math.floor((((base_damage / 2.6 + 5) * electric) * hitlag_mult) * crouch) - 1;
    if (h > 30) {
        return 30;
    }
    if (h < 0) {
        return 0;
    }
    return h;
}

function ChargeSmash(base_damage, frames, megaman_fsmash, witch_time) {
    if (megaman_fsmash) {
        return base_damage * (1 + (frames / 86));
    }
    if(witch_time){
        return base_damage * (1 + (frames * 0.5 / 150));
    }
    return base_damage * (1 + (frames / 150));
}

function ChargeSmashMultiplier(frames, megaman_fsmash, witch_time) {
    if (megaman_fsmash) {
        return (1 + (frames / 86));
    }
    if(witch_time){
        return (1 + (frames * 0.5 / 150));
    }
    return (1 + (frames / 150));
}

function ShieldStun(damage, is_projectile, powershield) {
    if (is_projectile) {
        if (powershield) {
            return Math.floor((damage/5.22)+3)-1;
        }
        return Math.floor((damage / 3.5) + 3) - 1;
    } else {
        if (powershield) {
            return Math.floor((damage / 2.61) + 3) - 1;
        }
        return Math.floor((damage / 1.72) + 3) - 1;
    }
}

function ShieldHitlag(damage, hitlag, electric) {
    return Hitlag(damage, hitlag, electric, 1);
}

function AttackerShieldHitlag(damage, hitlag, electric) {
    if (hitlag > 1) {
        hitlag /= 1.25;
        if (hitlag < 1) {
            hitlag = 1;
        }
    }
    return ShieldHitlag(damage, hitlag, electric);
}

function ShieldAdvantage(damage, hitlag, hitframe, FAF, is_projectile, electric, powershield ) {
    return hitframe - (FAF - 1) + ShieldStun(damage, is_projectile, powershield) + ShieldHitlag(damage,hitlag,electric) - (is_projectile ? 0 : AttackerShieldHitlag(damage, hitlag, electric));
}

function DI(angle, move_angle){
    if(angle == -1){
        return 0;
    }
    //Value was 10, however in params is 0.17 in radians, https://twitter.com/LettuceUdon/status/766640794807603200
    return (0.17 * 180 / Math.PI) * Math.sin((angle-move_angle) * Math.PI / 180);
}

function Vectoring(angle, launch_angle) {
    if(angle == -1){
        return 1;
    }
    if (launch_angle >= 65 && launch_angle <= 115) {
        return 1;
    }
    if (launch_angle >= 245 && launch_angle <= 295) {
        return 1;
    }
    if (angle >= 0 && angle <= 180) {
        return 1 + ((1.095 - 1) * Math.sin(angle * Math.PI / 180));
    }
    return 1 + ((1 - 0.92) * Math.sin(angle * Math.PI / 180));
    
}

function LaunchSpeed(kb){
    return kb * 0.03;
}

function HitAdvantage(hitstun, hitframe, faf) {
    return hitstun - (faf - hitframe);
}

//Launch visualizer formulas

function InvertXAngle(angle){
    if(angle < 180){
        return 180 - angle;
    }else{
        return 360 - (angle - 180);
    }
}

function InvertYAngle(angle){
    if(angle < 180){
        return (180 - angle) + 180;
    }else{
        return 180 - (angle - 180);
    }
}

function insideSurface(point, surface) {
    var x = point[0];
    var y = point[1];

    var inside = false;
    for (var i = 0, j = surface.length - 1; i < surface.length; j = i++) {
        var xi = surface[i][0];
        var yi = surface[i][1];
        var xj = surface[j][0];
        var yj = surface[j][1];

        var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect){
            inside = !inside;
        }
    }

    return inside;
};

function closestLine(point, surface){
    var x = point[0];
    var y = point[1];

    var line = [];
    var min_distance = null;

    for(var i=0;i<surface.length-1;i++){
        var x1 = surface[i][0];
        var x2 = surface[i+1][0];
        var y1 = surface[i][1];
        var y2 = surface[i+1][1];
        var distance = Math.abs(((y2-y1) * x) - ((x2-x1) * y) + (x2*y1) - (y2*x1)) / Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2));
        if(min_distance == null){
            min_distance = distance;
            line = [[x1,y1],[x2,y2]];
        }else{
            if(distance < min_distance){
                min_distance = distance;
                line = [[x1,y1],[x2,y2]];
            }
        }
    }
    return line;
}

function findSubArray(array, find){
    for(var i=0;i<array.length;i++){
        var found = true;
        for(var j=0;array[i].length;j++){
            if(array[i][j] != find[j]){
                found = false;
                break;
            }
            if(found){
                return true;
            }
        }
    }
    return false;
}

function lineIsFloor(line, surface, edges){
    //Get surface floor
    var floor = [];
    var edgeid = -1;
    var found = false;
    for(var i=0;i<surface.length;i++){
        if(edgeid != -1 && !found){
            floor.push(surface[i]);
        }
        if((surface[i][0] == edges[0][0] && surface[i][1] == edges[0][1]) || (surface[i][0] == edges[1][0] && surface[i][1] == edges[1][1])){
            if(edgeid==-1){
                floor.push(surface[i]);
            }
            if(edgeid != -1){
                found = true;
                return (findSubArray(floor,line[0]) && findSubArray(floor,line[1]));
            }
            if((surface[i][0] == edges[0][0] && surface[i][1] == edges[0][1])){
                edgeid = 0;
            }else{
                edgeid = 1;
            }
            
        }
    }
    return (findSubArray(floor,line[0]) && findSubArray(floor,line[1]));
}

function getFloorLines(surface, edges){
    var floor = [];
    var found = false;
    var edgeid = -1;
    for(var i=0;i<surface.length;i++){
        if(edgeid != -1 && !found){
            floor.push(surface[i]);
        }
        if((surface[i][0] == edges[0][0] && surface[i][1] == edges[0][1]) || (surface[i][0] == edges[1][0] && surface[i][1] == edges[1][1])){
            if(edgeid==-1){
                floor.push(surface[i]);
            }
            if(edgeid != -1){
                found = true;
                return floor;
            }
            if((surface[i][0] == edges[0][0] && surface[i][1] == edges[0][1])){
                edgeid = 0;
            }else{
                edgeid = 1;
            }
            
        }
    }
    return floor;
}

function IntersectionPoint(line_a, line_b){
    var x1 = line_a[0][0];
    var x2 = line_a[1][0];
    var y1 = line_a[0][1];
    var y2 = line_a[1][1];
    var x3 = line_b[0][0];
    var x4 = line_b[1][0];
    var y3 = line_b[0][1];
    var y4 = line_b[1][1];
    var d = ((x1-x2)*(y3-y4))-((y1-y2)*(x3-x4));
    var x = (((x1*y2)-(y1*x2))*(x3-x4))-((x1-x2)*((x3*y4)-(y3*x4)));
    var y = (((x1*y2)-(y1*x2))*(y3-y4))-((y1-y2)*((x3*y4)-(y3*x4)));
    if(d!=0){
        return [x/d,y/d];
    }
    return null;
}

function PointInLine(point, line){
    var x = point[0];
    var y = point[1];
    var x1 = line[0][0];
    var x2 = line[1][0];
    var y1 = line[0][1];
    var y2 = line[1][1];
    var distance = Math.abs(((y2-y1) * x) - ((x2-x1) * y) + (x2*y1) - (y2*x1)) / Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2));
    if(distance < 0.0001){
        return x1 <= x && x2 >= x;
    }
    return false;
}