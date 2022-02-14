let modInfo = {
	name: "元元树-创世树元元重写",
	id: "prestreestuck_metameta_rewritten",
	author: "QwQe308",
	pointsName: "点数",
	discordName: "",
	discordLink: "",
	initialStartPoints: new ExpantaNum (0), // Used for hard resets and new players
	
	offlineLimit: 0.1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.11",
	name: "",
}

let changelog = `<h1>更新记录(时不时懒得写):</h1><br>
	<h3>v0.11</h3><br>
		- 更新超限.当前endgame:3超限.<br><br>
	<h3>v0.1</h3><br>
		- 制作超限节点.当前endgame:2超限.之前的更新记录全懒得写了.`

let winText = `恭喜通关!`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new ExpantaNum(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints()) return new ExpantaNum(0)
	let gain = layers.m.effect()
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
  function(){return `t = ${format(player.m.time)}`},
  function(){return `当前元性质上限: ${format(layers.m.maxValue())}`},
  function(){return `当前点数上限: F1.79e308`},
    function(){return `当前endgame: 3超限`},
]

// Determines when the game "ends"
function isEndgame() {
	return player.overflow.total.gte(2)
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(360) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}