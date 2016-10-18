## Sm4sh Calculator
Web based Smash 4 knockback calculator

## Calculator

### Recent Changes
* Changed - New design
* Added - [Lucario's Aura stock difference multipliers](https://twitter.com/KuroganeHammer/status/784017200721965057)
* Added - Palutena's/Silver Bow, Flare Blade and Shield Breaker damage formulas
* Added - Calculate aerials FAF using landing lag or autocancel
* Fixed - Jump Monado Art Fall speed multiplier
* Changed - Display horizontal and vertical launch speed instead of launch speed at launch direction
* Changed - Vectoring and gravity affect launch speed instead of knockback
* Added - Stage spawn positions added
* Fixed - Improved distance calculation and launch visualizer can now show sliding off surfaces and multiple bouncing off on stage surfaces
* Added - Vectoring knockback multiplier
* Changed - On Results page maximum distance for training and vs modes is calculated instead of the one selected for the visualizer 
* Added - Detect Mega Man's Fsmash
* Fixed - Samus and Mii Gunner gravity values
* Added - Ryu True specials

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
* Hitstun
* Hitstun cancel frames (Not 100% accurate)
* Determine if the move can jab lock
* Shield stun
* Shield Hitlag
* Shield Advantage
* Luma knockback
* When Reeling/Untechable spin animation could happen
* Launch speed
* Gravity launch speed boost
* Vectoring
* Max distance when hitstun ends (Not accurate, see Launch Visualizer)

#### Launch Visualizer
Note: Work in progress, this is not a combo calculator, distance calculation is not accurate, stage layout collision detection might give weird results and bounced trajectories are not accurate

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
* Improve or find in-game Hitstun cancel frames formula
* Improve distance calculation

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

Read wiki page for more details: https://github.com/rubendal/Sm4sh-Calculator/wiki/Move-Search

## Percentage Calculator
http://rubendal.github.io/Sm4sh-Calculator/percentcalc.html

Get target percent required to obtain certain knockback

Note: WBKB isn't supported due to being weight related

Update: Removed X and Y component calculation since these don't represent distance launched, distance calculation is also affected by hitstun and other factors giving wrong results

## TSV Generator
http://rubendal.github.io/Sm4sh-Calculator/tsvgen.html

Generate TSV files containing character, damage, knockback and distance launched data

Use these generated data tables in another applications (R, Excel, and others) to create graphs or filter stuff

Read wiki page for more details: https://github.com/rubendal/Sm4sh-Calculator/wiki/TSV-Generator

## Issues and Feedback
You can [open an Issue here](https://github.com/rubendal/Sm4sh-Calculator-Web/issues) or DM me on [Twitter](https://twitter.com/Ruben_dal) your issues and feedback

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)
* [ssbwiki.com](http://www.ssbwiki.com)
* [Meshima's](https://twitter.com/LettuceUdon) [params spreadsheet](https://docs.google.com/spreadsheets/d/1FgOsGYfTD4nQo4jFGJ22nz5baU1xihT5lreNinY5nNQ/edit#gid=305485435) (and everyone contributing here)