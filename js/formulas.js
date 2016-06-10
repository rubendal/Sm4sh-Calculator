function TrainingKB(percent,base_damage,weight,kbg,bkb,gravity,r,angle,in_air) {
    return new Knockback((((((((percent + base_damage) / 10) + (((percent + base_damage) * base_damage) / 20)) * (200 / (weight + 100)) * 1.4) + 18) * (kbg / 100)) + bkb) * r, angle, gravity, in_air);
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

function StaleNegation(timesInQueue) {
    if (timesInQueue > 9) {
        timesInQueue = 9;
    }
    var S = [0, 8, 7.594, 6.782, 6.028, 5.274, 4.462, 3.766, 2.954, 2.2];
    var s = 1;
    for(var i = 0; i <= timesInQueue; i++)
    {
        s -= S[i] / 100;
    }
    return s;
}

function Hitstun(kb) {
    return Math.floor(kb * 0.4) - 1;
}

function SakuraiAngle(kb, aerial) {
    if (aerial) {
        return 45;
    }
    if (kb <= 66) {
        return 0;
    }
    if (kb >= 88) {
        return 40;
    }
    return 40 * (kb - 66) / (88 - 66);
}

function VSKB(percent, base_damage, weight, kbg, bkb, gravity, r, timesInQueue, attacker_percent, angle, in_air) {
    var s = StaleNegation(timesInQueue);
    return new Knockback((((((((percent + base_damage * s) / 10 + (((percent + base_damage * s) * base_damage * (1 - (1 - s) * 0.3)) / 20)) * 1.4 * (200 / (weight + 100))) + 18) * (kbg / 100)) + bkb)) * (r*Rage(attacker_percent)), angle, gravity, in_air);
}

function StaleDamage(base_damage, timesInQueue) {
    return base_damage * StaleNegation(timesInQueue);
}

function NextActionableFrame(kb) {
    var hitstun = Hitstun(kb);
    return hitstun + 1;
}

function AerialCancel(kb) {
    var hitstun = Hitstun(kb);
    if (hitstun < 46) {
        return NextActionableFrame(kb);
    }
    if (hitstun >= 46 && hitstun < 56) {
        return 46;
    }
    if (kb >= 180) {
        return NextActionableFrame(kb);
    }
    var percent = 1 - ((hitstun - 46) / (72 - 46));
    if (percent > .1) {
        percent = .1;
    }
    var res = Math.floor(hitstun - (hitstun * percent));
    if (res < 46) {
        return 46;
    }
    return res;
}

function AirdodgeCancel(kb) {
    var hitstun = Hitstun(kb);
    if (hitstun < 41) {
        return NextActionableFrame(kb);
    }
    if (hitstun >= 41 && hitstun < 60) {
        return 41;
    }
    if (kb >= 230) {
        return NextActionableFrame(kb);
    }
    var percent = 1 - ((hitstun - 41) / (91 - 41));
    if (percent > .2) {
        percent = .2;
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

function ChargeSmash(base_damage, frames) {
    return base_damage * (1 + (frames / 150));
}