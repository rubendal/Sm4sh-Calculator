## Sm4sh Calculator
Web based Smash 4 knockback calculator

## Calculator

### Recent Changes
* Changed - DI angle changed from 10 degrees to 0.17 radians which is the one used in-game (https://twitter.com/LettuceUdon/status/766640794807603200)
* Changed - Sakurai angle for airborne opponents changed to 0.79 radians
* Changed - Launch visualizer bouncing on surface checks target speed and verifies if it bounce or stops
* Changed - Implemented maximum horizontal speed for moves with 0 and 180 degrees angle
* Improved - Stage layout collision detection improved, will avoid additional calculations if target position isn't near, improving distance calculation performance
* Added - Marker on launch visualizer that indicates when a move KO's the target
* Launch visualizer merged with the calculator
* Added - Stage, position, game mode and graph options to the new visualizer section
* Added - Results are now divided by numeric results and the launch visualizer
* Changed - Selected game mode will show maximum distance on the results affected by stage layout and target hit position
* Added - Grounded meteors and surface bouncing will be detected and reflected on the calculator knockback modifier

#### Launch visualizer updates
* A lot of bug fixes...
* Improved collision detection by detecting collision position and additional calculations to solve some results that made launch trajectory "pass-through" stage layout
* Improved position precision when sliding through layout
* Fixed inverse move angle X-axis making DI angle change calculation give wrong results

### How to use it
Just input your data, the calculator will update the results when you change something

To access KuroganeHammer's API it is required to use webpage with http instead of https (unless you deactivate mixed content blocking on your web browser since the API doesn't support https) for attack list, some attacks might have missing data, these will show empty inputs since the API isn't complete or the website doesn't have them, also it could have wrong data so double check with the website

If the API is not available or having issues you can fill move related data (Base damage, Angle, BKB, KBG) using [KuroganeHammer frame data repository](http://kuroganehammer.com/Smash4)

### What does it calculate
* Modifiers like Monado Arts and Deep Breathing
* Rage
* Aura
* Charged Smash attacks multiplier
* Countered damage
* Hitlag (Attacker and Target)
* Knockback modifiers
* Stale-move negation
* Sakurai Angle
* DI angle
* Knockback Horizontal and Vertical components
* Gravity included in the vertical component
* Hitstun
* Hitstun cancel frames (Not 100% accurate)
* Determine if the move can jab lock
* Shield stun
* Shield Hitlag
* Shield Advantage
* Luma knockback
* When Reeling/Untechable spin animation could happen
* Launch speed
* Max distance

#### Launch Visualizer
Note: Work in progress, stage layout collision detection might give weird results and bounced trajectories are not accurate and can only calculate one bounce per calculation

Visualize launch trajectory, position per hitstun frame and distance launched in a graph and display stage layout with some collision detection

* Each marker represents each frame in hitstun
* Line color represents vertical momentum
* Yellow markers represents frames that hitstun can be cancelled by using an airdodge
* Green markers represents frames that hitstun can be cancelled by using an aerial
* Give target position when hit using x,y coordinates
* Move angle can be inverted horizontally to visualize launching opponents to the left
* X-axis can represent a surface to show traction and bouncing effects when no stage is selected
* Add legal stage layout with platforms and blast zones with physics (Collision, traction along surfaces, bounce off a surface angle calculation)

### To Do
* Improve Hitstun cancel frames formula

## Move Search
http://rubendal.github.io/Sm4sh-Calculator/movesearch.html

Search for moves that match certain conditions using filters

Filter moves by:
* Name/Character/Type
* Hitbox startup frame
* Active hitbox frame
* FAF
* Landing lag
* Autocancel frame
* Base damage
* Angle
* BKB/WBKB
* KBG

### Name filter format
* Case insensitive
* `,` == or
* `&` == and
* `-` == not
* `"name"` == Move name is exactly the one between double quotes
* `character:name` == filter by character
* `type:movetype` == filter by type (jab, tilt, dashattack, smash, aerial, grab, throw, taunt, special, counter, commandgrab, unblockable, windbox, multihit, extrashielddamage, weightdependentthrow)


#### Examples
* ftilt & up (Ftilt AND up: all ftilts capable of being angled up)
* up,down & fsmash (up OR down AND fsmash: all fsmash angled up or down)
* rapid jab,-finisher (rapid jab NOT finisher: all rapid jabs without finisher hitbox)
* counter,-attack,-late,-hit,witch time,substitute,vision,toad (All counter moves counter frames)
* character:pit,character:dark pit,& type:smash (Pit and Dark Pit smash attacks)
* type:dashattack (All dash attacks)

## Percentage Calculator
http://rubendal.github.io/Sm4sh-Calculator/percentcalc.html

Get target percent required to obtain certain knockback

Note: WBKB isn't supported due to being weight related

Update: Removed X and Y component calculation since these don't represent distance launched, distance calculation is also affected by hitstun and other factors giving wrong results

Planning to change application to calculate distance instead of knockback for Horizontal and Vertical Distance

## Issues
You can [open an Issue here](https://github.com/rubendal/Sm4sh-Calculator-Web/issues) or DM me on [Twitter](https://twitter.com/Ruben_dal), all KH API related issues will be sent to [Frannsoft](https://github.com/Frannsoft/FrannHammer)

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)
* [ssbwiki.com](http://www.ssbwiki.com)
