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
        vVelocity: {
            default: cc.Vec2.ZERO,
            tooltip: '当前速度',
        },
        vStreeingForce: {
            default: cc.Vec2.ZERO,
            tooltip: '施加的动力',
        },
        MaxForce: {
            default: 750,
            tooltip: '最大施加力',
        },
        MaxSpeed: {
            default: 250,
            tooltip: '最大速度(秒/像素)',
        },
        Joystick: {
            default: null,
            type: cc.Node,
            serializable: true
        },
        isDebug: false,
        // blob数据
        quality: {
            default: 8,// 节点密度
        },
        nodes: {
            default: [], // 节点数组
        },
        radius: {
            default: 80, // 半径
        },
        targetRotation: {
            default: 0, // 期望的旋转角
        },
        dragForceNodeIndex: {
            default: -1, // 施加力的节点下标
        },
        canntSplitTime: {
            default: 0, // 禁止再次分离倒计时
        },
        waterDropPrefab: {
            default: null,
            type: cc.Prefab,
        },
        dragonBonesAssetList: [dragonBones.DragonBonesAsset],
        dragonBonesAtlasList: [dragonBones.DragonBonesAtlasAsset],
        factActIndex: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.Joystick = cc.find("Canvas/UIView/Joystick");
        this.JoystickJS = this.Joystick.getComponent('Joystick');
        this.graphics = this.node.getChildByName("waterdrop").getComponent(cc.Graphics);
        this.InstanceID = PlayerInstanceIdManager.GetAnNewID();
        this.bgNode = cc.find("Canvas/GameView");
        this.commonWaterDropContainer = cc.find('Canvas/GameView/GameWorld/CommonWaterDropContainer');
        this.PlayerAIContainer = cc.find('Canvas/GameView/GameWorld/PlayerAIContainer');
        this.collectedWaterDropScore = 0;
        this.vHeading = cc.Vec2.UP;
        // this.quality = 16;

        if (this.nodes.length <= 0) {
            this.initNodes();
        }
        this.faceActName = ["kongxianshi", "lianxushouji", "xiaomiewanjia", "biworuoxiao", "biwoqiangda"];
        // this._armatureDisplay = this.node.getChildByName("faceact").getComponent(dragonBones.ArmatureDisplay);
        // this._armature = this._armatureDisplay.armature();
        // this._armatureDisplay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this.animationEventHandler, this);

        // this._armatureDisplay.dragonAsset = this.dragonBonesAssetList[this.factActIndex];
        // this._armatureDisplay.dragonAtlasAsset =  this.dragonBonesAtlasList[this.factActIndex];

        this.resetFaceScale(this.radius);
    },
    playerFaceAct(actName, playTimes) {
        cc.log("actName", actName);
        var faceIndex = 1;
        if ("kongxianshi" == actName) {
            faceIndex = 4;
        }
        if ("lianxushouji" == actName) {
            faceIndex = 5;
        }
        if ("xiaomiewanjia" == actName) {
            faceIndex = 3;
        }
        if ("biworuoxiao" == actName) {
            faceIndex = 1;
        }
        if ("biwoqiangda" == actName) {
            faceIndex = 2;
        }
        cc.loader.loadRes("staticFace/b" + (this.factActIndex + 1) + "/" + faceIndex + ".png", 'png', (err, texture) => {
            cc.log(err);
            var spriteFromNet = this.node.getChildByName("faceact").getComponent(cc.Sprite);
            spriteFromNet.spriteFrame = new cc.SpriteFrame(texture);
            // spriteFromNet.scale = 1.6;
        })
    },
    resetFaceScale(radius) {
        var facingScale = 1;
        facingScale = radius / 130;
        this.node.getChildByName("faceact").scale = facingScale;
    },
    animationEventHandler(event) {
        if (event.type == dragonBones.EventObject.FADE_IN_COMPLETE) {
            // cc.log(event.animationState.name + ' fade in complete');
        } else if (event.type == dragonBones.EventObject.FADE_OUT_COMPLETE) {
            // cc.log(event.animationState.name + ' fade out complete');
        }
    },
    start() {
        // function test 
        // var arr = [1,2,3,4,5];
        // var ele = this.getArrayElementByOffset(arr,0,-1);
        // cc.log('ele',ele);

        // var objArr = [
        //     {
        //         a:1,
        //     },
        //     {
        //         a:2,
        //     }
        // ];
        // var temp = objArr[0];
        // cc.log('temp.a,objArr[0].a',temp.a,objArr[0].a);
        // temp.a = 10;
        // cc.log('temp.a,objArr[0].a',temp.a,objArr[0].a);
    },
    onDestroy() {
        cc.log('this.InstanceID on destory,means GAME IS OVER', this.InstanceID);
    },
    resetFaceState() {
        this.isMerge = false;
        this.isThreaten = false;
        this.isStrength = false;
        this.isDeyi = false;
    },
    faceActCheck() {
        if (this.amimatePlayTimeCounter > 0) {
            return;
        }
        var actName = this.faceActName[0];
        var amimatePlayTime = -1;
        // 消灭了别的玩家
        if (this.isMerge) {
            actName = this.faceActName[2];
            amimatePlayTime = 1;
        }
        // 有比我强大的玩家在附近
        if (this.isThreaten) {
            actName = this.faceActName[4];
        }
        // 有比我弱小的玩家在附近
        if (this.isStrength) {
            actName = this.faceActName[3];
        }
        // 收集到了一定数量的水滴
        if (this.isDeyi) {
            actName = this.faceActName[1];
            amimatePlayTime = 1;
        }
        if (actName != this.currentActName) {
            this.playerFaceAct(actName, -1);
            if (amimatePlayTime > 0) {
                this.amimatePlayTimeCounter = amimatePlayTime;
            }
            this.currentActName = actName
        }
    },
    update(dt) {
        this.resetFaceState();

        // 普通水滴 融合检测
        var allBlobNodeList = this.getAllCommonWaterDrop(9999);
        for (var i = 0; i < allBlobNodeList.length; i++) {
            var anCheckBlobJS = allBlobNodeList[i].getComponent('CommonWaterDrop');
            // //检测半径是否重叠
            // var distanceWithTwoNode = anCheckBlobJS.node.position.sub(this.node.position).mag();
            // if(distanceWithTwoNode <= this.radius + anCheckBlobJS.radius){
            //     if(true){
            //         if(anCheckBlobJS.nodes.length > 0 && anCheckBlobJS.canntSplitTime <= 0){
            //             this.merge(anCheckBlobJS);
            //         }
            //     }
            // }

            // 检测每个nodes是不是落在了待检查的blob内
            var isCollided = false;
            for (var j = 0; j < this.nodes.length; j++) {
                var vectAInWorld = this.node.getChildByName("waterdrop").convertToWorldSpaceAR(this.nodes[j].pos);
                var vectBInWorld = anCheckBlobJS.node.parent.convertToWorldSpaceAR(anCheckBlobJS.node.position);
                var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
                if (tempDistance < anCheckBlobJS.radius * 0.9) {
                    if (true) {
                        if (anCheckBlobJS.nodes.length > 0 && anCheckBlobJS.canntSplitTime <= 0) {
                            this.merge(anCheckBlobJS);
                            isCollided = true;
                            break;
                        }
                    }
                }
            }
            if (isCollided == false) {
                for (var k = 0; k < anCheckBlobJS.nodes.length; k++) {
                    var vectAInWorld = anCheckBlobJS.node.getChildByName("waterdrop").convertToWorldSpaceAR(anCheckBlobJS.nodes[k].pos);
                    var vectBInWorld = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
                    if (tempDistance < this.radius * 0.9) {
                        if (true) {
                            if (anCheckBlobJS.nodes.length > 0 && anCheckBlobJS.canntSplitTime <= 0) {
                                this.merge(anCheckBlobJS);
                                break;
                            }
                        }
                    }
                }
            }
        }
        // 其他AI玩家 融合检测
        var allOtherPlayerNodeList = this.getAllOtherPlayerDrop(9999);
        for (var i = 0; i < allOtherPlayerNodeList.length; i++) {
            var anCheckBlobJS = allOtherPlayerNodeList[i].getComponent('PlayerAI');
            // //检测半径是否重叠
            // var distanceWithTwoNode = anCheckBlobJS.node.position.sub(this.node.position).mag();
            // if(distanceWithTwoNode <= this.radius + anCheckBlobJS.radius){
            //     if(this.radius > anCheckBlobJS.radius){
            //         if(anCheckBlobJS.nodes.length > 0){
            //             this.merge(anCheckBlobJS);
            //         }
            //     }
            // }

            // 害怕或者强势或者不屑检测
            var distanceWithTwoNode = anCheckBlobJS.node.position.sub(this.node.position).mag();
            var currentCheckRadius = 0;
            if (distanceWithTwoNode <= this.radius + anCheckBlobJS.radius + 150) {
                if (currentCheckRadius < anCheckBlobJS.radius) {
                    currentCheckRadius = anCheckBlobJS.radius;
                    // 相距不到100像素
                    if (this.radius > anCheckBlobJS.radius) {
                        // 我比另一个玩家强
                        this.isThreaten = false;
                        this.isStrength = true;
                    } else {
                        // 我比另一个玩家弱
                        this.isThreaten = true;
                        this.isStrength = false;
                    }
                }
            }

            // 检测每个nodes是不是落在了待检查的blob内
            var isCollided = false;
            for (var j = 0; j < this.nodes.length; j++) {
                var vectAInWorld = this.node.getChildByName("waterdrop").convertToWorldSpaceAR(this.nodes[j].pos);
                var vectBInWorld = anCheckBlobJS.node.parent.convertToWorldSpaceAR(anCheckBlobJS.node.position);
                var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
                if (tempDistance < anCheckBlobJS.radius * 0.9) {
                    if (anCheckBlobJS.radius < this.radius) {
                        if (anCheckBlobJS.nodes.length > 0 && anCheckBlobJS.canntSplitTime <= 0) {
                            this.merge(anCheckBlobJS);
                            this.isMerge = true;
                            isCollided = true;
                            EventCenter.dispatchEvent(EventCenter.EventType.Someone_Be_Defeaded, {
                                winerName: this.playerName,
                                loseName: anCheckBlobJS.playerName,
                                winnerName: this.playerName,
                                loseScore: anCheckBlobJS.collectedWaterDropScore,
                                loseColorStyleIndex: anCheckBlobJS.PreferGraphicsStyle,
                                losePlayerNodeJS: anCheckBlobJS,
                                isMainPlayer: false,
                            });
                            break;
                        }
                    }
                }
            }
            if (isCollided == false) {
                for (var k = 0; k < anCheckBlobJS.nodes.length; k++) {
                    var vectAInWorld = anCheckBlobJS.node.getChildByName("waterdrop").convertToWorldSpaceAR(anCheckBlobJS.nodes[k].pos);
                    var vectBInWorld = this.node.parent.convertToWorldSpaceAR(this.node.position);
                    var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
                    if (tempDistance < this.radius * 0.9) {
                        if (anCheckBlobJS.radius < this.radius) {
                            if (anCheckBlobJS.nodes.length > 0 && anCheckBlobJS.canntSplitTime <= 0) {
                                this.merge(anCheckBlobJS);
                                this.isMerge = true;
                                EventCenter.dispatchEvent(EventCenter.EventType.Someone_Be_Defeaded, {
                                    winerName: this.playerName,
                                    loseName: anCheckBlobJS.playerName,
                                    winnerName: this.playerName,
                                    loseScore: anCheckBlobJS.collectedWaterDropScore,
                                    loseColorStyleIndex: anCheckBlobJS.PreferGraphicsStyle,
                                    losePlayerNodeJS: anCheckBlobJS,
                                    isMainPlayer: false,
                                });
                                break;
                            }
                        }
                    }
                }
            }
        }
        // 分离检测
        if (this.vVelocity.mag() > 300 && this.canntSplitTime <= 0) {
            // this.split();
        }
        if (this.canntSplitTime > 0) {
            this.canntSplitTime -= dt;
        } else {
            this.canntSplitTime = 0;
        }
        if (this.amimatePlayTimeCounter > 0) {
            this.amimatePlayTimeCounter -= dt;
        } else {
            this.amimatePlayTimeCounter = -1;
        }

        // 运动计算
        this.vStreeingForce = cc.Vec2.ZERO;
        if (this.JoystickJS != null) {
            this.vStreeingForce = this.JoystickJS.GetForce();
        }
        this.vStreeingForce = TruncateByVec2Mag(this.MaxForce, this.vStreeingForce);

        // 加速度
        var acc = this.vStreeingForce;
        // cc.log("acc",acc.toString());
        this.vVelocity = acc.normalize().mul(this.MaxSpeed);
        this.vVelocity = TruncateByVec2Mag(this.MaxSpeed, this.vVelocity);

        // 计算位移
        var posOffset = this.vVelocity.mul(dt);
        var posNow = this.node.position;
        var posNext = posNow.add(posOffset);
        this.node.position = posNext;
        this.vHeading = cc.Vec2.UP.rotate(this.vVelocity);

        this.dragForceNodeIndex = -1;
        if (this.vVelocity.mag() > 10) {
            if (this.dragForceNodeIndex != -1) {
                var negVelocity = this.vVelocity.neg().normalize();
                var smallestDegree = 180;
                for (var i = 0; i < this.nodes.length; i++) {
                    var nodeData = this.nodes[i];
                    var nodeVec = nodeData.pos.normalize();
                    var temp = nodeVec.dot(negVelocity);
                    var tempDegree = Math.acos(temp) / Math.PI * 180;
                    if (tempDegree < smallestDegree) {
                        smallestDegree = tempDegree;
                        this.dragForceNodeIndex = i;
                    }
                }
            } else {
                var negVelocity = this.vVelocity.neg().normalize();
                var smallestDegree = 180;
                for (var i = 0; i < this.nodes.length; i++) {
                    var nodeData = this.nodes[i];
                    var nodeVec = nodeData.pos.normalize();
                    var temp = nodeVec.dot(negVelocity);
                    var tempDegree = Math.acos(temp) / Math.PI * 180;
                    if (tempDegree < smallestDegree) {
                        smallestDegree = tempDegree;
                        this.dragForceNodeIndex = i;
                    }
                }
            }
        }
        this.wrapWinSize();
        this.updateBlob();

        this.faceActCheck();
    },
    wrapWinSize() {
        if (this.node.x > this.bgNode.width / 2 - this.radius / 2) {
            this.node.x = this.bgNode.width / 2 - this.radius / 2;
            this.vVelocity.x = 0;
        }
        if (this.node.x < -this.bgNode.width / 2 + this.radius / 2) {
            this.node.x = -this.bgNode.width / 2 + this.radius / 2;
            this.vVelocity.x = 0;
        }
        if (this.node.y > this.bgNode.height / 2 - this.radius / 2) {
            this.node.y = this.bgNode.height / 2 - this.radius / 2;
            this.vVelocity.y = 0;
        }
        if (this.node.y < -this.bgNode.height / 2 + this.radius / 2) {
            this.node.y = -this.bgNode.height / 2 + this.radius / 2;
            this.vVelocity.y = 0;
        }
    },
    initNodes() {
        this.nodes = [];
        for (var i = 0; i < this.quality; i++) {
            var node = {
                normal: cc.Vec2.ZERO,
                normalTarget: cc.Vec2.ZERO,
                ghost: cc.Vec2.ZERO,
                pos: cc.Vec2.ZERO,
                joints: [],
                angle: 0,
            }
            this.nodes.push(node);
        }
        this.updateJoints();
        this.updateNormals();
    },
    updateJoints() {
        this.strength = 0.4;
        for (var i = 0; i < this.quality; i++) {
            var nodeData = this.nodes[i];
            nodeData.joints = [];
            nodeData.joints.push({
                node: this.getArrayElementByOffset(this.nodes, i, -1),
                strength: this.strength,
                strain: cc.Vec2.ZERO,
            });
            nodeData.joints.push({
                node: this.getArrayElementByOffset(this.nodes, i, 1),
                strength: this.strength,
                strain: cc.Vec2.ZERO,
            });
            if (this.quality > 4) {
                nodeData.joints.push({
                    node: this.getArrayElementByOffset(this.nodes, i, -2),
                    strength: this.strength,
                    strain: cc.Vec2.ZERO,
                });
                nodeData.joints.push({
                    node: this.getArrayElementByOffset(this.nodes, i, 2),
                    strength: this.strength,
                    strain: cc.Vec2.ZERO,
                });
            }
            if (this.quality > 8) {
                nodeData.joints.push({
                    node: this.getArrayElementByOffset(this.nodes, i, -3),
                    strength: this.strength,
                    strain: cc.Vec2.ZERO,
                });
                nodeData.joints.push({
                    node: this.getArrayElementByOffset(this.nodes, i, 3),
                    strength: this.strength,
                    strain: cc.Vec2.ZERO,
                });
            }
        }
    },
    updateNormals() {
        for (var i = 0; i < this.quality; i++) {
            var nodeData = this.nodes[i];
            var newIndex = i;
            if (this.dragForceNodeIndex != -1) {
                newIndex = i - Math.round(this.dragForceNodeIndex);
                newIndex = newIndex < 0 ? this.quality + newIndex : newIndex;
            } else {
                newIndex = i;
            }
            nodeData.angle = newIndex / this.quality * Math.PI * 2 + this.targetRotation;
            nodeData.normalTarget.x = Math.cos(nodeData.angle) * this.radius;
            nodeData.normalTarget.y = Math.sin(nodeData.angle) * this.radius;
            if (nodeData.normal.x === 0 && nodeData.normal.y === 0) {
                nodeData.normal.x = nodeData.normalTarget.x;
                nodeData.normal.y = nodeData.normalTarget.y;
                nodeData.pos.x = nodeData.normalTarget.x;
                nodeData.pos.y = nodeData.normalTarget.y;
                nodeData.ghost.x = nodeData.normalTarget.x;
                nodeData.ghost.y = nodeData.normalTarget.y;
            }
        }
    },
    updateBlob() {
        var currentGraphicsStyle = graphicsStyle[9];
        if (this.isDebug) {
            currentGraphicsStyle = graphicsStyle[10];
        } else {
            if (this.PreferGraphicsStyle >= 0 && this.PreferGraphicsStyle <= 9) {
                currentGraphicsStyle = graphicsStyle[this.PreferGraphicsStyle];
            } else {
                this.PreferGraphicsStyle = 9;
            }
        }
        this.graphics.clear();

        if (this.nodes.length < 3) {
            return;
        }
        // 提前设置了绘图的样式
        if (!currentGraphicsStyle.debug) {
            this.graphics.strokeColor = currentGraphicsStyle.strokeStyle;
            this.graphics.fillColor = currentGraphicsStyle.fillStyle;
            this.graphics.lineWidth = currentGraphicsStyle.lineWidth;
        }
        // 将上一帧的节点位置保存
        for (var i = 0; i < this.nodes.length; i++) {
            var nodeData = this.nodes[i];
            nodeData.ghost.x = nodeData.pos.x;
            nodeData.ghost.y = nodeData.pos.y;
        }
        // 如果有施力点则变换旋转角度
        if (this.nodes[this.dragForceNodeIndex]) {
            // var negVelocity = this.vVelocity.neg().normalize();
            // this.targetRotation = Math.atan2(negVelocity.y,negVelocity.x);
            this.targetRotation = cc.Vec2.RIGHT.signAngle(this.vVelocity.neg());
            // this.node.getChildByName("waterdrop").angle = (this.targetRotation - this.node.getChildByName("waterdrop").angle);
            this.node.getChildByName("waterdrop").angle += (this.targetRotation - this.node.getChildByName("waterdrop").angle) * 0.2;
            this.updateNormals();
        }
        // 重新计算节点位置
        for (var i = 0; i < this.nodes.length; i++) {
            var nodeData = this.nodes[i];
            nodeData.normal.x += (nodeData.normalTarget.x - nodeData.normal.x) * 0.05;
            nodeData.normal.y += (nodeData.normalTarget.y - nodeData.normal.y) * 0.05;
            var newNodePos = cc.Vec2.ZERO;
            for (var j = 0; j < nodeData.joints.length; j++) {
                var jointsData = nodeData.joints[j];
                var transY = jointsData.node.ghost.y - nodeData.ghost.y - (jointsData.node.normal.y - nodeData.normal.y);
                var transX = jointsData.node.ghost.x - nodeData.ghost.x - (jointsData.node.normal.x - nodeData.normal.x);
                jointsData.strain.x += (transX - jointsData.strain.x) * 0.3;
                jointsData.strain.y += (transY - jointsData.strain.y) * 0.3;
                newNodePos.x += jointsData.strain.x * jointsData.strength;
                newNodePos.y += jointsData.strain.y * jointsData.strength;
            }
            newNodePos.x += nodeData.normal.x;
            newNodePos.y += nodeData.normal.y;
            // 重新计算节点时加入施力点的影响
            var beforeDragIndex = this.getArrayIndexByOffset(this.nodes, this.dragForceNodeIndex, -1);
            var afterDragIndex = this.getArrayIndexByOffset(this.nodes, this.dragForceNodeIndex, 1);
            if (this.dragForceNodeIndex != -1 && (i == this.dragForceNodeIndex || this.nodes.length >= 8 && (i == beforeDragIndex || i == afterDragIndex))) {
                var ratio = i == this.dragForceNodeIndex ? 0.7 : 0.5;
                var times = MapNum(this.vVelocity.mag(), 0, this.MaxSpeed, 0, this.radius * 1.5);
                var negVelocity = this.vVelocity.neg().normalize().mul(times);
                newNodePos.x += (negVelocity.x - newNodePos.x) * ratio;
                newNodePos.y += (negVelocity.y - newNodePos.y) * ratio;
            }
            nodeData.pos.x += (newNodePos.x - nodeData.pos.x) * 0.08;
            nodeData.pos.y += (newNodePos.y - nodeData.pos.y) * 0.08;
        }
        // 绘制节点结果
        var lastNode = this.getArrayElementByOffset(this.nodes, 0, -1);
        var firstNode = this.getArrayElementByOffset(this.nodes, 0, 0);
        this.graphics.moveTo(lastNode.pos.x + (firstNode.pos.x - lastNode.pos.x) / 2, lastNode.pos.y + (firstNode.pos.y - lastNode.pos.y) / 2);
        for (var i = 0; i < this.nodes.length; i++) {
            lastNode = this.getArrayElementByOffset(this.nodes, i, 0);
            firstNode = this.getArrayElementByOffset(this.nodes, i, 1);
            if (currentGraphicsStyle.debug) {
                for (var j = 0; j < lastNode.joints.length; j++) {
                    var jointNode = lastNode.joints[j];
                    this.graphics.strokeColor = cc.Color.WHITE;
                    this.graphics.moveTo(lastNode.pos.x, lastNode.pos.y);
                    this.graphics.lineTo(jointNode.node.pos.x, jointNode.node.pos.y);
                    this.graphics.stroke();
                }
                if (i == this.dragForceNodeIndex) {
                    this.graphics.strokeColor = cc.Color.GREEN;
                } else {
                    this.graphics.strokeColor = cc.Color.WHITE;
                }
                this.graphics.circle(lastNode.pos.x, lastNode.pos.y, 5);
                this.graphics.stroke();
            } else {
                this.graphics.quadraticCurveTo(lastNode.pos.x, lastNode.pos.y, lastNode.pos.x + (firstNode.pos.x - lastNode.pos.x) / 2, lastNode.pos.y + (firstNode.pos.y - lastNode.pos.y) / 2);
                this.graphics.stroke();
                this.graphics.fill();
            }
        }
    },
    merge(nodeTomergeJS) {
        this.vVelocity = this.vVelocity.mul(0.5);
        this.vVelocity.x += nodeTomergeJS.vVelocity.x * 0.5;
        this.vVelocity.y += nodeTomergeJS.vVelocity.y * 0.5;

        var nestestNodeIndexOnThisNode = null;
        var nestestdistanceOnThis = 9999;
        for (var i = 0; i < this.nodes.length; i++) {
            var vectAInWorld = this.node.getChildByName("waterdrop").convertToWorldSpaceAR(this.nodes[i].pos);
            var vectBInWorld = nodeTomergeJS.node.parent.convertToWorldSpaceAR(nodeTomergeJS.node.position);
            var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
            if (tempDistance < nestestdistanceOnThis) {
                nestestdistanceOnThis = tempDistance;
                nestestNodeIndexOnThisNode = i;
            }
        }
        var nearestDragNode = this.getArrayElementByOffset(this.nodes, nestestNodeIndexOnThisNode, 0);
        nearestDragNode.pos = nearestDragNode.pos.add(nearestDragNode.pos.normalize().mul(nodeTomergeJS.radius * 2));

        // while(nodeTomergeJS.nodes.length > 0){
        // this.nodes.push(nodeTomergeJS.nodes.shift());
        // nodeTomergeJS.nodes.shift();
        // cc.log('nodeTomergeJS.nodes.length',nodeTomergeJS.nodes.length);
        // }
        // this.quality = this.nodes.length;
        if (this.radius > 20 && this.radius < 60) {
            this.radius += nodeTomergeJS.radius / 4;
        } else if (this.radius > 60 && this.radius < 100) {
            this.radius += nodeTomergeJS.radius / 8;
        } else if (this.radius > 100 && this.radius < 140) {
            this.radius += nodeTomergeJS.radius / 16;
        } else if (this.radius > 140 && this.radius < 180) {
            this.radius += nodeTomergeJS.radius / 32;
        } else {
            this.radius += nodeTomergeJS.radius / 64;
        }
        this.resetFaceScale(this.radius);
        // this.dragForceNodeIndex = nodeTomergeJS.dragForceNodeIndex==-1?nodeTomergeJS.dragForceNodeIndex:this.dragForceNodeIndex;
        this.updateNormals();
        this.updateJoints();
        this.collectedWaterDropScore += 1;
        EventCenter.dispatchEvent(EventCenter.EventType.Water_Drop_Added, this.collectedWaterDropScore);
        nodeTomergeJS.Killed();

        if (this.collectedWaterDropScore % 3 == 0) {
            this.isDeyi = true;
        }
        this.playMergeAudio();
    },
    playMergeAudio() {
        if (cc.find("AudioManager") != null) {
            cc.find("AudioManager").getComponent("AudioManager")._playMergeClip_();
        }
    },
    Killed() {
        this.node.destroy();
        this.node.removeFromParent();
    },
    split() {
        var leftLeftNode = this.getArrayElementByOffset(this.nodes, 0, -2);
        var midNode = this.getArrayElementByOffset(this.nodes, 0, 0);
        var rightrightNode = this.getArrayElementByOffset(this.nodes, 0, 2);
        this.getArrayElementByOffset(this.nodes, 0, 0).pos = midNode.pos.mul(0.1);
        this.getArrayElementByOffset(this.nodes, 0, -1).pos = leftLeftNode.pos.mul(0.5);
        this.getArrayElementByOffset(this.nodes, 0, 1).pos = rightrightNode.pos.mul(0.5);
        this.radius = this.radius * 0.5;
        this.dragForceNodeIndex = -1;
        this.updateJoints();
        this.updateNormals();
        this.canntSplitTime = 3;

        var newWaterDropNode = cc.instantiate(this.waterDropPrefab);
        var newWaterDropNodeJS = newWaterDropNode.getComponent('CommonWaterDrop');
        newWaterDropNodeJS.radius = this.radius;
        newWaterDropNodeJS.canntSplitTime = 3;
        newWaterDropNodeJS.dragForceNodeIndex = -1;

        newWaterDropNodeJS.nodes = [];
        for (var i = 0; i < this.nodes.length; i++) {
            var node = {
                normal: cc.Vec2.ZERO,
                normalTarget: cc.Vec2.ZERO,
                ghost: cc.Vec2.ZERO,
                pos: new cc.Vec2(this.nodes[i].pos.x, this.nodes[i].pos.y),
                joints: [],
                angle: 0,
            }
            newWaterDropNodeJS.nodes.push(node);
        }
        newWaterDropNodeJS.nodes[3].pos = newWaterDropNodeJS.nodes[3].pos.mul(0.5);
        newWaterDropNodeJS.nodes[4].pos = newWaterDropNodeJS.nodes[4].pos.mul(0.1);
        newWaterDropNodeJS.nodes[5].pos = newWaterDropNodeJS.nodes[5].pos.mul(0.5);
        newWaterDropNodeJS.updateJoints();
        newWaterDropNodeJS.updateNormals();

        newWaterDropNode.parent = this.commonWaterDropContainer;
        newWaterDropNode.position = this.node.position
        newWaterDropNode.active = true;


    },
    getAllCommonWaterDrop(radius) {
        if (this.commonWaterDropContainer == null) {
            return [];
        }
        var allNodeInCanvas = this.commonWaterDropContainer.children;
        var playerList = [];
        for (var i = 0; i < allNodeInCanvas.length; i++) {
            if (allNodeInCanvas[i].getComponent('CommonWaterDrop') !== null) {
                if (allNodeInCanvas[i].getComponent('CommonWaterDrop').InstanceID !== this.InstanceID) {
                    if (allNodeInCanvas[i].position.sub(this.node.position).mag() <= radius) {
                        playerList.push(allNodeInCanvas[i]);
                    }
                }
            }
        }
        return playerList;
    },
    getAllOtherPlayerDrop(radius) {
        if (this.PlayerAIContainer == null) {
            return [];
        }
        var allNodeInCanvas = this.PlayerAIContainer.children;
        var playerList = [];
        for (var i = 0; i < allNodeInCanvas.length; i++) {
            if (allNodeInCanvas[i].getComponent('PlayerAI') !== null) {
                if (allNodeInCanvas[i].getComponent('PlayerAI').InstanceID !== this.InstanceID) {
                    if (allNodeInCanvas[i].position.sub(this.node.position).mag() <= radius) {
                        playerList.push(allNodeInCanvas[i]);
                    }
                }
            }
        }
        return playerList;
    },
    getArrayElementByOffset(arr, startIndex, offset) {
        return arr[this.getArrayIndexByOffset(arr, startIndex, offset)]
    },
    getArrayIndexByOffset(arr, startIndex, offset) {
        if (arr[startIndex + offset]) return startIndex + offset;
        if (startIndex + offset > arr.length - 1) return startIndex - arr.length + offset;
        if (startIndex + offset < 0) return arr.length + (startIndex + offset);
    }
});
