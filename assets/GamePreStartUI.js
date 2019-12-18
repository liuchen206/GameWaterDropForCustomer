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
        progressbar: cc.ProgressBar,
        progressInfo: cc.Label,
        namesLayout: cc.Node,
        itemPrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.find("Canvas/UIView/RankWhenPlaying").active = false;
        this.showADBanner();
    },
    onDestroy() {
        this.HideADBanner();
    },
    start() {

    },
    init(gameManagerJS) {
        this.NameList = [];
        this.AvatarList = [];
        this.AvatarListIndex = [];
        this.gameManagerJS = gameManagerJS;
        for (var i = 0; i < 9; i++) {
            var randomIndex = 0;
            var indexCheck = 1;
            while (indexCheck >= 0) {
                // cc.log("indexCheck",indexCheck);
                randomIndex = Math.floor(MapNum(Math.random(), 0, 1, 0, window.playerNames.length));
                indexCheck = this.NameList.indexOf(window.playerNames[randomIndex]);
            }
            this.NameList.push(window.playerNames[randomIndex]);

            var indexCheck2 = 1;
            var randomIndex2 = 0;
            while (indexCheck2 >= 0) {
                randomIndex2 = Math.ceil(MapNum(Math.random(), 0, 1, 0, 20));
                indexCheck2 = this.AvatarListIndex.indexOf(randomIndex2);
            }
            this.AvatarListIndex.push(randomIndex2);
        }
        for (var i = 0; i < this.AvatarListIndex.length; i++) {
            var avatarIndex = this.AvatarListIndex[i];
            if (avatarIndex < 10) {
                avatarIndex = "000" + avatarIndex;
            } else if (avatarIndex < 100) {
                avatarIndex = "00" + avatarIndex;
            } else if (avatarIndex < 1000) {
                avatarIndex = "0" + avatarIndex;
            } else {
                avatarIndex = "" + avatarIndex;
            }
            this.AvatarList.push("avatar/" + avatarIndex + ".jpg");
        }
        this.nameIndex = 0;
        this._showMyInfo();
        this.schedule(this._showOneName, 0.3);
        return this;
    },
    // update (dt) {},
    _showMyInfo() {
        var readyPlayerItemNode = cc.instantiate(this.itemPrefab);
        var nameLabel = readyPlayerItemNode.getChildByName("name").getComponent(cc.Label);
        nameLabel.string = "我";
        this.namesLayout.addChild(readyPlayerItemNode);
        cc.log("MyWXInfo.avatar", MyWXInfo.avatar);
        if (MyWXInfo.avatar != "") {
            if (cc.sys.isBrowser) {

            } else {
                cc.loader.load({ url: MyWXInfo.avatar, type: 'png' }, (err, texture) => {
                    cc.log(err);
                    var spriteFromNet = readyPlayerItemNode.getChildByName("iconMask").getChildByName("icon").getComponent(cc.Sprite);
                    spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
                    spriteFromNet.node.width = 55;
                    spriteFromNet.node.height = 55;
                })
            }
        }
    },
    _showOneName() {
        var self = this;
        // cc.log("_showOneName",self.nameIndex,self.NameList.length)
        if (self.nameIndex >= self.NameList.length) {
            self.gameManagerJS.runGame(self.NameList);
            cc.find("Canvas/UIView/RankWhenPlaying").active = true;
            self.node.destroy();
            return;
        }
        if (cc.sys.isBrowser) {
            var readyPlayerItemNode = cc.instantiate(self.itemPrefab);
            var nameLabel = readyPlayerItemNode.getChildByName("name").getComponent(cc.Label);
            nameLabel.string = self.NameList[self.nameIndex];
            var spriteFromNet = readyPlayerItemNode.getChildByName("iconMask").getChildByName("icon").getComponent(cc.Sprite);

            spriteFromNet.node.width = 55;
            spriteFromNet.node.height = 55;

            self.nameIndex++;
            self.progressbar.progress = self.nameIndex / 9;
            self.progressInfo.string = "已就绪" + self.nameIndex + "/9";
            self.namesLayout.addChild(readyPlayerItemNode);
        } else {
            cc.loader.loadRes(self.AvatarList[self.nameIndex], 'jpg' , (err, texture) => {
                cc.log(err);
                var readyPlayerItemNode = cc.instantiate(self.itemPrefab);
                var nameLabel = readyPlayerItemNode.getChildByName("name").getComponent(cc.Label);
                nameLabel.string = self.NameList[self.nameIndex];
                var spriteFromNet = readyPlayerItemNode.getChildByName("iconMask").getChildByName("icon").getComponent(cc.Sprite);

                spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
                spriteFromNet.node.width = 55;
                spriteFromNet.node.height = 55;

                self.nameIndex++;
                self.progressbar.progress = self.nameIndex / 9;
                self.progressInfo.string = "已就绪" + self.nameIndex + "/9";
                self.namesLayout.addChild(readyPlayerItemNode);
            })
        }
    },
    showADBanner() {
        // oppo start
        if (typeof qg != "undefined") {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                BannerADSinglen.show();
                console.log("显示 Banner 广告");
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
