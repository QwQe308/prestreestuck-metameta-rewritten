addLayer("m", {
    name: "I\'m_so_META", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='js/favicon.png' style='width:calc(60%);height:calc(60%);margin:20%'></img>",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
		    time: n(0),
		    buyableCostRoot: n(1),
    }},
    prestigeButtonText() { 
        return "飞升以获得 <b>+" + formatWhole(this.getResetGain()) + "</b> 元性质" + ((this.getResetGain().gte(1000)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 点数"))
    },
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        //slg(x/2+1)^0.4
        return expRoot(player.points.div(2).add(1).slog(10).pow(0.4).pow(pow).mul(mult).add(10),1.2).sub(10).root(layers.mm.effect2()).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        //(10^^((x+1)^(1/0.4)))*2
        return ten.tetr(expRoot(this.getResetGain().add(1).pow(layers.mm.effect2()).add(10),1/1.2).sub(10).div(mult).root(pow).root(0.4)).sub(1).mul(2)
    },
    effect(){
      var metaBoost = player[this.layer].points.add(2)
      if(player.m.buyables[23].gt(0)) metaBoost = metaBoost.pow(buyableEffect('m',11)).pow(buyableEffect('m',14))
      metaBoost = expPow(metaBoost,buyableEffect('m',23))
      var timeBoost = player[this.layer].time
      timeBoost = timeBoost.add(1).pow(buyableEffect("m",11)).sub(1)
      var tetrate = metaBoost.pow(timeBoost).add(1).log(10)
      var finalValue = metaBoost.add(1).tetr(tetrate)
      return finalValue
    },
    effectDescription() {
        eff = this.effect();
        return "基于时间,使得点数获取变为 " + format(eff) + "."
    },
    color: "#31aeb0",
    resource: "元性质", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){return n(1)},
    baseResource:"点数",
    baseAmount(){return player.points},
    gainMult() {
        mult = new ExpantaNum(1)
        mult = mult.mul(buyableEffect('m',13))
        mult = mult.mul(layers.dim.effect())
        return mult
    },
    gainExp() {
      var exp = n(1)
      exp = exp.mul(buyableEffect('m',14))
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    clickables: {
        11: {
            canClick(){return true},
            display() {return `手机端qol<br>长按以重置`},
            onHold(){doReset(this.layer)}
        },
    },
    buyableCostRoot(){
      var root = one
      if(hasUpgrade('mm',12)) root = root.mul(upgradeEffect('mm',12))
      return root
    },
    buyables: {
        11: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return four.pow((expRoot(x.add(10),0.5)).sub(10)).mul(100).root(player.m.buyableCostRoot)
              
            },
            effect(x = getBuyableAmount('m',this.id)) { return x.add(1).root(3) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元空间升级"
            },
            display() {
                return `指数增幅时间在公式中的效果.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
          12: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow(x.pow(1.25)).mul(317.49).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { 
              x = x.mul(buyableEffect('m',22))
              return player.m.time.add(1).log10().add(1).pow(x.add(1).root(1.6).sub(1).mul(2.22)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "时间浓缩"
            },
            display() {
                return `时间增幅时间.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}/${this.purchaseLimit()}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return n(15).add(layers.mm.effect3())},
        },
        13: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow(x.add(1).pow(1.33).sub(1)).mul(10).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.mul(buyableEffect('m',21))
              return player.m.points.add(10).log10().pow(x.add(1).root(1.75).sub(1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元性质浓缩"
            },
            display() {
                return `元性质增幅元性质.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        14: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow((expRoot(x.add(10),0.5)).sub(10)).mul(1000).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { return x.mul(1.5).add(1).root(5) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元性质增幅器"
            },
            display() {
                return `增幅元性质获取.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        21: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expRoot(x.pow(1.2).add(10),0.5)).sub(10)).mul(1e15).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { return getBuyableAmount('m',13).add(10).log10().pow(x.add(1).root(2.5).sub(1).mul(1.25)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "浓缩元性质浓缩"
            },
            display() {
                return `浓缩元性质增幅浓缩元性质.<br>
                x ${format(this.effect())}浓缩元性质等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        22: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expRoot(x.pow(1.1).add(10),0.5)).sub(10)).mul(1e16).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { return n(player.m.resetTime).add(1).pow(x.add(1).root(5).sub(1).div(6)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "加速子"
            },
            display() {
                return `基于距离上次重置的现实时间倍增时间浓缩.<br>
                x ${format(this.effect())}时间浓缩等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
        23: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(4).pow((expRoot(x.pow(1.1).add(10),0.5)).sub(10)).mul(1e19).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.add(buyableEffect("m",24))
              var eff = x.pow(1.25).mul(1.25).add(1)
              //if(hasUpgrade('mm',12)) eff = eff.mul(upgradeEffect('mm',12))
              return eff
              
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元化元"
            },
            display() {
                return `元性质在公式里的作用增加.<br>
                起效元性质指数^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                在至少有一级元化元后,元性质增幅器和元空间升级指数加成元性质效果,在该升级前触发.
                    等级:${format(player.m.buyables[this.id])}/${this.purchaseLimit()}<br><br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return n(4).add(layers.mm.effect1())},
        },
        24: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expPow(x.pow(1.1).add(10),2.5)).sub(10)).mul(1e30).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { 
              x = expRoot(x.add(10),1.33).sub(10)
              return bulklog(player.m.time.add(1),0.75).mul(expRoot(buyableEffect('m',22).pow(3).add(10),1.25).sub(10)).pow(x.add(1).root(6).sub(1)).sub(1).max(0) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "时间扭曲"
            },
            display() {
                return `基于时间和加速子强度加成元化元.<br>
                + ${format(this.effect())}元化元等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
        },
    },
    doReset(layer){
      player.m.time = n(0)
      if(layers[layer].row > this.row) layerDataReset('m',[])
    },
    maxValue(){
      var max = n(6.8e38)
      return max
    },
    //inportant!!!
    update(diff){
     player.m.points = this.maxValue().min(player.m.points)
      var timespeed = n(1)
      timespeed = timespeed.mul(buyableEffect('m',12))
      if(hasUpgrade('mm',11)) timespeed = timespeed.mul(upgradeEffect('mm',11))
      player.m.time = player.m.time.add(timespeed.mul(diff))
      player.m.buyableCostRoot = this.buyableCostRoot()
    },
})
