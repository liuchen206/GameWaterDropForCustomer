cc.Class({
    extends: cc.Component,

    properties: {
        rankLabel: cc.Label,
        BtnUp: cc.Button,
        BtnDowm: cc.Button,
        rankListContent: cc.Node,
        rankBgSpriteList: [cc.SpriteFrame],
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._showADBanner_();
    },
    onDestroy() {
        this._HideADBanner_();
    },
    start() {

    },

    // update (dt) {},

    init(rank, playerBalanceList) {
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
        this.rankLabel.string = "第" + rank + "名";

        var rankItemNodeList = this.rankListContent.children;
        for (var i = 0; i < rankItemNodeList.length; i++) {
            var listItem = rankItemNodeList[i];
            if (i < playerBalanceList.length) {
                var playInfo = playerBalanceList[i]; // 需要展示的数据
                var scoreLabel = listItem.getChildByName('scoreLabel').getComponent(cc.Label);
                var nameLabel = listItem.getChildByName('nameLabel').getComponent(cc.Label);
                var rankLabel = listItem.getChildByName("rankIcon").getChildByName("rankNum").getComponent(cc.Label);
                var rankSprite = listItem.getChildByName("rankIcon").getComponent(cc.Sprite);

                scoreLabel.string = playInfo.score;
                if (playInfo.isMainPlayer == true) {
                    nameLabel.string = "我";
                } else {
                    nameLabel.string = playInfo.name;
                }
                rankLabel.string = (i + 1) + "";
                var rankBg = this.rankBgSpriteList[playInfo.colorStyleIndex % 10];
                rankSprite.spriteFrame = rankBg;
                listItem.opacity = 255;
            } else {
                listItem.opacity = 0;
            }
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
