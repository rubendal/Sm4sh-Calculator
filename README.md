## Sm4sh Calculator
Web based Smash 4 knockback calculator

### Recent Changes
* Added - Set weight to 100 flag for moves that make the opponent have 100 weight like paralyzers and Finishing Touch
* Added - Parameter editing (for modders and researchers)
* Changed - Using new vectoring formula obtained with new discoveries
* Changed - Vectoring is now calculated with DI
* Added - Hit Advantage
* Added - Hitstun cancel calculation process
* Added - URL Sharing
* Changed - Improved move detection, also chargeable specials can be detected
* Probably fixed - Move list loading bug, when changing characters sometimes previous character moves were loaded
* Changed - Character attribute modifiers (Monado Arts, Limit Break, Deep Breathing) are now selected in a different location instead of all being in the character selection inputs
* Changed - New design

### KH API and HTTPS
To access KuroganeHammer's API it is required to navigate the webpage with http instead of https (unless you deactivate mixed content blocking on your web browser since the API doesn't support https) for move list, switching the url to http will solve this issue

### How to use it
Just input your data, the calculator will update the results when you change something

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
* Hitstun cancel frames
* Determine if the move can jab lock
* Shield stun
* Shield Hitlag
* Shield Advantage
* Luma knockback
* When Reeling/Untechable spin animation could happen
* Launch speed
* Gravity launch speed boost
* Vectoring
* Max distance when hitstun ends

#### Launch Visualizer
Note: Work in progress, this is not a combo calculator, distance calculation may not accurate, stage layout collision detection might give weird results and bounced trajectories are not accurate

Visualize launch trajectory, position per hitstun frame and distance launched in a graph and display stage layout with some collision detection

* Each marker represents each frame in hitstun
* Line color represents vertical momentum
* Yellow markers represents frames that hitstun can be cancelled by using an airdodge
* Green markers represents frames that hitstun can be cancelled by using an aerial
* Give target position when hit using x,y coordinates
* Move angle can be inverted horizontally to visualize launching opponents to the left
* X-axis can represent a surface to show traction and bouncing effects when no stage is selected
* Add legal stage layout with platforms and blast zones with physics (Collision, traction along surfaces, bounce off a surface angle calculation)

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

Get target percent required to obtain certain knockback, on WBKB moves calculate the minimum rage to reach specified knockback

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