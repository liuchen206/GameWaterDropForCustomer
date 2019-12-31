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
        goldLabel: cc.Label,
        faceSelectNode: cc.Node,
        RankNode: cc.Node,
        faceSelectContent: cc.Node,
        // spriteFromNet:cc.Sprite,
        faceBtnPrefab: cc.Prefab,
        dragonBonesAssetList: [dragonBones.DragonBonesAsset],
        dragonBonesAtlasList: [dragonBones.DragonBonesAtlasAsset],
        tips: cc.Prefab,
        sendFacePrefab: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // cc.sys.localStorage.clear();

        //分享
        if (typeof wx === "undefined") {

        } else {
            wx.showShareMenu({
                success: function (res) { console.log(res); },
                fail: function (res) { console.log(res); }
            });
        }
        this.getMyWXInfo();

        this.checkAndShowSendFace();

        this._initADBanner_(); // 初始化 微信 banner
        this._showADBanner_(); // 展示 微信 banner
        this.initADInsert(); // 初始化 微信 插屏
        this.showADInsert(); // 展示微信插屏
    },
    /**
     * 遍历本地数据，如果没有获得全部表情，则展示看广告赠送表情界面
     */
    checkAndShowSendFace() {
        // 找出一个为获得的表情
        var maxFaceIndex = 10;
        var isNeedSend = false;
        for (var i = 0; i < maxFaceIndex; i++) {
            var userData = getUserFaceData();
            var isgetThis = false;
            for (var j = 0; j < userData.ownFaceList.length; j++) {
                if (userData.ownFaceList[j] == i) {
                    isgetThis = true;
                }
            }
            if (isgetThis == false) {
                isNeedSend = true;
                cc.log("isNeedSend", i);
                break;
            }
        }
        if (isNeedSend == true) {
            var sendNode = cc.instantiate(this.sendFacePrefab);
            cc.find("Canvas/PopWindow").removeAllChildren();
            cc.find("Canvas/PopWindow").addChild(sendNode);
        }
    },
    start() {
        // cc.sys.localStorage.clear();

        cc.director.preloadScene("Game", function () {
            cc.log("Next scene preloaded");
        });
        this.reFreshGold();
        this.updateFaceSelect();
        this.updateLoginShowFace();
        cc.find("AudioManager").getComponent("AudioManager")._playLobbyBGM_();
    },
    /**
     * 展示提示信息
     * @param {提示信息字符串} info 
     */
    showTips(info) {
        var tipsNode = cc.instantiate(this.tips)
        var infoLabel = tipsNode.getChildByName("info").getComponent(cc.Label);
        infoLabel.string = info;
        cc.find("Canvas/PopWindow").removeAllChildren();
        cc.find("Canvas/PopWindow").addChild(tipsNode);
    },
    initADInsert() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
            return;
        }
        // 创建插屏广告实例，提前初始化
        if (InsertADSinglen == null) {
            if (wx.createInterstitialAd) {
                InsertADSinglen = this.interstitialAd = wx.createInterstitialAd({
                    adUnitId: 'adunit-0f0d254b8ea3a67e'
                })
                this.interstitialAd.onClose(res => {
                    console.log('插屏 广告关闭')
                    // this.showTips("插屏 广告关闭");
                })
            }
        } else {
            this.interstitialAd = InsertADSinglen;
        }

    },
    _initADBanner_() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
            return;
        }
        // 创建 Banner 广告实例，提前初始化
        let systemInfo = wx.getSystemInfoSync();
        let _width = systemInfo.windowWidth / 2;
        let _height = systemInfo.windowHeight;

        if (BannerADSinglen == null) {
            BannerADSinglen = this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-24700a92e658f5cc',
                adIntervals: 30, // 自动刷新频率不能小于30秒
                style: {
                    left: 0,
                    top: 0,
                    // width: 350,                            
                    // height: 300,
                }
            })
            var self = this;
            this.bannerAd.onResize(function () {
                // self.bannerAd.style.left = _width - self.bannerAd.style.realWidth+0.1;
                self.bannerAd.style.left = _width - self.bannerAd.style.realWidth / 2 + 0.1;
                self.bannerAd.style.top = _height - self.bannerAd.style.realHeight + 0.1;
                console.log(self.bannerAd);
            })
            this.bannerAd.onError(err => {
                console.log(err);
                // this.showTips("errMsg" + err.errMsg);
            });
        } else {
            this.bannerAd = BannerADSinglen;
        }
    },
    showADInsert() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
        } else {
            // 在适合的场景显示插屏广告
            if (this.interstitialAd) {
                this.interstitialAd.show().catch((err) => {
                    // this.showTips("errMsg"+ err.errMsg);
                    console.error(err)
                })
            }
        }
    },
    _showADBanner_() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
        } else {
            // 在适合的场景显示 Banner 广告
            this.bannerAd.show();
        }
    },
    _HideADBanner_() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
        } else {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                this.bannerAd.hide();
            }
        }
    },
    onDestroy() {
        this._HideADBanner_();
    },
    /**
     * 更新登陆界面 选择的当前表情
     */
    updateLoginShowFace() {
        var userData = getUserFaceData();
        var faceIndex = userData.currentSelectIndex;


        cc.loader.loadRes("staticFace/b" + (faceIndex + 1) + "/" + 5 + ".png", 'png', (err, texture) => {
            cc.log(err);
            var spriteFromNet = cc.find("Canvas/bg/faceDisplay/faceDB").getComponent(cc.Sprite);
            spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
            // spriteFromNet.scale = 1.6;
        })
    },
    /**
     * 更新表情选择界面
     */
    updateFaceSelect() {
        var maxFaceIndex = 10;
        var maxBtn = 10;
        this.faceSelectContent.removeAllChildren();
        for (var i = 0; i < maxBtn; i++) {
            var selectBtnNode = cc.instantiate(this.faceBtnPrefab);
            var selectBtnNodeJS = selectBtnNode.getComponent("faceItemBtn");
            selectBtnNodeJS.btnIndex = i;
            this.faceSelectContent.addChild(selectBtnNode);
            if (i < maxFaceIndex) {
                var userData = getUserFaceData();
                if (userData.currentSelectIndex == selectBtnNodeJS.btnIndex) {
                    selectBtnNodeJS.setBtnStatus(BtnState.GetSelect);
                } else {
                    var isGetThisFace = false;
                    for (var j = 0; j < userData.ownFaceList.length; j++) {
                        if (userData.ownFaceList[j] == selectBtnNodeJS.btnIndex) {
                            isGetThisFace = true;
                        }
                    }
                    if (isGetThisFace) {
                        selectBtnNodeJS.setBtnStatus(BtnState.GetUnSelect);
                    } else {
                        selectBtnNodeJS.setBtnStatus(BtnState.Unget);
                    }
                }
            } else {
                // 未开发好
                selectBtnNodeJS.setBtnStatus(BtnState.Unknow);
            }
        }
    },
    /**
     * 获得微信个人信息
     */
    getMyWXInfo() {
        if (typeof wx === 'undefined') {
            return;
        }
        if (MyWXInfo.name == "" && MyWXInfo.avatar == "") {
            let systemInfo = wx.getSystemInfoSync();
            let width = systemInfo.windowWidth;
            let height = systemInfo.windowHeight;
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: width,
                    height: height,
                    lineHeight: 40,
                    backgroundColor: '#00000000',
                    color: '#00000000',
                    textAlign: 'center',
                    fontSize: 10,
                    borderRadius: 4
                }
            });
            button.onTap((res) => {
                let userInfo = res.userInfo;
                if (!userInfo) {
                    this.tips.string = res.errMsg;
                    return;
                }
                MyWXInfo.name = userInfo.nickName;
                MyWXInfo.avatar = userInfo.avatarUrl;

                button.hide();
                button.destroy();
            });
        }
    },
    update(dt) {

    },
    // 开始按钮点击
    startGame() {
        cc.find("AudioManager").getComponent("AudioManager").playbtnClick();
        cc.director.loadScene("Game");
    },
    // 表情按钮点击
    onClickedFaceSelectBtn() {
        cc.find("AudioManager").getComponent("AudioManager").playbtnClick();
        this.faceSelectNode.active = !this.faceSelectNode.active;
    },
    // 排行榜按鈕點擊
    onClickedRankBtn() {
        cc.find("AudioManager").getComponent("AudioManager").playbtnClick();
        if (cc.sys.platform === cc.sys.WECHAT_GAME) {
            this.RankNode.active = true;
        } else if (cc.sys.platform === cc.sys.WIN32) {
            this.showTips("暂未开放");
            return;
        } else {
            this.showTips("暂未开放");
            return;
        }

    },
    /**
     * 更新展示玩家的金币（水滴）
     */
    reFreshGold() {
        var gold = cc.sys.localStorage.getItem("Gold");
        if (gold) {
            this.goldLabel.string = gold + "";
        } else {
            this.goldLabel.string = 0 + "";
        }
    },
});
