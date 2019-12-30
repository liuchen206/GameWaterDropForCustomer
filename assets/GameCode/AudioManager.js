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
        bgLobbyClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        bgGameClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        winClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        loseClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        goldClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        btnClickClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        mergeClip:        {
            type: cc.AudioClip ,
            default: null, 
        },
        // testCilp:cc.AudioClip,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.game.addPersistRootNode(this.node);

        // this.bgLobbyUrl = 'http://tools.itharbors.com/christmas/res/sounds/ss.mp3';
        this.bgLobbyUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/lobbyBGM.mp3";
        this.bgGameUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/GameBGM.mp3";
        this.btnClickUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/btnClick.mp3";
        this.glodUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/gold.mp3";
        this.loseUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/lose.mp3";
        this.mergeUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/merge.mp3";
        this.winUrl = "http://youjiang.gaoji.ren:15050/wechat/Audios/win.mp3";
        // cc.loader.load({url: this.bgLobbyUrl, type: 'mp3'}, this.onProgress.bind(this), this.bgLobbyComplete.bind(this));
        // cc.loader.load({url: this.bgGameUrl, type: 'mp3'}, this.onProgress.bind(this), this.bgGameComplete.bind(this));
        // cc.loader.load({url: this.btnClickUrl, type: 'mp3'}, this.onProgress.bind(this), this.btnComplete.bind(this));
        // cc.loader.load({url: this.glodUrl, type: 'mp3'}, this.onProgress.bind(this), this.glodComplete.bind(this));
        // cc.loader.load({url: this.loseUrl, type: 'mp3'}, this.onProgress.bind(this), this.loseComplete.bind(this));
        // cc.loader.load({url: this.mergeUrl, type: 'mp3'}, this.onProgress.bind(this), this.mergeComplete.bind(this));
        // cc.loader.load({url: this.winUrl, type: 'mp3'}, this.onProgress.bind(this), this.winComplete.bind(this));
        
        this.bgLobbyPlay = null;
        this.bgGamePlay = null;
    },
    bgLobbyComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.bgLobbyClip = res;
        this._playLobbyBGM_();
    },
    bgGameComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.bgGameClip = res;
    },
    btnComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.btnClickClip = res;
    },
    glodComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.goldClip = res;
    },
    loseComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.loseClip = res;

    },
    mergeComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.mergeClip = res;

    },
    winComplete (err, res) {
        if (err || !res) {
            console.log(err);
            return;
        }
        this.winClip = res;
    },

    onProgress (completedCount, totalCount) {

    },
    start () {
    },

    // update (dt) {},

    _playLobbyBGM_(){
        if(this.bgLobbyClip == null){
            return;
        }
        this.stopGameBGM();

        this.bgLobbyPlay = cc.audioEngine.play(this.bgLobbyClip, true,1);
    },
    _stopLobbyBGM_(){
        if(this.bgLobbyPlay != null){
            cc.audioEngine.stop(this.bgLobbyPlay);
            this.bgLobbyPlay = null;
        }
    },
    playGameBGM(){
        if(this.bgLobbyClip == null){
            return;
        }
        this._stopLobbyBGM_();
        this.bgGamePlay = cc.audioEngine.play(this.bgLobbyClip, true,1);
    },
    stopGameBGM(){
        if(this.bgGamePlay != null){
            cc.audioEngine.stop(this.bgGamePlay);
            this.bgGamePlay = null;
        }
    },
    _playWin_(){
        if(this.winClip == null){
            return;
        }
        this.winPlay = cc.audioEngine.play(this.winClip, false,1);
    },
    playlose(){
        if(this.loseClip == null){
            return;
        }
        this.losePlay = cc.audioEngine.play(this.loseClip, false,1);
    },
    _playgold_(){
        if(this.goldClip == null){
            return;
        }
        this.goldPlay = cc.audioEngine.play(this.goldClip, false,1);
    },
    playbtnClick(){
        if(this.btnClickClip == null){
            return;
        }
        this.btnClickPlay = cc.audioEngine.play(this.btnClickClip, false,1);
    },
    _playMergeClip_(){
        if(this.mergeClip == null){
            return;
        }
        this.mergePlay = cc.audioEngine.play(this.mergeClip, false,1);
    },
});
