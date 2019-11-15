// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
var noise = require('perlin')
cc.Class({
    extends: cc.Component,

    properties: {
        pursuitTarget:cc.Node,
        evadeTarget:cc.Node,
        seekTarget:cc.Node,
        interposePlayerA:cc.Node,
        interposePlayerB:cc.Node,
        hunderPlayer:cc.Node,
        leaderTarget:cc.Node,
        offsetToLeader:cc.Vec2.ZERO,
        beSeek:false,
        beFlee:false,
        beArrive:false,
        bePursuit:false,
        beEvade:false,
        beWander:false,
        beObstacleAvoidance:false,
        beWallAvoidance:false,
        beInterpose:false,
        beHide:false,
        bePathFollow:false,
        beOffsetPursuit:false,
        beSeparation:false,
        beAlignment:false,
        beCohesion:false,
        weightSeparation:1,
        weightAlignment:1,
        weightCohesion:1,
        weightArrive:1,
        weigthPurSuit:1,
        weightEvade:1,
        weightWander:1,
        weightInterpose:1,
        weightHide:1,
        weightPathFollow:1,
        weightOffetPursuit:1,
        vSteeringForce:cc.Vec2,
        elapseTime:0,
        hideMemoryCounter:0,
        graphics:cc.Graphics,
        isShowDrawDebugGraphics:true,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.AutoPlayerJS = this.node.getComponent('PlayerAI');
    },

    start () {
        // this.perlinSeed = Math.random()*10000;
        this.randomX = Math.random();
        this.randomY = Math.random();
    },

    update (dt) {
        this.elapseTime += dt;
        if(this.hideMemoryCounter <= 0){
            this.hideMemoryCounter = 0;
        }else{
            this.hideMemoryCounter -= dt;
        }
        if(this.cohesionMemoryCounter <= 0){
            this.cohesionMemoryCounter = 0;
        }else{
            this.cohesionMemoryCounter -= dt;
        }

        if(this.isShowDrawDebugGraphics){
            this.graphics.strokeColor = cc.Color.YELLOW;
            this.graphics.circle(0,0, this.AutoPlayerJS.radiusForSearchCommonWaterDrop);
            this.graphics.stroke();        
            this.graphics.strokeColor = cc.Color.RED;
            this.graphics.circle(0,0, this.AutoPlayerJS.radiusForSearchPlayerAI);
            this.graphics.stroke();
            this.graphics.strokeColor = cc.Color.GREEN;
            this.graphics.circle(0,0, this.AutoPlayerJS.radiusForSearchPlayer);
            this.graphics.stroke();  
        }
    },
    Calculate(){
        this.graphics.clear();
        this.vSteeringForce = cc.Vec2.ZERO;
        // if(this.beWallAvoidance){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.WallAvoidance());
        // }
        // if(this.beObstacleAvoidance){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.ObstacleAvoidance());
        // }
        if(this.beEvade){
            if(this.evadeTarget != null){
                this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Evade(this.evadeTarget).mul(this.weightEvade));
            }
        }
        // if(this.beFlee){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Flee(this.AutoPlayerJS.GameWorldJS.crossHair.position));
        // }
        // if(this.beSeparation){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Separation().mul(this.weightSeparation));
        // }
        // if(this.beAlignment){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Alignment().mul(this.weightAlignment));
        // }
        // if(this.beCohesion){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Cohesion().mul(this.weightCohesion));
        // }
        if(this.beSeek){
            if(this.seekTarget != null){
                this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Seek(this.seekTarget.position));
            }
        }
        // if(this.beArrive){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Arrive(this.AutoPlayerJS.GameWorldJS.crossHair.position).mul(this.weightArrive));
        // }
        if(this.beWander){
            this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Wander().mul(this.weightWander));
        }
        if(this.bePursuit){
            if(this.pursuitTarget != null){
                this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Pursuit(this.pursuitTarget).mul(this.weigthPurSuit));
            }
        }
        // if(this.beOffsetPursuit){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.OffsetPursuit(this.leaderTarget.getComponent('AutoPlayer')).mul(this.weightOffetPursuit));
        // }
        // if(this.beInterpose){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Interpose(this.interposePlayerB.getComponent('AutoPlayer'),this.interposePlayerA.getComponent('AutoPlayer')).mul(this.weightInterpose));
        // }
        // if(this.beHide){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.Hide(this.hunderPlayer.getComponent('AutoPlayer')).mul(this.weightHide));
        // }
        // if(this.bePathFollow){
        //     this.vSteeringForce = this.AccumulateForce(this.vSteeringForce, this.PathFollow(this.AutoPlayerJS.currentPathNode).mul(this.weightPathFollow));
        // }
        return this.vSteeringForce;
    },
    AccumulateForce(currentSteeringForce,addedForce){
        var currentForceLength = currentSteeringForce.mag();
        var forceCanUse = this.AutoPlayerJS.MaxForce - currentForceLength;
        if(forceCanUse <= 0){
            return currentSteeringForce;
        }
        var addedForceLength = addedForce.mag();
        if(addedForceLength <= forceCanUse){
            return currentSteeringForce.add(addedForce);
        }else{
            var canUsedAddedForce = addedForce.normalize().mul(forceCanUse);
            return currentSteeringForce.add(canUsedAddedForce);
        }
    },
    Seek(targetPos){
        var desiredVelocity = (targetPos.sub(this.AutoPlayerJS.node.position)).normalize().mul(this.AutoPlayerJS.MaxSpeed);
        return desiredVelocity.sub(this.AutoPlayerJS.vVelocity);
    },
    Wander(){
        var randomForceX = MapNum(this.randomX,0,1,-this.AutoPlayerJS.MaxSpeed*3,this.AutoPlayerJS.MaxSpeed*3);
        var randomForceY = MapNum(this.randomY,0,1,-this.AutoPlayerJS.MaxSpeed*3,this.AutoPlayerJS.MaxSpeed*3);
        var streeingForce = new cc.Vec2(randomForceX,randomForceY);
        return streeingForce; 

        // var berlinX = noise.perlin2(this.perlinSeed,this.elapseTime);  
        // var berlinY = noise.perlin2(this.perlinSeed,this.elapseTime*1000);  
        // var randomForceX = MapNum(berlinX,-1,1,-this.AutoPlayerJS.MaxSpeed*3,this.AutoPlayerJS.MaxSpeed*3);
        // var randomForceY = MapNum(berlinY,-1,1,-this.AutoPlayerJS.MaxSpeed*3,this.AutoPlayerJS.MaxSpeed*3);
        // var streeingForce = new cc.Vec2(randomForceX,randomForceY);
        // return streeingForce; 
    },
    Flee(targetPos){
        var desiredVelocity = (targetPos.sub(this.AutoPlayerJS.node.position)).normalize().mul(this.AutoPlayerJS.MaxSpeed);
        desiredVelocity.negSelf();
        return desiredVelocity.sub(this.AutoPlayerJS.vVelocity);
    },
    Pursuit(evader){
        var toPursuitPlayer = evader.node.position.sub(this.AutoPlayerJS.node.position);
        if(toPursuitPlayer.dot(this.AutoPlayerJS.vHeading) > 0 && this.AutoPlayerJS.vHeading.dot(evader.vHeading) <-0.95){
            return this.Seek(evader.node.position);
        }
        var lookAhead = toPursuitPlayer.mag()/(this.AutoPlayerJS.MaxSpeed + evader.vVelocity.mag());
        return this.Seek(evader.node.position.add(evader.vVelocity.mul(lookAhead)));
    },
    Evade(pursuer){
        var toPursuer = pursuer.node.position.sub(this.AutoPlayerJS.node.position);
        var lookAhead = toPursuer.mag()/(this.AutoPlayerJS.MaxSpeed + pursuer.vVelocity.mag());
        return this.Flee(pursuer.node.position.add(pursuer.vVelocity.mul(lookAhead)));
    },
});
