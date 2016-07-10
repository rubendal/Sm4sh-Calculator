function TrainingKB(percent, base_damage, damage, weight, kbg, bkb, gravity, r, angle, in_air, windbox) {
    return new Knockback((((((((percent + damage) / 10) + (((percent + damage) * base_damage) / 20)) * (200 / (weight + 100)) * 1.4) + 18) * (kbg / 100)) + bkb) * r, angle, gravity, in_air, windbox);
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
    return 40 * (kb - 59.9999) / (88 - 59.9999);
}

function VSKB(percent, base_damage, damage, weight, kbg, bkb, gravity, r, timesInQueue, ignoreStale, attacker_percent, angle, in_air, windbox) {
    var s = StaleNegation(timesInQueue, ignoreStale);
    return new Knockback((((((((percent + damage * s) / 10 + (((percent + damage * s) * base_damage * (1 - (1 - s) * 0.3)) / 20)) * 1.4 * (200 / (weight + 100))) + 18) * (kbg / 100)) + bkb)) * (r * Rage(attacker_percent)), angle, gravity, in_air, windbox);
}

function WeightBasedKB(weight, wbkb, kbg, gravity, r, attacker_percent, angle, in_air, windbox) {
    return new Knockback(((((1 + (wbkb / 2)) * (200 / (weight + 100)) * 1.4) + 18) * (kbg / 100)) * (r * Rage(attacker_percent)), angle, gravity, in_air, windbox);
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