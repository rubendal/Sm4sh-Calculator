## Sm4sh Calculator Web
Web Smash 4 knockback calculator

## Github Pages
http://rubendal.github.io/Sm4sh-Calculator-Web/

### Recent Changes
* Added - Using KuroganeHammer's API to get move list (Currently shows single hitbox attacks, some might have missing data showing empty inputs since the API isn't complete)
* Added - Freshness bonus and ignore staleness option
* Added - Attribute editor
* Added - Custom Monado Arts (Decisive and Hyper)
* Added - Mega Man Fsmash charge formula
* Added - Shield stun, Shield Hitlag and Shield Advantage
* Added - Check if attack will jab lock or not
* Added - Check if attack will make the target enter tumble
* Fixed - Recalculate angle when using Sakurai angle and using KB modifiers
* Fixed - KB formula fixed when using damage modifiers (Aura, Monado, Deep Breathing )
* Changed - Ignore X and Y components when using angles > 361 since these are special angles

### How to use it

Just input your data, the calculator will update the results when you change something

To access KuroganeHammer's API it is required to use webpage with http instead of https (unless you deactivate mixed content blocking on your web browser since the API doesn't support https) for attack list

To fill move related data (Base damage, Angle, BKB, KBG) use [KuroganeHammer frame data repository](http://kuroganehammer.com/Smash4)

### What does it calculate
* Modifiers like Monado Arts and Deep Breathing
* Rage
* Aura
* Charged Smash attacks multiplier
* Hitlag (Attacker and Target)
* Knockback modifiers
* Stale-move negation
* Sakurai Angle
* Knockback Horizontal and Vertical components
* Gravity included in the vertical component
* Hitstun
* Hitstun cancel frames (Not 100% accurate)
* Determine if the move can jab lock
* Shield stun
* Shield Hitlag
* Shield Advantage

### To Do
* Add attacks using KuroganeHammer's API (Trying to parse multiple hitboxes)
* Improve Hitstun cancel frames formula

### Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [ssbwiki.com](http://www.ssbwiki.com)
