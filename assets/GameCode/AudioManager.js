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
        
        this.bgLobbyPlay = null;
        this.bgGamePlay = null;
    },
    
    start () {
    },

    // update (dt) {},
    /**
     * 播放大厅背景音乐
     */
    _playLobbyBGM_(){
        if(this.bgLobbyClip == null){
            return;
        }
        this.stopGameBGM();
        this._stopLobbyBGM_();
        this.bgLobbyPlay = cc.audioEngine.play(this.bgLobbyClip, true,1);
    },
    _stopLobbyBGM_(){
        if(this.bgLobbyPlay != null){
            cc.audioEngine.stop(this.bgLobbyPlay);
            this.bgLobbyPlay = null;
        }
    },
    /**
     * 需求变动之后，游戏内播放的其实是大厅中的音乐
     */
    playGameBGM(){
        if(this.bgLobbyClip == null){
            return;
        }
        this.stopGameBGM();
        this._stopLobbyBGM_();
        this.bgGamePlay = cc.audioEngine.play(this.bgLobbyClip, true,1);
    },
    stopGameBGM(){
        if(this.bgGamePlay != null){
            cc.audioEngine.stop(this.bgGamePlay);
            this.bgGamePlay = null;
        }
    },
    /**
     * 播放胜利音效
     */
    _playWin_(){
        if(this.winClip == null){
            return;
        }
        this.winPlay = cc.audioEngine.play(this.winClip, false,1);
    },
    /**
     * 播放失败音效
     */
    playlose(){
        if(this.loseClip == null){
            return;
        }
        this.losePlay = cc.audioEngine.play(this.loseClip, false,1);
    },
    /**
     * 播放金币音效
     */
    _playgold_(){
        if(this.goldClip == null){
            return;
        }
        this.goldPlay = cc.audioEngine.play(this.goldClip, false,1);
    },
    /**
     * 播放按钮点击音效
     */
    playbtnClick(){
        if(this.btnClickClip == null){
            return;
        }
        this.btnClickPlay = cc.audioEngine.play(this.btnClickClip, false,1);
    },
    /**
     * 播放吞噬水滴音效
     */
    _playMergeClip_(){
        if(this.mergeClip == null){
            return;
        }
        this.mergePlay = cc.audioEngine.play(this.mergeClip, false,1);
    },
});
