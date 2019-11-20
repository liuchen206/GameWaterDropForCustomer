cc.Class({
    extends: cc.Component,

    properties: {
        waterDropPrefab: {
            default: null,
            type: cc.Prefab,
        },
        PlayerPrefab: {
            default: null,
            type: cc.Prefab,
        },
        PlayerAIPrefab: [cc.Prefab],
        timeCounterLabel: cc.Label,
        scoreLabel: cc.Label,
        timeInOneGame: 180, // 秒
        timeCountDown: 0,
        resizeDialog: cc.Prefab,
        GameEndUIPrefab: cc.Prefab,
        GameEndUIOnlySelfWinPrefab: cc.Prefab,
        GamePreStartPrefab: cc.Prefab,
        IsGemeEnd: true,
        playingRankContent: cc.Node,
        playerPosInfoContainer: cc.Node,
        playingRankItemPrefab: cc.Prefab,
        rankBgSpriteList: [cc.SpriteFrame],
        someonDefeadedPrefab: cc.Prefab,
        mainCamera: cc.Camera,
        BGNode: cc.Node,
        // testNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.commonWaterDropContainer = cc.find('Canvas/GameView/GameWorld/CommonWaterDropContainer');
        this.playerAIContainer = cc.find('Canvas/GameView/GameWorld/PlayerAIContainer');
        this.playerContainer = cc.find('Canvas/GameView/GameWorld/PlayerContainer');
        this.viewMoveJS = cc.find("Canvas").getComponent("ViewMove");
        this.bgNode = cc.find("Canvas/GameView");
        this.IsGemeEnd = true;
        this.playerPos = cc.Vec2.ZERO;
        EventCenter.AddListener(EventCenter.EventType.Water_Drop_Added, this.AddWaterDropCB, this);
        EventCenter.AddListener(EventCenter.EventType.Someone_Be_Defeaded, this.SomeonDefeadedCB, this);
        EventCenter.AddListener(EventCenter.EventType.BackToHall, this.BackToHall, this);

        this.commonWaterDropPool = new cc.NodePool();
        let initCount = 5;
        for (let i = 0; i < initCount; ++i) {
            let commonWaterDrop = cc.instantiate(this.waterDropPrefab); // 创建节点
            this.commonWaterDropPool.put(commonWaterDrop); // 通过 put 接口放入对象池
        }
        this.playGameAudio();
        // EventCenter.AddListener(EventCenter.EventType.TEST_EVENT,this.TestCallBack,this);
        // EventCenter.dispatchEvent(EventCenter.EventType.TEST_EVENT);
        // EventCenter.dispatchEvent(EventCenter.EventType.TEST_EVENT,{'data':"1"});
        // EventCenter.RemoveListener(EventCenter.EventType.TEST_EVENT,this.TestCallBack,this);
        // var randomIndex = Math.floor(MapNum(Math.random(),0,1,0,window.playerNames.length));
        // cc.log("name ",randomIndex,window.playerNames[randomIndex]);
        // //保存到本地
        // cc.sys.localStorage.setItem("Gold",100); 
        // //读本地数据
        // var gold = cc.sys.localStorage.getItem("Gold");
        // cc.log("gold",gold);
        // cc.log("isInCanmaerView test ",this.isInCanmaerView(this.testNode.getComponent("PlayerAI")));
        // cc.log("getPosInEdge test ",this.getPosInEdge(this.testNode.getComponent("PlayerAI"),0).toString());

        this.initADReward();

    },
    AddWaterDropCB(score) {
        // cc.log("data : ",score);
        this.setScore(score);
    },
    start() {
        this.startGame();
        cc.director.preloadScene("Login", function () {
            cc.log("Next scene preloaded");
        });
    },

    update(dt) {
        if (this.IsGemeEnd == true) {
            return;
        }
        this.generateCommonWaterDrop();
        this.updatePlayingRankList();
        this.updatePlayerPosInfo();
        this.checkGameOverCondition();
    },
    onDestroy() {
        EventCenter.RemoveListener(EventCenter.EventType.Water_Drop_Added, this.AddWaterDropCB, this);
        EventCenter.RemoveListener(EventCenter.EventType.Someone_Be_Defeaded, this.SomeonDefeadedCB, this);
        EventCenter.RemoveListener(EventCenter.EventType.BackToHall, this.BackToHall, this);
    },
    startGame() {
        // 启动匹配界面
        var GamePreStartJS = cc.instantiate(this.GamePreStartPrefab).getComponent("GamePreStartUI").init(this);
        cc.find("Canvas/UIView/PopWindow").addChild(GamePreStartJS.node);
    },
    runGame(nameList) {
        this.cleanAllPlayer();
        this.cleanAllPlayerAI();
        this.nameList = nameList;
        this.timeCountDown = this.timeInOneGame;
        this.setTime(this.timeInOneGame);
        this.setScore(0);
        this.schedule(this._callbackGameTime, 1);
        this.scheduleOnce(function () {
            this.generatePlayerAI(this.nameList);
            this.generatePlayer();
            this.IsGemeEnd = false;
        }.bind(this), 0.5);
        this.stillPlayingList = [];
        this.losePlayerList = [];
    },
    endGameIWin(rank, playInfoList) {
        this.IsGemeEnd = true;
        this.unschedule(this._callbackGameTime);
        this.Joystick = cc.find("Canvas/UIView/Joystick");
        this.JoystickJS = this.Joystick.getComponent('Joystick');
        this.JoystickJS.playerJS = null;

        var dialog = cc.instantiate(this.GameEndUIOnlySelfWinPrefab).getComponent("GameEndUIOnlySelfWin").init(rank, playInfoList);
        var btn1Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn1", dialog);
        var btn2Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn2", dialog);
        dialog.SetBtnUpHandler("" + this.playerScore * 30, btn1Handler);
        dialog.SetBtnDownHandler("" + this.playerScore * 10, btn2Handler);

        cc.find("Canvas/UIView/PopWindow").addChild(dialog.node);
        this.SubmitScore(this.playerScore);
    },
    endGame(endtitle, endContent, rankNum) {
        this.IsGemeEnd = true;
        this.unschedule(this._callbackGameTime);
        this.Joystick = cc.find("Canvas/UIView/Joystick");
        this.JoystickJS = this.Joystick.getComponent('Joystick');
        this.JoystickJS.playerJS = null;

        // var dialog = cc.instantiate(this.resizeDialog).getComponent("Dialog").init(endtitle,endContent);
        // var btn1Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn1", dialog);
        // var btn2Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn2", dialog);
        // dialog.disabledCloseBtn();
        // dialog.addButton("重新开始", btn1Handler).addButton("返回大厅", btn2Handler);

        var dialog = cc.instantiate(this.GameEndUIPrefab).getComponent("GameEndUI").init(endtitle + endContent, rankNum, this.playerScore);
        var btn1Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn1", dialog);
        var btn2Handler = CREATE_EVENT_HANDLER(this.node, "GameManager", "dialogBtn2", dialog);
        dialog.SetBtnUpHandler("" + this.playerScore * 30, btn1Handler);
        dialog.SetBtnDownHandler("" + this.playerScore * 10, btn2Handler);

        cc.find("Canvas/UIView/PopWindow").addChild(dialog.node);
        this.SubmitScore(this.playerScore);

        PlayerTimes++;
    },
    dialogBtn1: function (event, customEventData) {
        cc.log("dialogBtn1 called");
        var result = this.showADReward();
        if (result == false) {
            customEventData.close();
            this._addGoldToLocal(this.playerScore * 30);
            cc.director.loadScene("Login");
        }
        // if(PlayerTimes%2 == 0){
        //     var result = this.showADReward();
        //     if(result == false){
        //         customEventData.close();
        //         this._addGoldToLocal(this.playerScore*30);
        //         cc.director.loadScene("Login");
        //     }
        // }else{
        //     customEventData.close();
        //     this.playGoldAudio();
        //     this._addGoldToLocal(this.playerScore*30);
        //     cc.director.loadScene("Login",this.onSceneLaunched.bind(this));
        // }
    },
    onSceneLaunched() {
        this.playGoldAudio();

        // if(typeof wx === "undefined"){
        //     return;
        // }
        // wx.shareAppMessage({
        //     title: '浴室大作战',
        //     imageUrl:'http://youjiang.gaoji.ren:15050/wechat/wxShare/logo.png',
        // });
    },
    dialogBtn2: function (event, customEventData) {
        cc.log("dialogBtn2 called");
        customEventData.close();
        this.playGoldAudio();
        this._addGoldToLocal(this.playerScore * 10);
        cc.director.loadScene("Login");
    },
    _addGoldToLocal(addedGold) {
        var gold = cc.sys.localStorage.getItem("Gold");
        gold = parseInt(gold);
        cc.log("gold", typeof gold);

        if (gold) {
            cc.log("gold", gold);
            cc.sys.localStorage.setItem("Gold", gold + addedGold);
        } else {
            cc.sys.localStorage.setItem("Gold", addedGold);
        }
    },
    // 玩家击败了玩家时间，UI展示
    SomeonDefeadedCB(data) {
        cc.log(data.winerName + " defeaded " + data.loseName);
        cc.find("Canvas/UIView/SomeoneLosePopWindow").removeAllChildren();
        var someoneBeDefeadedUI = cc.instantiate(this.someonDefeadedPrefab).getComponent("SomeoneBeDefeaded").init(data.winerName, data.loseName);
        cc.find("Canvas/UIView/SomeoneLosePopWindow").addChild(someoneBeDefeadedUI.node);

        this.losePlayerList.push({
            name: data.loseName,
            score: data.loseScore,
            colorStyleIndex: data.loseColorStyleIndex,
            playerNodeJS: data.losePlayerNodeJS,
            isMainPlayer: data.isMainPlayer,
        });
        if (data.isMainPlayer == true) {
            this.nameWhoEatMe = data.winnerName;
        }
    },
    // 上传积分
    SubmitScore(scoreToAdd) {
        cc.log("SubmitScore", scoreToAdd);
        if (typeof wx === "undefined") {
            return;
        }
        wx.getOpenDataContext().postMessage({
            MsgType: "SubmitScore",
            score: parseInt(scoreToAdd),
        });
    },
    // 设置比赛中的得分数
    setScore(score) {
        this.playerScore = score;
        var scoreString = score*10;
        this.scoreLabel.string = scoreString + "";
    },
    // 设置比赛中的剩余时间
    setTime(timeInSec) {
        var min = Math.floor(timeInSec / 60);
        var sec = timeInSec % 60;
        var minString = min < 10 ? ('0' + min) : min;
        var secString = sec < 10 ? ('0' + sec) : sec;
        this.timeCounterLabel.string = minString + ":" + secString;
    },
    // 设置比赛中的得分排名情况
    updatePlayingRankList() {
        this.stillPlayingList = [];
        if (this.playerAIContainer != null) {
            var allNodeInCanvas = this.playerAIContainer.children;
            for (var i = 0; i < allNodeInCanvas.length; i++) {
                var playerAIJS = allNodeInCanvas[i].getComponent('PlayerAI');
                if (playerAIJS !== null) {
                    var playerName = playerAIJS.playerName;
                    var playerScore = playerAIJS.collectedWaterDropScore;
                    var colorStyleIndex = playerAIJS.PreferGraphicsStyle;
                    this.stillPlayingList.push({
                        name: playerName,
                        score: playerScore,
                        colorStyleIndex: colorStyleIndex,
                        playerNodeJS: playerAIJS,
                        isMainPlayer: false,
                    });
                }
            }
        }

        if (this.playerContainer != null) {
            var allNodeInCanvas = this.playerContainer.children;
            for (var i = 0; i < allNodeInCanvas.length; i++) {
                var playerJS = allNodeInCanvas[i].getComponent('Player');
                if (playerJS !== null) {
                    var playerName = playerJS.playerName;
                    var playerScore = playerJS.collectedWaterDropScore;
                    var colorStyleIndex = playerJS.PreferGraphicsStyle;
                    this.stillPlayingList.push({
                        name: playerName,
                        score: playerScore,
                        colorStyleIndex: colorStyleIndex,
                        playerNodeJS: playerAIJS,
                        isMainPlayer: true,
                    });
                }
            }
        }

        this.stillPlayingList.sort((a, b) => {
            if (a.score == 0 && b.score == 0) {
                return 0;
            }
            if (a.score == 0) {
                return 1;
            }
            if (b.score == 0) {
                return -1;
            }
            return b.score - a.score;
        });
        // cc.log("this.stillPlayingList.length",this.stillPlayingList.length);
        var rankItemNodeList = this.playingRankContent.children;
        for (var i = 0; i < rankItemNodeList.length; i++) {
            var nameString = null;
            var node = rankItemNodeList[i];
            if (i < this.stillPlayingList.length) {
                node.opacity = 255;
                nameString = this.stillPlayingList[i].name + "";
                // cc.log("剩余玩家:"+this.stillPlayingList.length);
                var userName = node.getChildByName('nameLabel').getComponent(cc.Label);
                userName.string = nameString;

                var rankBg = this.rankBgSpriteList[this.stillPlayingList[i].colorStyleIndex % 10];
                var rankBgSprite = node.getChildByName('rankIcon').getComponent(cc.Sprite);
                rankBgSprite.spriteFrame = rankBg;

                var rankLabel = node.getChildByName("rankIcon").getChildByName("rank").getComponent(cc.Label);
                rankLabel.string = (i + 1) + "";

                var scoreLabel = node.getChildByName('scoreLabel').getComponent(cc.Label);
                scoreLabel.string = this.stillPlayingList[i].score + "";
            } else {
                node.opacity = 0;
            }
        }
    },
    // 更新其他玩家的位置提示信息
    updatePlayerPosInfo() {
        var playerPosInfoList = this.playerPosInfoContainer.children;
        for (var i = 0; i < playerPosInfoList.length; i++) {
            var playerPosInfoNode = playerPosInfoList[i];
            if (i < this.stillPlayingList.length) {
                var playerInfo = this.stillPlayingList[i];
                if (this.isInCanmaerView(playerInfo.playerNodeJS) == false && playerInfo.isMainPlayer != true) {
                    var rankBg = this.rankBgSpriteList[playerInfo.colorStyleIndex % 10];
                    var rankBgSprite = playerPosInfoNode.getComponent(cc.Sprite);
                    rankBgSprite.spriteFrame = rankBg;
                    var rankLabel = playerPosInfoNode.getChildByName("rank").getComponent(cc.Label);
                    rankLabel.string = (i + 1) + "";

                    playerPosInfoNode.position = this.getPosInEdge(playerInfo.playerNodeJS, 15);
                    playerPosInfoNode.opacity = 255;
                } else {
                    playerPosInfoNode.opacity = 0;
                }
            } else {
                playerPosInfoNode.opacity = 0;
            }
        }
    },
    // 返回在屏幕邊緣上的坐标
    getPosInEdge(playerNodeJS, offset) {
        if (playerNodeJS == "undefined" || playerNodeJS == null) {
            return;
        }
        var posmainCamera = this.mainCamera.node.position;
        // cc.log("posmainCamera",posmainCamera.toString());
        var posXRightBounder = cc.winSize.width / 2 + posmainCamera.x;
        var posXLeftBounder = -cc.winSize.width / 2 + posmainCamera.x;

        var posYUpBounder = cc.winSize.height / 2 + posmainCamera.y;
        var posYDownBounder = -cc.winSize.height / 2 + posmainCamera.y;
        var xEdgePos = playerNodeJS.node.position.x;
        var yEdgePos = playerNodeJS.node.position.y;
        if (playerNodeJS.node.position.x + playerNodeJS.radius < posXLeftBounder) {
            xEdgePos = -cc.winSize.width / 2 + offset;
        } else if (playerNodeJS.node.position.x - playerNodeJS.radius > posXRightBounder) {
            xEdgePos = cc.winSize.width / 2 - offset;
        } else {
            xEdgePos = cc.winSize.width * playerNodeJS.node.position.x / this.BGNode.width;
        }

        if (playerNodeJS.node.position.y + playerNodeJS.radius < posYDownBounder) {
            yEdgePos = -cc.winSize.height / 2 + offset;
        } else if (playerNodeJS.node.position.y - playerNodeJS.radius > posYUpBounder) {
            yEdgePos = cc.winSize.height / 2 - offset;
        } else {
            yEdgePos = cc.winSize.height * playerNodeJS.node.position.y / this.BGNode.height;
        }
        return new cc.Vec2(xEdgePos, yEdgePos);
    },
    // 是否在屏幕内
    isInCanmaerView(playerNodeJS) {
        if (playerNodeJS == "undefined" || playerNodeJS == null) {
            return;
        }
        var posmainCamera = this.mainCamera.node.position;
        // cc.log("posmainCamera",posmainCamera.toString());
        var posXRightBounder = cc.winSize.width / 2 + posmainCamera.x;
        var posXLeftBounder = -cc.winSize.width / 2 + posmainCamera.x;

        var posYUpBounder = cc.winSize.height / 2 + posmainCamera.y;
        var posYDownBounder = -cc.winSize.height / 2 + posmainCamera.y;
        var xIn = false;
        if (playerNodeJS.node.position.x + playerNodeJS.radius > posXLeftBounder && playerNodeJS.node.position.x - playerNodeJS.radius < posXRightBounder) {
            xIn = true;
        }
        var yIn = false;
        if (playerNodeJS.node.position.y + playerNodeJS.radius > posYDownBounder && playerNodeJS.node.position.y - playerNodeJS.radius < posYUpBounder) {
            yIn = true;
        }
        if (xIn == true && yIn == true) {
            return true;
        } else {
            return false;
        }
    },
    _callbackGameTime() {
        this.timeCountDown -= 1;
        if (this.timeCountDown < 0) {
            this.timeCountDown = 0;
        }
        this.setTime(this.timeCountDown);

        // 开局10s之后，每隔5秒
        var timeElapse = this.timeInOneGame - this.timeCountDown;
        if (timeElapse > 15) {
            if (timeElapse % 5 == 0) {
                // 挑一个ai让其变得有攻击性
                if (this.playerAIContainer != null) {
                    var allNodeInCanvas = this.playerAIContainer.children;
                    for (var i = 0; i < allNodeInCanvas.length; i++) {
                        var playerAIJS = allNodeInCanvas[i].getComponent('PlayerAI');
                        if (playerAIJS !== null) {
                            if (playerAIJS.LogicPerferAttack == false) {
                                cc.log("at :" + timeElapse + " ai " + playerAIJS.playerName + " turn attack");
                                playerAIJS.LogicPerferAttack = true;
                                break;
                            }
                        }
                    }
                }
            }
        }
    },
    playGameAudio() {
        if (cc.find("AudioManager") != null) {
            cc.find("AudioManager").getComponent("AudioManager").playGameBGM();
        }
    },
    playWinAudio() {
        if (cc.find("AudioManager") != null) {
            cc.find("AudioManager").getComponent("AudioManager").stopGameBGM();
            cc.find("AudioManager").getComponent("AudioManager").playWin();
        }
    },
    playLoseAudio() {
        if (cc.find("AudioManager") != null) {
            cc.find("AudioManager").getComponent("AudioManager").stopGameBGM();
            cc.find("AudioManager").getComponent("AudioManager").playlose();
        }
    },
    playGoldAudio() {
        if (cc.find("AudioManager") != null) {
            cc.find("AudioManager").getComponent("AudioManager").playgold();
        }
    },
    checkGameOverCondition() {
        // 1,只剩自己
        var playerAILength = this.getAllPlayerAILength();
        if (playerAILength <= 0) {
            cc.log("只剩自己");
            // var resultList = this.losePlayerList.concat(this.stillPlayingList);
            // resultList.sort((a, b) => {
            //     if (a.score == 0 && b.score == 0) {
            //         return 0;
            //     }
            //     if (a.score == 0) {
            //         return 1;
            //     }
            //     if (b.score == 0) {
            //         return -1;
            //     }
            //     return b.score - a.score;
            // });
            // this.endGameIWin(1, resultList);
            this.endGame("", "", 1);

            this.playWinAudio();
        }
        // 2,时间结束
        if (this.timeCountDown <= 0) {
            cc.log("时间结束");
            var rankNum = this.stillPlayingList.length;
            for (var i = 0; i < this.stillPlayingList.length; i++) {
                if (this.stillPlayingList[i].isMainPlayer == true) {
                    rankNum = i + 1;
                }
            }
            var resultList = this.losePlayerList.concat(this.stillPlayingList);
            resultList.sort((a, b) => {
                if (a.score == 0 && b.score == 0) {
                    return 0;
                }
                if (a.score == 0) {
                    return 1;
                }
                if (b.score == 0) {
                    return -1;
                }
                return b.score - a.score;
            });
            // this.endGameIWin(rankNum, resultList);
            this.endGame("", "", rankNum);

            this.playWinAudio();
        }
        // 3,自己被其他player吞噬
        var playernodeLength = this.getPlayerLength();
        if (playernodeLength <= 0) {
            cc.log("自己被其他player吞噬");
            this.endGame("", this.nameWhoEatMe, this.stillPlayingList.length + 1);
            // var resultList = this.losePlayerList.concat(this.stillPlayingList);
            // resultList.sort((a, b) => {
            //     if (a.score == 0 && b.score == 0) {
            //         return 0;
            //     }
            //     if (a.score == 0) {
            //         return 1;
            //     }
            //     if (b.score == 0) {
            //         return -1;
            //     }
            //     return b.score - a.score;
            // });
            // this.endGameIWin(1,resultList);

            this.playLoseAudio();
        }
    },
    generatePlayer() {
        var newPlayerNode = cc.instantiate(this.PlayerPrefab);
        var newPlayerNodeJS = newPlayerNode.getComponent('Player');
        // newPlayerNodeJS.radius = MapNum(Math.random(),0,1,30,50);
        newPlayerNodeJS.radius = 20;
        newPlayerNodeJS.canntSplitTime = 1;
        newPlayerNodeJS.dragForceNodeIndex = -1;
        newPlayerNodeJS.playerName = "我";
        newPlayerNodeJS.factActIndex = getUserFaceData().currentSelectIndex;
        newPlayerNodeJS.initNodes();

        newPlayerNode.position = this.playerPos;
        newPlayerNode.active = true;
        newPlayerNode.parent = this.playerContainer;

        this.viewMoveJS.followNode = newPlayerNode;
        this.Joystick = cc.find("Canvas/UIView/Joystick");
        this.JoystickJS = this.Joystick.getComponent('Joystick');
        this.JoystickJS.playerJS = newPlayerNodeJS;

    },
    generatePlayerAI(nameList) {
        var aiNumber = 9;
        var currentNumInCanvasLength = this.getAllPlayerAILength();
        for (var i = currentNumInCanvasLength; i < aiNumber; i++) {
            var newPlayerAINode = null;
            newPlayerAINode = cc.instantiate(this.PlayerAIPrefab[0]);
            // if(i%2 == 0){
            //     newPlayerAINode = cc.instantiate(this.PlayerAIPrefab[0]);
            // }else{
            //     newPlayerAINode = cc.instantiate(this.PlayerAIPrefab[1]);
            // }
            if (newPlayerAINode == null) {
                cc.error("generatePlayerAI newPlayerAINode == null");
                return;
            }
            var newPlayerAINodeJS = newPlayerAINode.getComponent('PlayerAI');
            // newPlayerAINodeJS.radius = 25;
            // newPlayerAINodeJS.radius = MapNum(Math.random(),0,1,20,21);
            newPlayerAINodeJS.radius = 20;
            newPlayerAINodeJS.canntSplitTime = 1;
            newPlayerAINodeJS.dragForceNodeIndex = -1;
            newPlayerAINodeJS.PreferGraphicsStyle = i;
            var randomNum = Math.floor(Math.random() * 10);
            newPlayerAINodeJS.factActIndex = randomNum;
            // newPlayerAINodeJS.factActIndex = 0;

            newPlayerAINodeJS.initNodes();
            newPlayerAINodeJS.LogicPerferAttack = false;
            // cc.log("newPlayerAINodeJS.PreferGraphicsStyle",newPlayerAINodeJS.PreferGraphicsStyle);

            // var randomIndex = Math.floor(MapNum(Math.random(),0,1,0,window.playerNames.length));
            // newPlayerAINodeJS.playerName = window.playerNames[randomIndex];
            newPlayerAINodeJS.playerName = nameList[i];

            var positionX = MapNum(Math.random(), 0, 1, -this.bgNode.width / 2 + newPlayerAINodeJS.radius / 2, this.bgNode.width / 2 - newPlayerAINodeJS.radius / 2);
            var positionY = MapNum(Math.random(), 0, 1, -this.bgNode.height / 2 + newPlayerAINodeJS.radius / 2, this.bgNode.height / 2 - newPlayerAINodeJS.radius / 2);
            newPlayerAINode.position = new cc.Vec2(positionX, positionY);
            newPlayerAINode.active = true;
            newPlayerAINode.parent = this.playerAIContainer;
        }
    },
    createCommonWaterDrop: function (parentNode) {
        let waterDrop = null;
        if (this.commonWaterDropPool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            waterDrop = this.commonWaterDropPool.get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            waterDrop = cc.instantiate(this.waterDropPrefab);
        }
        var newWaterDropNodeJS = waterDrop.getComponent('CommonWaterDrop');
        newWaterDropNodeJS.radius = MapNum(Math.random(), 0, 1, 10, 30);
        newWaterDropNodeJS.canntSplitTime = 0;
        newWaterDropNodeJS.dragForceNodeIndex = -1;
        newWaterDropNodeJS.PreferGraphicsStyle = Math.floor(MapNum(Math.random(), 0, 1, 0, 10));
        // newWaterDropNodeJS.PreferGraphicsStyle = 0;
        newWaterDropNodeJS.initNodes();
        var positionX = MapNum(Math.random(), 0, 1, -this.bgNode.width / 2 + newWaterDropNodeJS.radius / 2, this.bgNode.width / 2 - newWaterDropNodeJS.radius / 2);
        var positionY = MapNum(Math.random(), 0, 1, -this.bgNode.height / 2 + newWaterDropNodeJS.radius / 2, this.bgNode.height / 2 - newWaterDropNodeJS.radius / 2);
        newWaterDropNodeJS.node.position = new cc.Vec2(positionX, positionY);
        newWaterDropNodeJS.node.active = true;
        waterDrop.parent = parentNode;
    },
    generateCommonWaterDrop() {
        var quality = 45;
        var currentNumInCanvasLength = this.getAllCommonWaterDropLength();
        for (var i = currentNumInCanvasLength; i < quality; i++) {
            this.createCommonWaterDrop(this.commonWaterDropContainer);
        }
    },
    cleanAllPlayer() {
        if (this.playerContainer == null) {
            return;
        }
        var allNodeInCanvas = this.playerContainer.children;
        for (var i = 0; i < allNodeInCanvas.length; i++) {
            // allNodeInCanvas[i].removeFromParent();
            allNodeInCanvas[i].destroy();
        }
    },
    cleanAllPlayerAI() {
        if (this.playerAIContainer == null) {
            return;
        }
        var allNodeInCanvas = this.playerAIContainer.children;
        for (var i = 0; i < allNodeInCanvas.length; i++) {
            // allNodeInCanvas[i].removeFromParent();
            allNodeInCanvas[i].destroy();
        }
    },
    getPlayerLength() {
        if (this.playerContainer == null) {
            return [];
        }
        var allNodeInCanvas = this.playerContainer.children;
        var len = allNodeInCanvas.length;
        if (len > 0) {
            this.playerPos = allNodeInCanvas[0].position; // 保存下每次检测的player的位置，为了确定重生位置用
        }
        return len;
    },
    getAllPlayerAILength() {
        if (this.playerAIContainer == null) {
            return [];
        }
        var allNodeInCanvas = this.playerAIContainer.children;
        var len = allNodeInCanvas.length;
        return len;
    },
    getAllCommonWaterDropLength() {
        if (this.commonWaterDropContainer == null) {
            return [];
        }
        var allNodeInCanvas = this.commonWaterDropContainer.children;
        var len = allNodeInCanvas.length;
        return len;
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
            if (BannerADSinglen) {
                console.log("显示 Banner 广告");
                BannerADSinglen.show();
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
    initADReward() {
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
            // if (RewardADSinglen != null) {
            //     console.log("RewardADSinglen destroy in game");
            //     RewardADSinglen.destroy();
            //     RewardADSinglen == null;
            // }
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
                }
            })

            // 创建激励视频广告实例，提前初始化
            if (RewardADSinglen == null) {
                RewardADSinglen = this.videoAd = qg.createRewardedVideoAd({
                    posId: "130416"
                });
                // this.videoAd.onLoad(function() {
                //     console.log("激励视频加载成功");
                //     // this.videoAd.show();
                // })
            } else {
                this.videoAd = RewardADSinglen;
            }
        }
        return;
        // oppo end

        // if(typeof wx === "undefined"){
        //     // cc.log("weixin only");
        //     return;
        // }
        // // 创建激励视频广告实例，提前初始化
        // if(RewardADSinglen == null){
        //     RewardADSinglen = this.videoAd = wx.createRewardedVideoAd({
        //         adUnitId: 'adunit-516da520176dc054'
        //     })
        //     this.videoAd.onError(err => {
        //         console.log(err)
        //         cc.log(err);
        //     })

        //     this.videoAd.onClose(res => {
        //         // 用户点击了【关闭广告】按钮
        //         // 小于 2.1.0 的基础库版本，res 是一个 undefined
        //         if (res && res.isEnded || res === undefined) {
        //             // 正常播放结束，可以下发游戏奖励 BackToHall
        //             console.log("正常播放结束，可以下发游戏奖励  "+this.playerScore);
        //             EventCenter.dispatchEvent(EventCenter.EventType.BackToHall,{'data':30});
        //         }
        //         else {
        //             // 播放中途退出，不下发游戏奖励
        //             console.log('播放中途退出，不下发游戏奖励  '+this.playerScore);
        //             EventCenter.dispatchEvent(EventCenter.EventType.BackToHall,{'data':10});
        //         }
        //     })
        // }else{
        //     this.videoAd = RewardADSinglen;
        // }
    },
    BackToHall(param) {
        console.log('param[] ' + param['data']);
        this._addGoldToLocal(this.playerScore * param['data']);
        cc.director.loadScene("Login");
    },
    showADReward() {
        // oppo start
        if (typeof qg != "undefined") {
            // this.videoAd.show();
            var self = this;
            this.videoAd.offError();
            this.videoAd.onError(err => {
                console.log("this.videoAd.onError", err)
                cc.log(err);
                self.BackToHall({ 'data': 10 });
                // EventCenter.dispatchEvent(EventCenter.EventType.BackToHall,{'data':10});
            })
            this.videoAd.offClose();
            this.videoAd.onClose(res => {
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    // 正常播放结束，可以下发游戏奖励 BackToHall
                    console.log("正常播放结束，发送观看成功消息 in game");
                    self.BackToHall({ 'data': 30 });
                    // EventCenter.dispatchEvent(EventCenter.EventType.BackToHall, { 'data': 30 });
                }
                else {
                    // 播放中途退出，不下发游戏奖励
                    console.log('播放中途退出，发送观看失败消息');
                    self.BackToHall({ 'data': 10 });
                    // EventCenter.dispatchEvent(EventCenter.EventType.BackToHall, { 'data': 10 });
                }
            })
            this.videoAd.onLoad(function () {
                console.log("激励视频加载成功");
                self.videoAd.show();
            })
            this.videoAd.load();
            return true;
        } else {
            return false;
        }
        // oppo end

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
                        EventCenter.dispatchEvent(EventCenter.EventType.BackToHall, { 'data': 10 });
                    })
            })
        }
        return true;
    },
});
