addLayer("overflow", {
    symbol: "+1",
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		    points: new ExpantaNum(0),
    }},
    prestigeButtonText() { 
        return "强行让点数增量以获得 <b>+" + formatWhole(this.getResetGain()) + `</b> 超限(总计超限:${formatWhole(player.overflow.total)})` + ((this.getResetGain().gte(1000)) ? "" : ("<br/>下一个于 " + format(this.getNextAt()) + " 点数"))
    },
    getResetGain() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return player.points.add(10).slog(10).div(this.requires().slog(10)).root(308).pow(pow).floor().mul(mult).floor()
    },
    getNextAt() {
        var mult = this.gainMult()
        var pow = this.gainExp()
        return ten.tetr(this.getResetGain().add(1).div(mult).root(pow).pow(308).mul(this.requires().slog(10))).sub(10)
    },
    effect1(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.6).sub(1))
      return root
    },
    effect2(){
      var root = n(2).pow(player.overflow.total.add(1).pow(0.4).sub(1))
      return root
    },
    effectDescription() {
        return `点数的指数塔层数变为其 ${format(this.effect1())} 次根<br>元性质变为其 ${format(this.effect2())} 次方`
    },
    color: "red",
    resource: "超限", // Name of prestige currency
    type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    requires(){
      //if(player.mm.total.gte(5)) return n('1.8e308')
      return n('10{2}1.8e308')
    },
    baseResource:"点数",
    baseAmount(){return player.points},
    gainMult() {
        mult = new ExpantaNum(1)
        return mult
    },
    gainExp() {
      var exp = n(1)
        return exp
    },
    canReset(){return this.getResetGain().gte(1)},
    row: 3, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    unlocked(){return this.getResetGain().gte(1)},
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
              if(!confirm('您确定要重置升级么?这会进行一次超限!')) return
              player.overflow.upgrades = []
              player.overflow.points = player.overflow.total
              doReset(this.layer,true)
            }
        },
    },
    achievements:{
      11:{
        name:'新的起点',
        tooltip:'获得1超限.<br>奖励:你每秒获得1%的元性质.元性质x10.购买元性质购买项不再消耗元性质.解锁元性质挑战11.(元性质挑战不被元元重置)',
        done(){return player.overflow.total.gte(1) && this.unlocked()},
        unlocked(){return true},
      },
      12:{
        name:'弦?',
        tooltip:'获得1e180弦.<br>奖励:解锁弦挑战11.(未解锁仍生效,不被元元重置) 最高弦维度生产速度被弦一维数量的对数倍增.',
        done(){return player.dim.points.gte(1e180) && this.unlocked()},
        unlocked(){return hasAchievement('overflow',11)},
      },
      13:{
        name:'我恨上限...',
        tooltip:'一次重置可以获得e50元性质.<br>奖励:重置获得的元性质与元元总数以极弱的形式加成元性质上限.元元的指数开根锁死于1.06.',
        done(){return layers.m.getResetGain().gte(1e50) && this.unlocked()},
        unlocked(){return hasAchievement('overflow',11)},
        effect(){return expRoot(player.m.total.div(6.8e38).add(1).root(25).pow(expRoot(player.mm.total.add(1).pow(1.6).add(10),1.33).sub(10)),1.33)},
      },
      14:{
        name:'打破诅咒',
        tooltip:'完成第六元元.<br>奖励:自动化元性质购买项.',
        done(){return player.mm.total.gt(6) && this.unlocked()},
        unlocked(){return hasAchievement('overflow',11)},
      },
    },
    /*upgrades:{
        11: {
            title: "<p style='transform: scale(-1, -1)'><alternate>二次加速</alternate>",
            description: `时间速率x10^加速子效果^3.解锁升级12和21.`,
            effect(){
              return n(10).pow(buyableEffect('m',22).pow(3))
            },
            effectDisplay(){
              return `当前效果: x${format(upgradeEffect(this.layer,this.id))}`
            },
            cost: n(1),
            unlocked() { return player[this.layer].points.gte(1) || hasUpgrade(this.layer, this.id) },
        },
    }*/
})