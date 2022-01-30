addLayer("mm", {
    name: "I\'m_so_METAMETA", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='js/MindustryModPng_madeByMinxyzgo.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new ExpantaNum(0),
		    time: n(0),
    }},
    prestigeButtonText() { 
        return "超越以获得 <b>+" + formatWhole(this.getResetGain()) + `</b> 元元(总计元元:${formatWhole(player.mm.total)})` + ((this.getResetGain().gte(1000)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 元性质"))
    },
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return player.m.points.div(this.requires()).root(38).pow(pow).floor().mul(mult).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return this.getResetGain().add(1).div(mult).root(pow).pow(38).mul(this.requires())
    },
    effect1(){
      var maxLevel = player.mm.total
      return maxLevel
    },
    effect2(){
      var root = n(2).pow(player.mm.total.add(1).root(3).sub(1))
      return root
    },
    effect3(){
      var maxLevel = player.mm.total.mul(3)
      return maxLevel
    },
    effectDescription() {
        return `<br>元化元等级上限+ ${format(this.effect1())}.<br>元性质变为其 ${format(this.effect2())} 次根 <br>时间浓缩等级上限+ ${format(this.effect3())}`
    },
    color: "#31aeb0",
    resource: "元元", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){return n(6.8e38)},
    baseResource:"元性质",
    baseAmount(){return player.m.points},
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
      var exp = n(1)
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 2, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    unlocked(){return player.m.points.gte(6.8e38)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `手机端qol<br>长按以重置`},
            onHold(){doReset(this.layer)}
        },
        12: {
            canClick(){return true},
            display() {return `重置升级`},
            onClick(){
              if(!confirm('您确定要重置升级么?这会进行一次超越!')) return
              player.mm.upgrades = []
              player.mm.points = player.mm.total
              doReset(this.layer,true)
            }
        },
    },
    upgrades:{
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>二次加速</alternate>",
            description: `时间速率x10^加速子效果^3.`,
            effect(){
              return n(10).pow(buyableEffect('m',22).pow(3))
            },
            effectDisplay(){
              return `当前效果: x${format(upgradeEffect(this.layer,this.id))}`
            },
            cost: n(1),
            unlocked() { return player[this.layer].points.gte(1) || hasUpgrade(this.layer, this.id) },
        },
        12: {
            title: "<p style='transform: scale(-1, -1)'><alternate>元化拓展</alternate>",
            description: `元性质购买项价格基于元性质被开根的指数降低.`,
            effect(){
              return layers.mm.effect2().pow(0.33)
            },
            effectDisplay(){
              return `当前效果: 变为其${format(upgradeEffect(this.layer,this.id))}次根`
            },
            cost: n(1),
            unlocked() { return hasUpgrade(this.layer,11) || hasUpgrade(this.layer, this.id) },
        },
        21: {
            title: "<p style='transform: scale(-1, -1)'><alternate>弦拓展</alternate>",
            description: `解锁节点“弦”.`,
            cost: n(1),
            unlocked() { return hasUpgrade(this.layer,11) || hasUpgrade(this.layer, this.id) },
        },
    },
})
