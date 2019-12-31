cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        rankLabel: cc.Label,
        gameEndInfo: cc.Label,
        gameEndInfoRoot: cc.Node,
        BtnUp: cc.Button,
        BtnDowm: cc.Button,

        lightNode:cc.Node,
        spriteWinner:cc.SpriteFrame,
        spriteLoser:cc.SpriteFrame,
        spriteRank:cc.Sprite,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._showADBanner_();
    },
    onDestroy() {
        this._HideADBanner_();
    },
    start() {
        this.lightNode.runAction(cc.repeatForever(cc.rotateBy(1,180)));
    },

    // update (dt) {},

    init(contentString, rank, score) {
        this.node.on("touchstart", function (event, touch) {
            event.stopPropagation();
        });

        this.node.on("touchmove", function (event, touch) {
            event.stopPropagation();
        });

        this.node.on("touchcancel", function (event, touch) {
            event.stopPropagation();
        });

        this.node.on("touchend", function (event, touch) {
            event.stopPropagation();
        });
        this.scoreLabel.string = "积分：" + score;
        this.rankLabel.string = rank;
        this.gameEndInfo.string = contentString;
        if(contentString == ""){
            this.gameEndInfoRoot.active = false;
        }
        if(rank > 1){
            this.spriteRank.spriteFrame = this.spriteLoser;
        }else{
            this.gameEndInfoRoot.active = false;
            this.spriteRank.spriteFrame = this.spriteWinner;
        }
        return this;
    },
    SetBtnUpHandler(text, eventHandler) {
        if (typeof text != "undefined") {
            cc.find("Background/goldReward/Label", this.BtnUp.node).getComponent(cc.Label).string = text;
        }
        if (typeof eventHandler == "undefined") {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "GameEndUI",
                clickEventHandler.handler = "close";
            clickEventHandler.customEventData = "";
            this.BtnUp.clickEvents.push(clickEventHandler);
        } else {
            this.BtnUp.clickEvents.push(eventHandler);
        }
    },
    SetBtnDownHandler(text, eventHandler) {
        if (typeof text != "undefined") {
            cc.find("Background/goldReward/Label", this.BtnDowm.node).getComponent(cc.Label).string = text;
        }
        if (typeof eventHandler == "undefined") {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "GameEndUI",
                clickEventHandler.handler = "close";
            clickEventHandler.customEventData = "";
            this.BtnDowm.clickEvents.push(clickEventHandler);
        } else {
            this.BtnDowm.clickEvents.push(eventHandler);
        }
    },
    //关闭对话框
    close: function (event, customEventData) {
        this.node.destroy();
    },
    _showADBanner_() {
        if (typeof wx === "undefined") {
        } else {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                BannerADSinglen.show();
            }
        }
    },
    _HideADBanner_() {
        if (typeof wx === "undefined") {
        } else {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                BannerADSinglen.hide();
            }
        }
    },
});
