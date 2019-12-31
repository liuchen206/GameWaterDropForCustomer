
cc.Class({
    extends: cc.Component,

    properties: {
        dragonBonesAssetList: [dragonBones.DragonBonesAsset],
        dragonBonesAtlasList: [dragonBones.DragonBonesAtlasAsset],
        tips: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initADReward_();
        EventCenter.AddListener(EventCenter.EventType.FreeFace, this.getFreeFace, this);
    },
    onDestroy() {
        EventCenter.RemoveListener(EventCenter.EventType.FreeFace, this.getFreeFace, this);
    },
    getFreeFace(param) {
        console.log('param[] ' + param['data']);
        if (param['data'] < 0) {
            this.showTips("领取失败");
            return;
        }
        // 找出一个赠送的表情
        var maxFaceIndex = 10;
        var unGetFaceIndex = 0;
        for (var i = 0; i < maxFaceIndex; i++) {
            var userData = getUserFaceData();
            var isGetThisFace = false;
            for (var j = 0; j < userData.ownFaceList.length; j++) {
                if (userData.ownFaceList[j] == i) {
                    isGetThisFace = true;
                }
            }
            if (isGetThisFace) {
                continue;
            } else {
                unGetFaceIndex = i;
                break;
            }
        }
        var sendingFaceIndex = unGetFaceIndex;
        // var sendingFaceIndex = param['data'];
        console.log('sendingFaceIndex ' + sendingFaceIndex);
        // 按index 解锁表情
        var userData = getUserFaceData();
        userData.ownFaceList.push(sendingFaceIndex);
        cc.sys.localStorage.setItem('UserFaceData', JSON.stringify(userData));

        // 更新为当前选中的表情
        var userData = getUserFaceData();
        userData.currentSelectIndex = sendingFaceIndex;
        cc.sys.localStorage.setItem('UserFaceData', JSON.stringify(userData));

        cc.find("Canvas").getComponent("Login").updateFaceSelect();
        cc.find("Canvas").getComponent("Login").updateLoginShowFace();

        this.btnClose();
        // this.showTips("领取成功");
    },
    start() {
        // 找出一个赠送的表情
        var maxFaceIndex = 10;
        var unGetFaceIndex = 0;
        for (var i = 0; i < maxFaceIndex; i++) {
            var userData = getUserFaceData();
            var isGetThisFace = false;
            for (var j = 0; j < userData.ownFaceList.length; j++) {
                if (userData.ownFaceList[j] == i) {
                    isGetThisFace = true;
                }
            }
            if (isGetThisFace) {
                continue;
            } else {
                unGetFaceIndex = i;
                break;
            }
        }
        // 用没有获得的index 初始化界面
        cc.loader.loadRes("staticFace/b" + (unGetFaceIndex + 1) + "/" + 5 + ".png", 'png', (err, texture) => {
            cc.log(err);
            var spriteFromNet = this.node.getChildByName("faceDisplay").getChildByName("faceDB").getComponent(cc.Sprite);
            spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
            // spriteFromNet.scale = 1.6;
        })

        // 记录下这个要赠送的表情id
        this.FaceIndexToSend = unGetFaceIndex;
        cc.log("unGetFaceIndex", unGetFaceIndex);
    },
    // update (dt) {},

    _initADReward_() {
        if (typeof wx === "undefined") {
            // cc.log("weixin only");
            return;
        }
        // 创建激励视频广告实例，提前初始化
        if (RewardADSinglen == null) {
            RewardADSinglen = this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-516da520176dc054'
            })
            this.videoAd.onError(err => {
                console.log(err)
                cc.log(err);
            })

            this.videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励 _BackToHall_
                    console.log("正常播放结束，可以下发游戏奖励  " + this.playerScore);
                    EventCenter.dispatchEvent(EventCenter.EventType._BackToHall_, { 'data': 30 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log('播放中途退出，不下发游戏奖励  ' + this.playerScore);
                    EventCenter.dispatchEvent(EventCenter.EventType._BackToHall_, { 'data': 10 });
                }
            })
        } else {
            this.videoAd = RewardADSinglen;
        }
    },
    _showADReward_() {
        if (typeof wx === "undefined") {
            // cc.log("weixin only");
            return false;
        } else {
            // 用户触发广告后，显示激励视频广告
            this.videoAd.show().catch(() => {
                // 失败重试
                this.videoAd.load()
                    .then(() => this.videoAd.show())
                    .catch(err => {
                        // cc.log("errMsg" + err.errMsg);
                        EventCenter.dispatchEvent(EventCenter.EventType._BackToHall_, { 'data': 10 });
                    })
            })
        }
        return true;
    },

    btnClose() {
        this.node.destroy();
    },
    btnWathAD() {
        var result = this._showADReward_();
        if (result == false) {
            this.showTips("暂无广告播放");
            // EventCenter.dispatchEvent(EventCenter.EventType.FreeFace, { 'data': this.FaceIndexToSend });
            EventCenter.dispatchEvent(EventCenter.EventType.FreeFace, { 'data': -1 });
        }
    },

    showTips(info) {
        var tipsNode = cc.instantiate(this.tips)
        var infoLabel = tipsNode.getChildByName("info").getComponent(cc.Label);
        infoLabel.string = info;
        cc.find("Canvas/PopWindow").removeAllChildren(true);
        cc.find("Canvas/PopWindow").addChild(tipsNode);
    },
});
