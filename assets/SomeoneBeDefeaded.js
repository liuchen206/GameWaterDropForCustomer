cc.Class({
    extends: cc.Component,

    properties: {
        winnerLabel:cc.Label,
        loserLabel:cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scheduleOnce(this._autoDestroy,2.5);
    },

    // update (dt) {},

    init(winnerName,loserName){
        this.winnerLabel.string = winnerName;
        this.loserLabel.string = loserName;
        return this;
    },
    _autoDestroy(){
        this.node.destroy();
    },
});
