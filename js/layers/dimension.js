addLayer("dim", {
    name: "dim", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "<img src='js/MindustryModPng2_madeByMinxyzgo.png' style='width:calc(80%);height:calc(80%);margin:10%'></img>",
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		    points: new ExpantaNum(0),
		    time: n(0),
		    num:[null,zero,zero,zero,zero,zero,zero,zero,zero],
		    currentMM:n(0)
    }},
    addontionalDim(x = player.mm.points){
      var dim = x.add(4)
      return dim
    },
    getDimMult(x){
      var mult = one
      mult = mult.mul(player.m.points.add(1).mul(player.m.time.add(1)).root(3).root(x**0.5))
      mult = mult.pow(buyableEffect('m',22))
      if(this.addontionalDim().gte(8))mult = mult.pow(this.addontionalDim().div(8).sqrt())
      mult = expRoot(mult,1.25)
      return mult
    },
    getProcMult(x){
      var num = OmegaNum.add(player.dim.num[x],1)
      var mult = num.pow(0.5).mul(this.getDimMult(x))
      return mult
    },
    effect(){
      var eff = expPow(player.dim.points.add(1).log10().pow(1.5).add(1),1.5).div(25).add(1)
      return eff
    },
    effectDescription() {
        return `<br> 未使用的元元使得弦层数+ ${format(this.addontionalDim())}(超过8的部分转换为一定的指数加成倍率).<br>
          倍率基于加速子,时间和元性质提高<br>
          弦使得元性质x${format(this.effect())}`
    },
    color: "white",
    resource: "弦", // Name of prestige currency
    type: "none",
    row: 1, // Row the layer is in on the tree (0 is the first row)  QwQ:1也可以当第一排
    //layerShown(){return player.v.total.gte(1)},
    layerShown(){return hasUpgrade('mm',21)},
    tabFormat: [
        "main-display",
        ["blank", "25px"],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(1))return '';return `一维弦: x${format(layers.dim.getDimMult(1))} 弦产量x${format(layers.dim.getProcMult(1))}              数量：${format(player.dim.num[1])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(2))return '';return `二维弦: x${format(layers.dim.getDimMult(2))} 弦产量x${format(layers.dim.getProcMult(2))}              数量：${format(player.dim.num[2])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(3))return '';return `三维弦: x${format(layers.dim.getDimMult(3))} 弦产量x${format(layers.dim.getProcMult(3))}              数量：${format(player.dim.num[3])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(4))return '';return `四维弦: x${format(layers.dim.getDimMult(4))} 弦产量x${format(layers.dim.getProcMult(4))}              数量：${format(player.dim.num[4])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(5))return '';return `五维弦: x${format(layers.dim.getDimMult(5))} 弦产量x${format(layers.dim.getProcMult(5))}              数量：${format(player.dim.num[5])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(6))return '';return `六维弦: x${format(layers.dim.getDimMult(6))} 弦产量x${format(layers.dim.getProcMult(6))}              数量：${format(player.dim.num[6])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(7))return '';return `七维弦: x${format(layers.dim.getDimMult(7))} 弦产量x${format(layers.dim.getProcMult(7))}              数量：${format(player.dim.num[7])}` }],
        ["display-text", function(){if(layers.dim.addontionalDim().lt(8))return '';return `八维弦: x${format(layers.dim.getDimMult(8))} 弦产量x${format(layers.dim.getProcMult(8))}              数量：${format(player.dim.num[8])}` }],
        
        ["blank", "25px"],
        "buyables",
    ],
    update(diff){
      if(!player.dim.currentMM.eq(player.mm.points)){
        layerDataReset(this.layer)
        player.dim.currentMM = player.mm.points
      } 
      if(!this.layerShown()) return
      var maxDim = this.addontionalDim().max(4).toNumber()
      player.dim.num[maxDim] = player.dim.num[maxDim].add(diff)
      for(i=maxDim-1;i>=1;i--){
        player.dim.num[i] = player.dim.num[i].add(player.dim.num[i+1].mul(this.getDimMult(i+1)).mul(diff))
      }
      var proc = one
      for(i=maxDim;i>=1;i--) proc = proc.mul(this.getProcMult(i))
      player.dim.points = player.dim.points.add(proc)
    },
})
