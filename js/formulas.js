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

function Aura(percent) {
    if (percent <= 70) {
        return (66 + ((17.0 / 35.0) * percent)) / 100;
    }
    if (percent <= 190) {
        return (100 + ((7.0 / 12.0) * (percent - 70))) / 100;
    }
    return 1.7;
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
        return 45;
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

function AerialCancel(kb, windbox) {
    var hitstun = Hitstun(kb, windbox);
    if (hitstun < 46) {
        return FirstActionableFrame(kb);
    }
    if (hitstun >= 46 && hitstun < 55) {
        return 46;
    }
    if (kb >= 180) {
        return FirstActionableFrame(kb);
    }
    var percent = 1 - ((hitstun - 41) / (70 - 41));
    if (percent > .09) {
        percent = .09;
    }
    var res = Math.floor(hitstun - (hitstun * percent));
    if (res < 46) {
        return 46;
    }
    return res;
}

function AirdodgeCancel(kb, windbox) {
    var hitstun = Hitstun(kb, windbox);
    if (hitstun < 41) {
        return FirstActionableFrame(kb);
    }
    if (hitstun >= 41 && hitstun < 59) {
        return 41;
    }
    if (kb >= 230) {
        return FirstActionableFrame(kb);
    }
    var percent = 1 - ((hitstun - 41) / (90 - 41));
    if (percent > .15) {
        percent = .15;
    }
    var res = Math.floor(hitstun - (hitstun * percent));
    if (res < 41) {
        return 41;
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

function ChargeSmash(base_damage, frames, megaman_fsmash) {
    if (megaman_fsmash) {
        return base_damage * (1 + (frames / 86));
    }
    return base_damage * (1 + (frames / 150));
}

function ChargeSmashMultiplier(frames, megaman_fsmash) {
    if (megaman_fsmash) {
        return (1 + (frames / 86));
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
    return 10 * Math.sin((angle-move_angle) * Math.PI / 180);
}

function LaunchSpeed(kb){
    return kb * 0.03;
}

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