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
            wx.onShareAppMessage(function () {
                // 用户点击了“转发”按钮
                return {
                    title: '浴室大作战',
                    imageUrl: 'http://youjiang.gaoji.ren:15050/wechat/wxShare/logo.png',
                }
            });
        }
        // var avatarUrl = "http://youjiang.gaoji.ren:15050/wechat/avatars/0001.jpg";
        // var self = this;
        // cc.loader.load({url:avatarUrl,type:'jpg'},(err,texture)=>{
        //     cc.log(err);
        //     self.spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
        //     self.spriteFromNet.node.width =40;
        //     self.spriteFromNet.node.height =40;
        // })
        this.getMyWXInfo();

        // this.initADReward();
        if (typeof qg != "undefined") {
            var self = this;
            qg.initAdService({
                appId: "30209487",
                isDebug: false,
                success: function (res) {
                    console.log("success");
                },
                fail: function (res) {
                    console.log("fail:" + res.code + res.msg);
                },
                complete: function (res) {
                    console.log("complete");
                    self.initADBanner();
                    self.showADBanner();
                    self.initADInsert();
                    self.showADInsert();
                }
            })
        }
        // cc.log('aaaa')
        // this.httpRequest("https://youjiang.gaoji.ren/yushi_data/yushiConfig.json", function (response) {
        //     cc.log("response", response);
        //     var levelObj = JSON.parse(response);
        //     cc.log("levelObj", levelObj['checkFlag']);
        // })
        // cc.log('bbbb')
        this.checkAndShowSendFace();
    },
    checkAndShowSendFace(){
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
            if(isgetThis == false){
                isNeedSend = true;
                cc.log("isNeedSend",i);
                break;
            }
        }
        if(isNeedSend == true){
            var sendNode = cc.instantiate(this.sendFacePrefab);
            cc.find("Canvas/PopWindow").removeAllChildren();
            cc.find("Canvas/PopWindow").addChild(sendNode);
        }
    },
    httpRequest(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                callback(xhr.responseText);
            }
        };
        xhr.open("GET", `${url}?v=${Math.random()}`, true);
        xhr.send();
    },

    start() {
        // cc.sys.localStorage.clear();

        cc.director.preloadScene("Game", function () {
            cc.log("Next scene preloaded");
        });
        this.reFreshGold();
        this.updateFaceSelect();
        this.updateLoginShowFace();
        cc.find("AudioManager").getComponent("AudioManager").playLobbyBGM();
    },
    showTips(info) {
        var tipsNode = cc.instantiate(this.tips)
        var infoLabel = tipsNode.getChildByName("info").getComponent(cc.Label);
        infoLabel.string = info;
        cc.find("Canvas/PopWindow").removeAllChildren();
        cc.find("Canvas/PopWindow").addChild(tipsNode);
    },
    initADInsert() {
        // oppo start
        if (typeof qg != "undefined") {
            // qg.login({
            //     success: function(res){
            //         var data = JSON.stringify(res.data);
            //         console.log(data);
            //     },
            //     fail: function(res){
            //       // errCode、errMsg
            //         console.log(JSON.stringify(res));
            //     }
            // });

            // 创建 Banner 广告实例，提前初始化
            if (InsertADSinglen == null) {
                InsertADSinglen = this.interstitialAd = qg.createInsertAd({
                    posId: "135452"
                })
            } else {
                this.interstitialAd = InsertADSinglen;
            }

        }
        return;
        // oppo end

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
    initADReward() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
            return;
        }
        // 创建激励视频广告实例，提前初始化
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: 'adunit-516da520176dc054'
        })
        this.videoAd.onError(err => {
            console.log(err)
            this.showTips(err);
        })

        this.videoAd.onClose(res => {
            // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                // this.showTips('正常播放结束，可以下发游戏奖励');
                console.log("正常播放结束，可以下发游戏奖励");
            }
            else {
                // 播放中途退出，不下发游戏奖励
                // this.showTips('播放中途退出，不下发游戏奖励');
                console.log('播放中途退出，不下发游戏奖励');

            }
        })
    },
    initADBanner() {
        // oppo start
        if (typeof qg != "undefined") {
            // qg.login({
            //     success: function(res){
            //         var data = JSON.stringify(res.data);
            //         console.log(data);
            //     },
            //     fail: function(res){
            //       // errCode、errMsg
            //         console.log(JSON.stringify(res));
            //     }
            // });

            // 创建 Banner 广告实例，提前初始化
            if (BannerADSinglen == null) {
                BannerADSinglen = this.bannerAd = qg.createBannerAd({
                    posId: "134207"
                })
            } else {
                this.bannerAd = BannerADSinglen;
            }

        }
        return;
        // oppo end

        // if(typeof wx === "undefined"){
        //     // this.showTips("weixin only");
        //     return;
        // }
        // // 创建 Banner 广告实例，提前初始化
        // let systemInfo = wx.getSystemInfoSync();
        // let _width = systemInfo.windowWidth/2;
        // let _height = systemInfo.windowHeight;

        // if(BannerADSinglen == null){
        //     BannerADSinglen = this.bannerAd = wx.createBannerAd({
        //         adUnitId: 'adunit-24700a92e658f5cc',
        //         adIntervals: 30, // 自动刷新频率不能小于30秒
        //         style: {
        //             left: 0,
        //             top : 0,
        //             // width: 350,
        //             // height: 300,
        //         }
        //     })
        //     var self = this;
        //     this.bannerAd.onResize(function(){
        //         // self.bannerAd.style.left = _width - self.bannerAd.style.realWidth+0.1;
        //         self.bannerAd.style.left = _width - self.bannerAd.style.realWidth/2+0.1;
        //         self.bannerAd.style.top = _height - self.bannerAd.style.realHeight+0.1;
        //         console.log( self.bannerAd);
        //     })
        //     this.bannerAd.onError(err => {
        //         console.log(err);
        //         // this.showTips("errMsg" + err.errMsg);
        //     });
        // }else{
        //     this.bannerAd = BannerADSinglen;
        // }
    },
    showADInsert() {
        // oppo start
        if (typeof qg != "undefined") {
            // 在适合的场景显示 Banner 广告
            if (InsertADSinglen) {
                console.log("显示 insert 广告");
                var self = this;
                this.interstitialAd.onLoad(function () {
                    console.log("insert 加载成功");
                    self.interstitialAd.show();
                })
                this.interstitialAd.load();
                // InsertADSinglen.show();
            }
        }
        return;
        // oppo end

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
    // showADReward(){
    //     if(typeof wx === "undefined"){
    //         this.showTips("weixin only");
    //     }else{
    //         // 用户触发广告后，显示激励视频广告
    //         this.videoAd.show().catch(() => {
    //             // 失败重试
    //             this.videoAd.load()
    //             .then(() => this.videoAd.show())
    //             .catch(err => {
    //                 // this.showTips("errMsg" + err.errMsg);
    //             })
    //         })
    //     }
    // },
    showADBanner() {
        // oppo start
        if (typeof qg != "undefined") {
            // 在适合的场景显示 Banner 广告
            if (BannerADSinglen) {
                console.log("显示 Banner 广告");
                BannerADSinglen.show();
            }
        }
        return;
        // oppo end

        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
        } else {
            // 在适合的场景显示 Banner 广告
            this.bannerAd.show();
        }
    },
    HideADBanner() {
        if (typeof wx === "undefined") {
            // this.showTips("weixin only");
        } else {
            // 在适合的场景显示 Banner 广告
            this.bannerAd.hide();
        }
    },
    onDestroy() {
        this.HideADBanner();
    },
    updateLoginShowFace() {
        var userData = getUserFaceData();
        var faceIndex = userData.currentSelectIndex;
        // var faceIndex = 5;
        this._armatureDisplay = cc.find("Canvas/bg/faceDisplay/faceDB").getComponent(dragonBones.ArmatureDisplay);
        this._armature = this._armatureDisplay.armature();
        this._armatureDisplay.dragonAsset = this.dragonBonesAssetList[faceIndex];
        this._armatureDisplay.dragonAtlasAsset = this.dragonBonesAtlasList[faceIndex];
        this.faceActName = ["kongxianshi","lianxushouji","xiaomiewanjia","biworuoxiao","biwoqiangda"];
        this.playerFaceAct(this.faceActName[0], -1);
    },
    playerFaceAct(actName, playTimes) {
        cc.log("actName", actName);
        this._armatureDisplay.armatureName = actName;
        this._armature = this._armatureDisplay.armature();
        this._armature.animation.fadeIn(actName, -1, playTimes, 0);
    },
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
    JumpToGame1() {
        if (typeof wx === "undefined") {
            return;
        }
        wx.navigateToMiniProgram({
            appId: 'wx3b98d190491bd4ac',
            path: '',
            extraData: {
                data: 'someData'
            },
            envVersion: 'release',
            success(res) {
                // 打开成功
            }
        })
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
            this.showFriendRank();
        } else if (cc.sys.platform === cc.sys.WIN32) {
            this.showTips("暂未开放");
            return;
        } else {
            this.showTips("暂未开放");
            return;
        }

    },
    //  關閉排行榜
    closeRank() {
        cc.find("AudioManager").getComponent("AudioManager").playbtnClick();
        this.RankNode.active = false;
    },
    // 展示排行榜
    showFriendRank() {
        cc.log("showFriendRank");
        if (typeof wx === "undefined") {
            return;
        }
        wx.getOpenDataContext().postMessage({
            MsgType: "ShowFriendRank",
        });
    },
    // 上传积分
    SubmitScore(scoreToAdd) {
        if (typeof wx === "undefined") {
            return;
        }
        scoreToAdd = 1;
        cc.log("SubmitScore", scoreToAdd);
        wx.getOpenDataContext().postMessage({
            MsgType: "SubmitScore",
            score: parseInt(scoreToAdd),
        });
    },
    // 分享
    shareGame() {
        if (typeof wx === "undefined") {
            return;
        }
        wx.shareAppMessage({
            title: '浴室大作战',
        });
    },
    // 设置金币
    reFreshGold() {
        var gold = cc.sys.localStorage.getItem("Gold");
        if (gold) {
            this.goldLabel.string = gold + "";
        } else {
            this.goldLabel.string = 0 + "";
        }
    },
});
