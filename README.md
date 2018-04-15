## Sm4sh Calculator
Web based Smash 4 knockback calculator

### How to use it
Just input your data, the calculator will update the results when you change something

If the API is not available or having issues you can fill move related data (Base damage, Angle, BKB, WBKB, KBG and frame data) using [KuroganeHammer frame data repository](http://kuroganehammer.com/Smash4)

#### Launch Visualizer
*Note: Stage layout collision detection might give weird results and bounced trajectories are not accurate, character models/ECBs/animations not included so KO percents are not accurate* 

Visualize launch trajectory, position per hitstun frame and distance launched in a graph and display stage layout with collision detection

* Each marker represents each frame in hitstun
* Line color represents vertical momentum
* Cyan markers represents frames that hitstun can be cancelled by using an airdodge
* Magenta markers represents frames that hitstun can be cancelled by using an aerial
* Move angle can be inverted horizontally to visualize hitting opponents from the right side
* Add stage layout with platforms and blast zones with physics (Collision, traction along surfaces, bounce off a surface angle calculation)

## Tools

### KO calculator
https://rubendal.github.io/Sm4sh-Calculator/kocalc.html

Calculates opponent's KO percentages on inputted position on a stage, it can also calculate best DI angle the opponent can use to survive on that position or generate a vector field to get best di possible on various positions however this calculation is a heavy process so it could freeze the page for a moment or even get a popup that the page isn't responding

Reminder: character models/ECBs/animations not included so KO percents are not accurate by a small margin

### Percentage Calculator
https://rubendal.github.io/Sm4sh-Calculator/percentcalc.html

Get target percent required to obtain certain knockback, on WBKB moves calculate the minimum rage to reach specified knockback

### Move Search
https://rubendal.github.io/Sm4sh-Calculator/movesearch.html

Search for moves that match certain conditions using filters

Read wiki page for more details: https://github.com/rubendal/Sm4sh-Calculator/wiki/Move-Search

### Script Viewer
https://rubendal.github.io/Sm4sh-Calculator/scripts.html

All scripts were scrapped using Sammi Husky's Sm4sh Tools (SALT and FITD) and stored in json files with a flag for those that contain hitboxes

Scripts version: 1.1.6/1.1.7

### Script Diff Viewer
https://rubendal.github.io/Sm4sh-Calculator/scriptdiff.html

View character scripts being diffed between the first version they were available (3DS 1.0.0 for non-DLC characters) and the current patch with character changes 1.1.6 to check all changes they had between patches, it also allows checking diffs of changes between patches

### Script Search
https://rubendal.github.io/Sm4sh-Calculator/scriptsearch.html

Search all character game.bin scripts that match certain regular expression on each line, can use a negative regular expression to make easier expressions and filter by script Name

Usually useful if you want to research certain hitboxes or events with certain parameters like SDI, trip chance or unknown events found in all character scripts

Some examples:

* `Clang=0x1.*Rebound=0x0` (Moves that can clank but cannot rebound)
* `ShieldDamage=[1-9][0-9]*` (Hitboxes that deal shield damage)
* `SDI=0,` (Hitboxes that cannot be SDI'd)
* `Set_Weight` (Search scripts that contain hitboxes that ignore weight)
* `Damage=[1-9][0-9]*.*Flinchless=0x1` (Windboxes that deal damage)
* `WKB=[1-9][0-9]*.*Rehit=[1-9][0-9]*` (WBKB hitboxes that have rehit rate)
* `Effect=0x14` (Hitboxes that paralyze)
* `Reflectable=0x0, Absorbable=0x1` (Hitboxes that cannot be reflected but can be absorbed)

### Param Viewer
https://rubendal.github.io/Sm4sh-Calculator/params.html

See all characters fighter_param_vl files parameters online, groups before 13 have tags for known stuff, you can check Meshima's [params spreadsheet](https://docs.google.com/spreadsheets/d/1FgOsGYfTD4nQo4jFGJ22nz5baU1xihT5lreNinY5nNQ/edit#gid=305485435) to check special moves and other stuff (groups 13 and higher) for known values for each character

### MSC Script Viewer
https://rubendal.github.io/Sm4sh-Calculator/msc.html

View character MSC scripts disassembled using jam1garner's pymsc and mscdec and stored on json files

MSC files version: 1.1.6/1.1.7

## Issues and Feedback
You can [open an Issue here](https://github.com/rubendal/Sm4sh-Calculator-Web/issues) or DM me on [Twitter](https://twitter.com/Ruben_dal) your issues and feedback

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)
* [ssbwiki.com](http://www.ssbwiki.com)
* [Meshima's](https://twitter.com/Meshima_) [params spreadsheet](https://docs.google.com/spreadsheets/d/1FgOsGYfTD4nQo4jFGJ22nz5baU1xihT5lreNinY5nNQ/edit#gid=305485435) (and everyone contributing here)
* [Sammi Husky's](https://twitter.com/sammihusky) [Sm4sh Tools](https://github.com/Sammi-Husky/Sm4sh-Tools)
* [jam1garner's](https://twitter.com/jam1garner) [pymsc](https://github.com/jam1garner/pymsc) and [mscdec](https://github.com/jam1garner/mscdec)