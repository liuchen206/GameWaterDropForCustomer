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
        vStreeingForce:{
            default: cc.Vec2.ZERO,
            tooltip: '施加的动力',
        },
        MaxForce:{
            default: 750,
            tooltip: '最大施加力',
        },
        MaxSpeed:{
            default: 250,
            tooltip: '最大速度(秒/像素)',
        },
        FrictionForce:{
            default: 5,
            tooltip: '摩擦系数',
        },
        isDebug:false,
        // blob数据
        quality:{
            default:8,// 节点密度
        },
        nodes :{
            default:[], // 节点数组
        },
        radius: {
            default:80, // 半径
        },
        targetRotation:{
            default:0, // 期望的旋转角
        },
        dragForceNodeIndex:{
            default:-1, // 施加力的节点下标
        },
        canntSplitTime:{
            default:0, // 禁止再次分离倒计时
        },
        commonWaterDropPrefab:{
            default:null,
            type:cc.Prefab,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.graphics = this.node.getChildByName("waterdrop").getComponent(cc.Graphics);
        this.gameManagerJS = cc.find("Canvas/GameManager").getComponent("GameManager");
        this.InstanceID = PlayerInstanceIdManager.GetAnNewID();
        this.bgNode = cc.find("Canvas/GameView");
        this.commonWaterDropContainer = cc.find('Canvas/GameView/GameWorld/CommonWaterDropContainer');
        this.vHeading = cc.Vec2.UP;

        // this.quality = 16;
        this.SteeringBehaviorsJS = this.node.getComponent('StreeBehavForComDrop');

        if(this.nodes.length <= 0){
            this.initNodes();
        }
    },
    start () {
        this.updateBlob();
    },
    onDestroy(){
        // cc.log('this.InstanceID on destory',this.InstanceID);
    },
    update (dt) {
},
    wrapWinSize(){
        if(this.node.x > this.bgNode.width/2 - this.radius/2){
            this.node.x = this.bgNode.width/2 - this.radius/2;
        }
        if(this.node.x < -this.bgNode.width/2 + this.radius/2){
            this.node.x = -this.bgNode.width/2 + this.radius/2;
        }
        if(this.node.y > this.bgNode.height/2 - this.radius/2){
            this.node.y = this.bgNode.height/2 - this.radius/2;
        }
        if(this.node.y < -this.bgNode.height/2 + this.radius/2){
            this.node.y = -this.bgNode.height/2 + this.radius/2;
        }
    },
    initNodes(){
        this.nodes = [];
        for(var i = 0;i<this.quality;i++){
            var node = {
                normal: cc.Vec2.ZERO,
                normalTarget: cc.Vec2.ZERO,
                ghost: cc.Vec2.ZERO,
                pos: cc.Vec2.ZERO,
                joints:[],
                angle:0,
            }
            this.nodes.push(node);
        }
        this.updateJoints();
        this.updateNormals();
    },
    updateJoints(){
        this.strength = 0.4;
        for(var i =0;i<this.quality;i++){
            var nodeData = this.nodes[i];
            nodeData.joints = [];
            nodeData.joints.push({
                node:this.getArrayElementByOffset(this.nodes,i,-1),
                strength:this.strength,
                strain: cc.Vec2.ZERO,
            });
            nodeData.joints.push({
                node:this.getArrayElementByOffset(this.nodes,i,1),
                strength:this.strength,
                strain: cc.Vec2.ZERO,
            });
            if(this.quality > 4){
                nodeData.joints.push({
                    node:this.getArrayElementByOffset(this.nodes,i,-2),
                    strength:this.strength,
                    strain: cc.Vec2.ZERO,
                });
                nodeData.joints.push({
                    node:this.getArrayElementByOffset(this.nodes,i,2),
                    strength:this.strength,
                    strain: cc.Vec2.ZERO,
                }); 
            }
            if(this.quality > 8){
                nodeData.joints.push({
                    node:this.getArrayElementByOffset(this.nodes,i,-3),
                    strength:this.strength,
                    strain: cc.Vec2.ZERO,
                });
                nodeData.joints.push({
                    node:this.getArrayElementByOffset(this.nodes,i,3),
                    strength:this.strength,
                    strain: cc.Vec2.ZERO,
                }); 
            }
        }
    },
    updateNormals(){ 
        for(var i = 0; i< this.quality;i++){
            var nodeData = this.nodes[i];
            var newIndex = i;
            if(this.dragForceNodeIndex != -1){
                newIndex = i - Math.round(this.dragForceNodeIndex);
                newIndex = newIndex<0?this.quality+newIndex:newIndex;
            }else{
                newIndex = i;
            }
            nodeData.angle = newIndex/this.quality*Math.PI*2 + this.targetRotation;
            nodeData.normalTarget.x = Math.cos(nodeData.angle)*this.radius;
            nodeData.normalTarget.y = Math.sin(nodeData.angle)*this.radius;
            if(nodeData.normal.x === 0 && nodeData.normal.y === 0){
                nodeData.normal.x = nodeData.normalTarget.x;
                nodeData.normal.y = nodeData.normalTarget.y;
                nodeData.pos.x = nodeData.normalTarget.x;
                nodeData.pos.y = nodeData.normalTarget.y;
                nodeData.ghost.x = nodeData.normalTarget.x;
                nodeData.ghost.y = nodeData.normalTarget.y;
            }
        }
    },
    updateBlob(){
        var currentGraphicsStyle = graphicsStyle[4];
        if(this.isDebug){
            currentGraphicsStyle = graphicsStyle[10];
        }else{
            if(this.PreferGraphicsStyle >= 0 && this.PreferGraphicsStyle <= 9){
                currentGraphicsStyle = graphicsStyle[this.PreferGraphicsStyle];
            }
        }
        this.graphics.clear();

        if(this.nodes.length < 3){
            return;
        }
        // 提前设置了绘图的样式
        if(!currentGraphicsStyle.debug){
            this.graphics.strokeColor = currentGraphicsStyle.strokeStyle;
            this.graphics.fillColor = currentGraphicsStyle.fillStyle;
            this.graphics.lineWidth = currentGraphicsStyle.lineWidth;
        }
        // 绘制节点结果
        var lastNode = this.getArrayElementByOffset(this.nodes,0,-1);
        var firstNode = this.getArrayElementByOffset(this.nodes,0,0);
        this.graphics.moveTo(lastNode.pos.x + (firstNode.pos.x-lastNode.pos.x)/2,lastNode.pos.y + (firstNode.pos.y-lastNode.pos.y)/2);
        for(var i =0;i<this.nodes.length;i++){
            lastNode = this.getArrayElementByOffset(this.nodes,i,0);
            firstNode = this.getArrayElementByOffset(this.nodes,i,1);
            if(currentGraphicsStyle.debug){
                for(var j = 0; j<lastNode.joints.length;j++){
                    var jointNode = lastNode.joints[j];
                    this.graphics.strokeColor = cc.Color.WHITE;
                    this.graphics.moveTo(lastNode.pos.x,lastNode.pos.y);
                    this.graphics.lineTo(jointNode.node.pos.x,jointNode.node.pos.y);
                    this.graphics.stroke();
                }
                if(i == this.dragForceNodeIndex){
                    this.graphics.strokeColor = cc.Color.GREEN;
                }else{
                    this.graphics.strokeColor = cc.Color.WHITE;
                }
                this.graphics.circle(lastNode.pos.x,lastNode.pos.y,5);
                this.graphics.stroke();
            }else{
                this.graphics.quadraticCurveTo(lastNode.pos.x, lastNode.pos.y, lastNode.pos.x + (firstNode.pos.x - lastNode.pos.x) / 2, lastNode.pos.y + (firstNode.pos.y - lastNode.pos.y) / 2);
                this.graphics.stroke();
                this.graphics.fill();
            }
        }
    },
    merge(nodeToMerge){
        this.vVelocity = this.vVelocity.mul(0.5);
        var nodeTomergeJS = nodeToMerge.getComponent('CommonWaterDrop');
        this.vVelocity.x += nodeTomergeJS.vVelocity.x*0.5;
        this.vVelocity.y += nodeTomergeJS.vVelocity.y*0.5;
        
        var nestestNodeIndexOnThisNode = null;
        var nestestdistanceOnThis = 9999;
        for(var i= 0;i < this.nodes.length;i++){
            var vectAInWorld = this.node.getChildByName("waterdrop").convertToWorldSpaceAR(this.nodes[i].pos);
            var vectBInWorld = nodeTomergeJS.node.parent.convertToWorldSpaceAR(nodeTomergeJS.node.position);
            var tempDistance = vectAInWorld.sub(vectBInWorld).mag();
            if(tempDistance < nestestdistanceOnThis){
                nestestdistanceOnThis = tempDistance;
                nestestNodeIndexOnThisNode = i;
            }
        }
        var nearestDragNode = this.getArrayElementByOffset(this.nodes,nestestNodeIndexOnThisNode,0);
        nearestDragNode.pos = nearestDragNode.pos.add(nearestDragNode.pos.normalize().mul(nodeTomergeJS.radius*2));

        // while(nodeTomergeJS.nodes.length > 0){
            // this.nodes.push(nodeTomergeJS.nodes.shift());
            // nodeTomergeJS.nodes.shift();
            // cc.log('nodeTomergeJS.nodes.length',nodeTomergeJS.nodes.length);
        // }
        // this.quality = this.nodes.length;
        if(this.radius>20&&this.radius<60){
            this.radius += nodeTomergeJS.radius/4;
        }else if(this.radius>60&&this.radius<100){
            this.radius += nodeTomergeJS.radius/8;
        }else if(this.radius>100&&this.radius<140){
            this.radius += nodeTomergeJS.radius/16;
        }else if(this.radius>140&&this.radius<180){
            this.radius += nodeTomergeJS.radius/32;
        }else{
            this.radius += nodeTomergeJS.radius/64;
        }
        // this.dragForceNodeIndex = nodeTomergeJS.dragForceNodeIndex==-1?nodeTomergeJS.dragForceNodeIndex:this.dragForceNodeIndex;
        this.updateNormals();
        this.updateJoints();
        nodeTomergeJS.Killed();
    },
    Killed(){
        this.gameManagerJS.commonWaterDropPool.put(this.node);
    },
    split(){
        var leftLeftNode = this.getArrayElementByOffset(this.nodes,0,-2);
        var midNode = this.getArrayElementByOffset(this.nodes,0,0);
        var rightrightNode = this.getArrayElementByOffset(this.nodes,0,2);
        this.getArrayElementByOffset(this.nodes,0,0).pos = midNode.pos.mul(0.1);
        this.getArrayElementByOffset(this.nodes,0,-1).pos = leftLeftNode.pos.mul(0.5);
        this.getArrayElementByOffset(this.nodes,0,1).pos = rightrightNode.pos.mul(0.5);
        this.radius = this.radius*0.5;
        this.dragForceNodeIndex = -1;
        this.updateJoints();
        this.updateNormals();
        this.canntSplitTime = 3;



        var newWaterDropNode = cc.instantiate(this.commonWaterDropPrefab);
        var newWaterDropNodeJS = newWaterDropNode.getComponent('CommonWaterDrop');
        newWaterDropNodeJS.radius = this.radius;
        newWaterDropNodeJS.canntSplitTime = 3;
        newWaterDropNodeJS.dragForceNodeIndex = -1;

        newWaterDropNodeJS.nodes = [];
        for(var i = 0;i<this.nodes.length;i++){
            var node = {
                normal: cc.Vec2.ZERO,
                normalTarget: cc.Vec2.ZERO,
                ghost: cc.Vec2.ZERO,
                pos: new cc.Vec2(this.nodes[i].pos.x,this.nodes[i].pos.y),
                joints:[],
                angle:0,
            }
            newWaterDropNodeJS.nodes.push(node);
        }
        newWaterDropNodeJS.nodes[3].pos = newWaterDropNodeJS.nodes[3].pos.mul(0.5);
        newWaterDropNodeJS.nodes[4].pos = newWaterDropNodeJS.nodes[4].pos.mul(0.1);
        newWaterDropNodeJS.nodes[5].pos = newWaterDropNodeJS.nodes[5].pos.mul(0.5);
        newWaterDropNodeJS.updateJoints();
        newWaterDropNodeJS.updateNormals();

        newWaterDropNode.parent = this.node.parent;
        newWaterDropNode.position = this.node.position
        newWaterDropNode.active = true;


    },
    getAllCommonWaterDrop(radius){
        if(this.commonWaterDropContainer == null){
            return [];
        }
        var allNodeInCanvas = this.commonWaterDropContainer.children;
        var playerList = [];
        for(var i = 0;i < allNodeInCanvas.length;i++){
            if(allNodeInCanvas[i].getComponent('CommonWaterDrop') !== null){
                if(allNodeInCanvas[i].getComponent('CommonWaterDrop').InstanceID !== this.InstanceID){
                    if(allNodeInCanvas[i].position.sub(this.node.position).mag()<=radius){
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
