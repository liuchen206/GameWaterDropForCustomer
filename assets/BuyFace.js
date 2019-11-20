// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        coinLabel: cc.Label,
        dragonBonesAssetList: [dragonBones.DragonBonesAsset],
        dragonBonesAtlasList: [dragonBones.DragonBonesAtlasAsset],
        BtnBuy: cc.Button,
        BtnCancel: cc.Button,

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.init(100,1);
    },

    // update (dt) {},
    //初始化方法，两个可选的字符串参数
    init: function (coins, faceIndex) {
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
        cc.log('coins', coins)
        this.coinLabel.string = coins + "";

        cc.loader.loadRes("staticFace/b" + (faceIndex+1) + "/" + 5 + ".png", 'png', (err, texture) => {
            cc.log(err);
            var spriteFromNet = this.node.getChildByName("faceDisplay").getChildByName("faceDB").getComponent(cc.Sprite);
            spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
        })
        return this;
    },

    SetBtnBuyHandler(eventHandler) {
        if (typeof eventHandler == "undefined") {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "BuyFace",
                clickEventHandler.handler = "close";
            clickEventHandler.customEventData = "";
            this.BtnBuy.clickEvents.push(clickEventHandler);
        } else {
            this.BtnBuy.clickEvents.push(eventHandler);
        }
    },
    SetBtnCancelHandler(eventHandler) {
        if (typeof eventHandler == "undefined") {
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "BuyFace",
                clickEventHandler.handler = "close";
            clickEventHandler.customEventData = "";
            this.BtnCancel.clickEvents.push(clickEventHandler);
        } else {
            this.BtnCancel.clickEvents.push(eventHandler);
        }
    },
    //关闭对话框
    close: function (event, customEventData) {
        this.node.destroy();
    },
});
