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
        unselectBg:cc.SpriteFrame,
        selectBg:cc.SpriteFrame,
        unknowIcon:cc.SpriteFrame,
        faceIconList:[cc.SpriteFrame],
        spriteBg:cc.Sprite,
        lockSprite:cc.Sprite,
        spriteIcon:cc.Sprite,
        btnIndex:0,
        currentBtnStatus:-1,
        BuyFaceDialog:cc.Prefab,
        tips:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    setBtnStatus(status){
        // cc.log("setBtnStatus ",this.btnIndex,status,this.currentBtnStatus);
        if(status == this.currentBtnStatus){
            return;
        }
        if(status == BtnState.GetUnSelect){
            this.spriteBg.spriteFrame = this.unselectBg;
            this.spriteIcon.spriteFrame = this.faceIconList[this.btnIndex];
            this.lockSprite.node.active = false;
        }else if(status == BtnState.GetSelect){
            this.spriteBg.spriteFrame = this.selectBg;
            this.spriteIcon.spriteFrame = this.faceIconList[this.btnIndex];
            this.lockSprite.node.active = false;
        }else if(status == BtnState.Unget){
            this.spriteBg.spriteFrame = this.unselectBg;
            this.spriteIcon.spriteFrame = this.faceIconList[this.btnIndex];
            this.lockSprite.node.active = true;
        }else if(status == BtnState.Unknow){
            this.spriteBg.spriteFrame = this.unselectBg;
            this.spriteIcon.spriteFrame = this.unknowIcon;
            this.lockSprite.node.active = false;
        }
        this.currentBtnStatus = status;
    },
    onClick(){
        if(this.currentBtnStatus == BtnState.GetUnSelect){
            // 获得了，且没有选中
            this.currentBtnStatus = BtnState.GetSelect;
            this.changeFaceSelect(this.btnIndex);
            cc.find("Canvas").getComponent("Login").updateFaceSelect();
            cc.find("Canvas").getComponent("Login").updateLoginShowFace();
        }else if(this.currentBtnStatus == BtnState.GetSelect){
            // 已经获得并且选中
        }else if(this.currentBtnStatus == BtnState.Unget){
            // 未获得 弹出购买框
            this.showBuyDialog(8000*this.btnIndex);
        }else if(this.currentBtnStatus == BtnState.Unknow){
            // 未开发 弹出提示信息
            this.showTips("敬请期待");
        }
    },
    showBuyDialog(coinsCost){
        var dialog = cc.instantiate(this.BuyFaceDialog).getComponent("BuyFace").init(coinsCost,this.btnIndex);
        var btn1Handler = CREATE_EVENT_HANDLER(this.node, "faceItemBtn", "dialogBtn1", {
            dialogSelf:dialog,
            cost:coinsCost
        });
        var btn2Handler = CREATE_EVENT_HANDLER(this.node, "faceItemBtn", "dialogBtn2", dialog);
        dialog.SetBtnBuyHandler(btn1Handler);
        dialog.SetBtnCancelHandler(btn2Handler);
        cc.find("Canvas/PopWindow").addChild(dialog.node);
    },
    showTips(info){
        var tipsNode = cc.instantiate(this.tips)
        var infoLabel = tipsNode.getChildByName("info").getComponent(cc.Label);
        infoLabel.string = info;
        cc.find("Canvas/PopWindow").removeAllChildren();
        cc.find("Canvas/PopWindow").addChild(tipsNode);
    },
    dialogBtn1: function(event, customEventData){
        var gold = cc.sys.localStorage.getItem("Gold");
        gold = parseInt(gold);
        if(gold){
            if(gold >= customEventData.cost){
                // 金币足够，可以购买
            }else{
                this.showTips("金币不足");
                return;
            }
        }else{
            this.showTips("金币不足");
            return;
        }
        cc.log("dialogBtn1 called");
        this.showTips("成功购买");
        customEventData.dialogSelf.close();
        // 扣除金币
        var gold = cc.sys.localStorage.getItem("Gold");
        gold = parseInt(gold);
        if(gold){
            cc.sys.localStorage.setItem("Gold",gold-customEventData.cost); 
        }
        cc.find("Canvas").getComponent("Login").reFreshGold();
        // 解锁表情
        this.unlockedFace(this.btnIndex);
        this.setBtnStatus(BtnState.GetUnSelect);

    },
    dialogBtn2: function(event, customEventData){
        cc.log("dialogBtn2 called");
        // this.showTips("取消购买");
        customEventData.close();
    },
    changeFaceSelect(newFaceIndex){
        var userData = getUserFaceData();
        userData.currentSelectIndex = newFaceIndex;
        cc.sys.localStorage.setItem('UserFaceData', JSON.stringify(userData));
    },
    unlockedFace(unlockedFaceIndex){
        var userData = getUserFaceData();
        userData.ownFaceList.push(unlockedFaceIndex);
        cc.sys.localStorage.setItem('UserFaceData', JSON.stringify(userData));
    },

    // update (dt) {},
});
