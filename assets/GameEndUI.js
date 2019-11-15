cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        rankLabel: cc.Label,
        gameEndInfo: cc.Label,
        BtnUp: cc.Button,
        BtnDowm: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // this.BtnUp.interactable =false;
        // this.BtnDowm.interactable =false;
        // var YposUPNew = -155.634;
        // var YposDownNew = -288.437;
        // this.scheduleOnce(function(){
        //     this.showADBanner();
        //     this.BtnUp.node.y = YposUPNew;
        //     this.BtnDowm.node.y = YposDownNew;
        //     this.BtnUp.interactable =true;
        //     this.BtnDowm.interactable =true;
        // }.bind(this),2.0);
        this.showADBanner();
    },
    onDestroy() {
        this.HideADBanner();
    },
    start() {

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
        this.rankLabel.string = "第" + rank + "名";
        this.gameEndInfo.string = contentString;
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
    showADBanner() {
        // oppo start
        if (typeof qg != "undefined") {
            // 在适合的场景显示 Banner 广告
            console.log("显示 Banner 广告");
            if (BannerADSinglen) {
                BannerADSinglen.show();
            }
        }
        return;
        // oppo end
        if (typeof wx === "undefined") {
        } else {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                BannerADSinglen.show();
            }
        }
    },
    HideADBanner() {
        if (typeof wx === "undefined") {
        } else {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                BannerADSinglen.hide();
            }
        }
    },
});
