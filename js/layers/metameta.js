addLayer("m", {
    name: "I\'m_so_META", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='js/favicon.png' style='width:calc(60%);height:calc(60%);margin:20%'></img>",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
		    time: n(0),
		    buyableCostRoot: n(1),
		    c11: n(0)
    }},
    prestigeButtonText() { 
        return "飞升以获得 <b>+" + formatWhole(this.getResetGain()) + "</b> 元性质" + ((this.getResetGain().gte(1000)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 点数"))
    },
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        //slg(x/2+1)^0.4
        return expRoot(player.points.div(2).add(1).slog(10).pow(0.4).pow(pow).mul(mult).add(10),this.gainExpRoot()).sub(10).root(layers.mm.effect2()).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        //(10^^((x+1)^(1/0.4)))*2
        return ten.tetr(expPow(this.getResetGain().add(1).pow(layers.mm.effect2()).add(10),this.gainExpRoot()).sub(10).div(mult).root(pow).root(0.4)).sub(1).mul(2)
    },
    effect(){
      var metaBoost = player[this.layer].points.add(2)
      if(player.m.buyables[23].gt(0) && !hasUpgrade('mm',13)) metaBoost = metaBoost.pow(buyableEffect('m',11)).pow(buyableEffect('m',14))
      metaBoost = expPow(metaBoost,buyableEffect('m',23))
      
      var timeBoost = player[this.layer].time
      timeBoost = timeBoost.add(1).pow(buyableEffect("m",11)).sub(1)
      
      var tetrate = metaBoost.pow(timeBoost).add(1).log(10)
      var finalValue = metaBoost.add(1).tetr(tetrate)
      var maxValue = n('10{2}1.8e308')
      
      finalValue = ten.tetr(finalValue.add(1).slog(10).root(layers.overflow.effect1()))
      
      return finalValue.min(maxValue)
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
        if(hasAchievement('overflow',11)) mult = mult.mul(10)
        mult = mult.mul(challengeEffect('m',11))
        return mult
    },
    gainExp() {
      var exp = n(1)
      exp = exp.mul(buyableEffect('m',14))
      exp = exp.mul(layers.overflow.effect2())
      return exp
    },
    gainExpRoot() {
      var exp = n(1.2)
      exp = exp.mul(layers.mm.effect4())
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
            effect(x = getBuyableAmount('m',this.id)) { 
              x = x.add(this.extraLevel())
              return x.add(1).root(3) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元空间升级"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `指数增幅时间在公式中的效果.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
          12: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow(x.pow(1.25)).mul(317.49).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { 
              x = x.add(this.extraLevel())
              x = x.mul(buyableEffect('m',22))
              return player.m.time.add(1).log10().add(1).pow(x.add(1).root(1.6).sub(1).mul(2.22)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "时间浓缩"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `时间增幅时间.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}/${this.purchaseLimit()}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
              if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return n(15).add(layers.mm.effect3())},
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        13: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow(x.add(1).pow(1.33).sub(1)).mul(10).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.add(this.extraLevel())
              x = x.mul(buyableEffect('m',21))
              return player.m.points.add(10).log10().pow(x.add(1).root(1.75).sub(1)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元性质浓缩"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `元性质增幅元性质.<br>
                x ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        14: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return two.pow((expRoot(x.add(10),0.5)).sub(10)).mul(1000).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.add(this.extraLevel())
              return x.mul(1.5).add(1).root(5) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元性质增幅器"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `增幅元性质获取.<br>
                ^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        21: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expRoot(x.pow(1.2).add(10),0.5)).sub(10)).mul(1e15).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { 
              x = x.add(this.extraLevel())
              return getBuyableAmount('m',13).add(layers.m.buyables[13].extraLevel()).add(10).log10().pow(x.add(1).root(2.5).sub(1).mul(1.25)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "浓缩元性质浓缩"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `浓缩元性质增幅浓缩元性质.<br>
                x ${format(this.effect())}浓缩元性质等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        22: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expRoot(x.pow(1.1).add(10),0.5)).sub(10)).mul(1e16).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.add(this.extraLevel())
              return n(player.m.resetTime).add(1).pow(x.add(1).root(5).sub(1).div(6)) },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "加速子"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              if(hasUpgrade('mm',13)) exLv = exLv.add(upgradeEffect('mm',13))
              return exLv
            },
            display() {
                return `基于距离上次重置的现实时间倍增时间浓缩.<br>
                x ${format(this.effect())}时间浓缩等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        23: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(4).pow((expRoot(x.pow(1.1).add(10),0.5)).sub(10)).mul(1e19).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) {
              x = x.add(this.extraLevel())
              x = x.add(buyableEffect("m",24))
              var eff = x.pow(1.25).mul(1.25).add(1)
              //if(hasUpgrade('mm',12)) eff = eff.mul(upgradeEffect('mm',12))
              return eff
              
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "元化元"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              if(hasUpgrade('mm',13)) exLv = exLv.add(upgradeEffect('mm',13))
              return exLv
            },
            display() {
                return `元性质在公式里的作用增加.<br>
                起效元性质指数^ ${format(this.effect())}. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                ${hasUpgrade('mm',13)?'':'在至少有一级*非额外*元化元后,元性质增幅器和元空间升级指数加成元性质效果,在该升级前触发.<br>'}
                    等级:${format(player.m.buyables[this.id])}/${this.purchaseLimit()}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
              if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return n(4).add(layers.mm.effect1())},
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
        24: {
            cost(x = getBuyableAmount('m',this.id)) { 
              return n(10).pow((expPow(x.pow(1.1).add(10),2.5)).sub(10)).mul(1e30).root(player.m.buyableCostRoot)
            },
            effect(x = getBuyableAmount('m',this.id)) { 
              x = x.add(this.extraLevel())
              x = expRoot(x.add(10),1.33).sub(10)
              var eff = bulklog(player.m.time.add(1),0.75).mul(expRoot(buyableEffect('m',22).pow(3).add(10),1.25).sub(10)).pow(x.add(1).root(6).sub(1)).sub(1).max(0)
              eff = powsoftcap(eff,n(10),1.5)
              return eff},
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            title() {
                return "时间扭曲"
            },
            extraLevel(){
              var exLv = n(0)
              if(hasUpgrade('mm',22)) exLv = exLv.add(1)
              return exLv
            },
            display() {
                return `基于时间和加速子强度加成元化元.<br>
                + ${format(this.effect())}元化元等级. (下一级${format(this.effect(getBuyableAmount('m',this.id).add(1)))})<br>
                    等级:${format(player.m.buyables[this.id])}/${this.purchaseLimit()}${this.extraLevel().eq(0)?'':` (+${format(this.extraLevel())})`}<br>
                    价格: ${format(this.cost())} 元性质`
            },
            buy() {
              if(getBuyableAmount(this.layer,this.id).gte(this.purchaseLimit())) return
                if(!hasAchievement('overflow',11)) player[this.layer].points = player[this.layer].points.sub(this.cost()).max(0)
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            purchaseLimit(){return n(3)},
            unlocked(){return true},
            abtick:0,
            abdelay(){return hasAchievement('overflow',14)?0:1.79e308},
        },
    },
    passiveGeneration(){
      if(hasUpgrade('mm',22)) return 0.1
      if(hasAchievement('overflow',11)) return 0.01
      return 0
    },
    doReset(layer){
      player.m.time = n(0)
      if(layers[layer].row > 1) layerDataReset('m',['c11'])
      if(layers[layer].row > 2) layerDataReset('m',[])
    },
    maxValue(){
      var max = n(6.8e38)
      if(hasAchievement('overflow',13)) max = max.mul(achievementEffect('overflow',13))
      //if(player.mm.total.gte(5)) max = n('1.8e308')
      return max
    },
    //inportant!!!
    update(diff){
     player.m.points = this.maxValue().min(player.m.points)
      var timespeed = n(1)
      if(!inChallenge('dim',11)) timespeed = timespeed.mul(buyableEffect('m',12))
      if(hasUpgrade('mm',11)) timespeed = timespeed.mul(upgradeEffect('mm',11))
      if(hasUpgrade('mm',31)) timespeed = timespeed.mul(upgradeEffect('mm',31))
      
      if(inChallenge('m',11)) timespeed = timespeed.root(8)
      player.m.time = player.m.time.add(timespeed.mul(diff))
      player.m.buyableCostRoot = this.buyableCostRoot()
      
      if(player[this.layer].activeChallenge != null){
        player[this.layer]['c'+player[this.layer].activeChallenge] = player[this.layer]['c'+player[this.layer].activeChallenge].max(layers[this.layer].challenges[player[this.layer].activeChallenge].resource())
      }
      
      for(row=1;row<=2;row++){       
      for(col=1;col<=4;col++){ 
      if(layers[this.layer].buyables[row*10+col]){            
        layers[this.layer].buyables[row*10+col].abtick += diff
        if(layers[this.layer].buyables[row*10+col].abtick >= layers[this.layer].buyables[row*10+col].abdelay() && layers[this.layer].buyables[row*10+col].unlocked() && layers[this.layer].buyables[row*10+col].canAfford()){
          layers[this.layer].buyables[row*10+col].buy()
          layers[this.layer].buyables[row*10+col].abtick = 0
            } 
          }        
        }    
      }
      
    },
    challenges:{
      11:{
        name:'时间奇点',
        challengeDescription:'时间速率变为其8次根.你基于挑战中取得的最高点数获得加成.',
        rewardDescription(){return `当前最高${format(getCP('m',11))},元性质x${format(this.rewardEffect())}`},
        rewardEffect(){return expRoot(getCP('m',11).add(10).slog(10).root(18),1.33)},
        goal:n('10{3}3'),
        canComplete(){return false},
        resource(){return player.points},
        unlocked(){return hasAchievement('overflow',11)},
      },
    },
})
