## Sm4sh Calculator
Web based Smash 4 knockback calculator

### Github Pages
http://rubendal.github.io/Sm4sh-Calculator/

## Calculator

### Recent Changes
* Added - Parsed Hitbox active frame and FAF from KH API
* Added - Deep Breathing damage reduction
* Added - Show vertical component KB increase/decrease done by gravity, Y value already has this value added
* Changed - Removed Cloud (Limit Break) from attacker list
* Added - Detect most Chargeable specials
* Added - Detect Smash attacks
* Changed - Invalidated throws since these have wrong data in the API
* Changed - Invalid data message is shown when having blank inputs or inputs with values higher than maximum instead of showing NaN
* Added - Windboxes/Flinchless hitboxes
* Added - Using KuroganeHammer's API to get move list (Some attacks might have missing data, these will show empty inputs since the API isn't complete, also it could have wrong data so double check with the website)
* Added - Freshness bonus and ignore staleness option
* Added - Attribute editor
* Added - Custom Monado Arts (Decisive and Hyper)

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
* Update API stuff once KH API update 0.2.0 releases (Throw data)
* Improve Hitstun cancel frames formula

## Move Filter
http://rubendal.github.io/Sm4sh-Calculator/filter.html

Search for moves that match certain conditions

Filter moves by:
* Name
* First hitbox active frame
* Base damage
* Angle
* BKB
* KBG
* Set knockback

### Issues
You can [open an Issue here](https://github.com/rubendal/Sm4sh-Calculator-Web/issues), all KH API related issues will be sent to [Frannsoft](https://github.com/Frannsoft/FrannHammer)

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)
* [ssbwiki.com](http://www.ssbwiki.com)
