window.EventCenter = {

    _events: {},

    EventType : {
        TEST_EVENT: "TEST_EVENT",
        Water_Drop_Added: "Water_Drop_Added",
        Someone_Be_Defeaded:"Someone_Be_Defeaded",
        BackToHall:"BackToHall",
        FreeFace:"FreeFace"
    },

    AddListener : function(eventname,callback,target){
        if(this._events[eventname] == undefined)
        {
            this._events[eventname] = [];
        }
        this._events[eventname].push({
            callback: callback,
            target: target,
        });
    },

    RemoveListener : function(eventname,callback,target){
        var handlers = this._events[eventname];
        for (var index = handlers.length - 1; index >= 0; index--) {
            var handler = handlers[index];
            if(target == handler.target && callback.toString() == handler.callback.toString())
            {
                this._events[eventname].splice(index, 1);
            };
        }
    },

    RemoveAllListener : function(eventname) {
        if(this._events[eventname] != undefined)
        {
            var handlers = this._events[eventname];
            for (var index = 0; index < handlers.length; index++) {
                handlers[index] = null;
            }
        }
    },

    ResetAllListener : function() {
        for (const key in this._events) {
            if (this._events.hasOwnProperty(key)) {
                delete this._events[key]; 
            }
        }
    },
    
    dispatchEvent : function(eventname,data){
        if(data === undefined){
            data = {'data':'None'};
        }
        if(this._events[eventname] != undefined)
        {
            var handlers = this._events[eventname];
            for (var index = 0; index < handlers.length; index++) {
                var handler = handlers[index];
                handler.callback.call(handler.target,data);
            }
        }
    },
};
/**
 * ai 逻辑行为
 * 1，去收集一般的水滴使自己变大
 * 2，去追赶其他player
 * 3，去躲避某个player
 * 4，到处乱跑
 * */ 
window.PlayerAIAction = cc.Enum({
    CollectCommonWaterDrop: 0,
    PursuitPlayer: 1,
    EvadePlayer: 2,
    DoLikeAFool: 3,
});
window.BtnState = cc.Enum({
    GetUnSelect: 0,
    GetSelect: 1,
    Unget: 2,
    Unknow: 3,
});
window.CREATE_EVENT_HANDLER = function(target, component, handler, customEventData){
    var eventHandler = new cc.Component.EventHandler();
    if(target instanceof cc.Node){
        eventHandler.target = target;
    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'target' must be a cc.Node!");
    }

    if(typeof component == "string"){
        eventHandler.component = component;
    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'component' must be a string!");
    }

    if(typeof handler == "string"){
        eventHandler.handler = handler;

    }else{
        cc.error("GLOBAL_DEF.js: method 'CREATE_EVENT_HANDLER' param 'handler' must be a string!");
    }

    if(typeof customEventData != "undefined"){
        eventHandler.customEventData = customEventData;
    }
    return eventHandler;
};
window.MapNum = function(targetNum,srcStart,srcEnd,targetStart,targetEnd){
    var srcArea = srcEnd - srcStart;
    var targetArea = targetEnd - targetStart;
    var targetOffset = targetNum - srcStart;
    return targetStart+targetOffset/srcArea*targetArea;
};
window.getUserFaceData = function(){
    var objString = cc.sys.localStorage.getItem('UserFaceData');
    cc.log("objString",objString);
    if(objString == null || objString == "undefined" || objString == ""){
        return {
            currentSelectIndex: 0,
            ownFaceList: [0],
        };
    }
    var userData = JSON.parse(objString);
    if(userData != null && userData != "undefined"){
        if(userData.currentSelectIndex == null || userData.currentSelectIndex == "undefined"){
            userData.currentSelectIndex = 0;
        }
        if(userData.ownFaceList == null || userData.ownFaceList == "undefined"){
            userData.ownFaceList = [0];
        }
        return userData;
    }else{
        return {
            currentSelectIndex: 0,
            ownFaceList: [0],
        };
    }
};
window.TruncateByVec2Mag = function(limitMag,vec){
    var vecMag = vec.mag();
    if(limitMag < vecMag){
        return vec.normalize().mul(limitMag);
    }else{
        return vec;
    }
};
window.EnumEntityType = cc.Enum({
    Player: 0,
    PlayerAI: 1,
    CommonWaterDrop: 2
  });
window.PlayerInstanceIdManager = {
    currentIDCounter: 0,
    GetAnNewID: function(){
        return window.PlayerInstanceIdManager.currentIDCounter++;
    },
};
window.graphicsStyle = [
    {
        fillStyle: cc.color(255,200,150,255),
        strokeStyle: cc.color(255,200,150,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(255,157,157,255),
        strokeStyle: cc.color(255,157,157,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(157,235,235,255),
        strokeStyle: cc.color(157,235,235,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(170,120,240,255),
        strokeStyle: cc.color(170,120,240,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(60,190,130,255),
        strokeStyle: cc.color(60,190,130,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(40,180,210,255),
        strokeStyle: cc.color(40,180,210,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(255,170,230,255),
        strokeStyle: cc.color(255,170,230,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(157,255,175,255),
        strokeStyle: cc.color(255,255,255,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(157,160,255,255),
        strokeStyle: cc.color(157,160,255,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: cc.color(226,157,255,255),
        strokeStyle: cc.color(226,157,255,255),
        lineWidth: 1,
        debug: false
    },
    {
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 3,
        debug: true
    },];
window.MyWXInfo ={
    name:"",
    avatar:"",
}
window.RewardADSinglen = null;
window.InsertADSinglen = null;
window.BannerADSinglen = null;
window.PlayerTimes = 1;
window.playerNames = [
    "给爷站住","骑着蜗牛。","别犯贱","凹凸Man","老鸡抓小鹰","爷不缺孙子","喵oo","陌影0","香诗翠","十梦九你","沉默U","忧郁逗比","輸給o時咣","Dear","盗墓贼","24K纯贱","芬芬","情话与狗","柠檬心","薄荷情","Lee","Liz ","Otto","Cara","甜小妞","念念不忘","妞给爷站住","丑病难医","发霉的情书","笑伴孤单","笙歌i","墨oo","旧言虐心","炸了SM","劫走EXO","FBI","UFO","龙","零零柒","﹏執念","手插口袋","萌了个兔","心碎谁买单","娇气的小奶包","纯情小火鸡","云想衣裳","小草","任性","三叔公","闷油瓶","无邪","胖子","死肥仔","小哥","那只喵","小笨蛋o","大笨瓜o","蜡笔小新@","蜡笔小舅@","择一城终老","择一人深爱","囡囯因囚","打伞的鱼","溺水的猫","麻辣烫","小辣条","咕-_-","噬魂","啊呸！","OoOo","咕噜咕噜","Ao初见","吥稀罕","以若山","笑看红尘","哼~","命*","囍","[妄]","浅笑oo","青鸾","求败","蜜兮","# 若曦","灭世","魂淡","Sunny","Seven","｛孤心｝","o夏樱","南巷*","深井冰","飞雨","相思浓","萌小丁","月牙儿","薄灵阳","樱小桃~","陌上桑","香思松","逗小逼","旗才艺","甜小妞","1+1=3","闾丘山雁","透心凉","笑回首","戈飞翔","糖小果","钱海秋","真凝心","么么哒","昔其雨","泪眸人","别再念","伊筱沫","菊花开","白风","半神经","哎呦喂","洛可可","屎太浓","九尾狐","本明远","行文华","陌若惜","墨小沫","糖长老","喵先生","24K天然","奥巴喵","琴心","你亲爹","薄荷凉","灵凡","飞白","简小兮","花裤衩","梅Oo","兰Oo","竹Oo","菊Oo","过路人","忆Oo红颜","听风吟","Max","猫Oo小咪","小梨涡","浅浅夏","柠檬心i","A书白","T和T","冬莲","淡夏之","兔小乖","小萝莉m","花朵朵","吐泡泡oo","小幸福","萌嘟嘟","凹凸曼","biu~","好菇凉","抄凝雪","99.90%","留景同","加载中…","凉人夢","不讨囍i","冼华美","o梦倾城","环嘉玉","薄荷绿","钻石泪","水晶","乐然","逗比症","格式化","怪叔叔","没文化","x小学生","LOL","撸啊撸","疯癫范er","下载中....","哼小曲","懒喵喵~","囚心锁","特困zZZ","Orz","维她命","冷Oo","小偏执i","陌路人","亚咩跌","打酱油","酱油王","挂机","印度阿三","你美","爹啊","邸夏彤","巴扎嘿i","思雁","经涵山","逢水之","单于语海","YOU","I Love","櫻之舞","墨小墨","雨萌萌","熊如云","颜小柒","旗傲安","别掏心","残泪=","猪猪zZZ","萌呆猪","离心咒","贸芳洁","奥特蛋o","陀晗雨","怪我瞎i","拉勾勾","翠寒凝","洋子舒","声声念Oo","｛醉相思｝","[呛人心]","凹凸萌","清奇文","舒灵波","圣杰","柯","hehe","呵呵","猪坚强","语柳","学乐容","布水风","陌小沫","小情歌","猫o喵","北城=忆","燕晓彤","犯小贱~","弭希彤","(OoO)","詹驰婷","米唐","嘟嘟嘴","第五以南","抱抱熊","baba","巴巴爸爸","比卡丘o","比卡~比卡","诺吟怀","犁运凯","乐成","原静安","求泰清","毒心術","祝玛丽","咪咪兔","莫念他","锐友安","一南","HM","bby","风煜祺","万伶伶","波哩瓶","飘来五个字","逗你玩~","伪淑女","第夏山","少心怡","碧鲁翠梅","骑青旋","图门阳成","心太冷","看！灰鸡","神经","游欣彤","紫云","简暄和","朕好萌","保莺莺","_樱花巷","一筐猪 ","Out","Ken","Peter","嘘!安静","三及第","回家吃饭","求勾搭","已注销","赫连迎蓉","竺玲玲","景长星","妖小精","巢香莲","莫小言","买依薇","硕向槐","冉天心","盛水冬","招静娴","雅蠛蝶","何弃疗","蹦叉叉","情流感 ","哎呀呀o","天然呆zZ","娃哈哈","女硬汉","失忆症","敌敌畏","鸡蛋","小鸡鸡","Oo珑玲","木槿花*","Me","二湿胸","切克闹","念念不忘","十梦九你","EVE","WOW","汪昭昭","沫沫浅言","浅陌初心","情癌晚期","小喵喵YY","绳灵秋","波半梅","琴和雅","之冰巧","柠萌小姐","不囍人潮i","噢，特慢~","伱好瞎 *","猜不透o","自作孽","在景龙","xX鸡蛋","XXOO","XoXo","櫻花~祭","沙秀洁","Zz兮兮","我呸！","我 也呸！","Me小懒虫","番小茄","猪猪侠","我是超人","动感光波","宇智波~","鸣人","六道仙人","木叶","Oo晓oO","借个吻","顏小朵o","类敏思","根号四","求骚扰","笪怀梦","普以晴","哀月天","毛毛虫","田又青","未命名","唯Ta命","雪","闹心*","化嘉悦","蛋小疼","良德辉","仵灵波","史安莲","偷心贼~","随怀芹","多余旳解释","浅唱夜旳美","放弃幸福","微笑面对一切","爵~maN","空虚","_佐瞧瞧","　Oo苑","偏执旳温柔","W@无情","北极想你","路飞","请勿打扰","何必太天真","夜~太美","放下你和所有","放手","贪婪的想念","9527","静静的思念","骨感美～","ni花痴","被情所困、","~佑瞄瞄","俄还好","小妖、精","忒笨","傻子","终淡化了美","你，不配我","_堅=強","对你的冷漠","陌路夜未央","小涩先生","诶！爷我赞","坏pi气","O老男人","浅雨夕","心痛算什么","衮开、","陪你到老","落寞oo","~迷糊娃~","简单旳爱","衬托去爱","喲、妞你赞","逗妇乳","亦莫离","不No","落花殇","雪","卡布奇~诺","qq网名","再次邂逅i","空白式","x呆子x","爱只为她"," 苍涼","尔如此冷淡","光腚局","沉淀！","AMate","大老公","笑着哭!","不要离开我","非主流网名","默默然","念直至成伤","保质期","　一脸B相","伤的太彻底","呐爱","迷恋","Mcu〢","手拿香烟","库破个洞","中央一套","水立方","喔不昰玩具","半面妆","Oo暧昧","如果他","空荡荡的心","凄迷","一纸离人醉","情断心却相","　Oo栥","安蓝儿","叫我女王","曾经的你","唱征服","小自摸","胡了~","大三元","大四喜","一起疯了","你已被淘汰","不好玩","下一站","樱花","为你流泪","余温，散尽","妖怪","我还小","禽小兽","离别yi刻","不安青春","仰起头~","海绵宝宝","心已凉","给爷爬远点","不开则待","孩，他爹","苏浅蓝","Ben","那些过往","头碰头","藕断丝却连","刺青","一分钟我等你","G小调","秋香先生","3、2、1"," Wood","momo","呐个牠","小呆呱er","Lucy","安*陌离","我只爱你","回到最初","背后的孤独","ousman","情侣","Kennedy","　夜伴歌笙","卑微","静止oo","笑微笑","贪婪"," Gold","~昵称","~签名","渗透的葬礼","ham","寂寞在掉泪","xi惜相命","裝B控","女人!依旧","一起来看雷阵雨","克制，","一场梦而已","’听天由命","怒放在异域","我是大怪兽","呐爱狠美","女神","幸福棒棒糖","敷衍　　","雅典娜","对不起","院子里画沙","脆弱不堪","被窝﹖爱","D_G","我爱RMB","爱到何时","疯人愿","回眸醉倾城","冷血动物","冬冷","R幻影","欧美式接吻","请，带走","唯一的幸福","SOS","圈圈那叉叉","葬痴心","㈠个","初雪","跟屁虫","细数惭愧","曲終人散","負二代","褪色的承诺","花开则守","负能量","夏子洛","自大狂","禁锢的誓言","回忆终止","刺眼旳情侣","Tom","son","唇齿间的爱","情侣~装","明天H","我喜欢她","KissU","妾随","qq情侣","QQ企鹅","苍老师","自述","qq情侣网名","Linda","玩火自焚","工藤新一","柯南","婚礼礼堂","花样年华","Wolf","滚好么","Carr ","哭着高兴%","宝贝不哭","间接性抑郁","流泪淂心碎","m，嗨起","你无可取代","初吻给了烟","记得忘记","大雨噼啪响","思密达","老婆吃米线","君追","望_","贪婪","若初見","凌乱，离别","网名大全","美丽的另一端","祈~祷","傻瓜Ina","He猪","Oo沁","淡淡的思绪","自恋狂","你太小","假装","CF100","AK94","美国内衣","妮听咱话","完美的爱","1颗永流传","自娱自乐","未语人先羞","AAA","顽固不化","C 咯","小不点er","毁灭","伊~小夏","Giles","亲，你左脸","m1ss","绝杀%","痛苦的/呻吟","蔓延2j","Buck ","如今Ac","O哦","大人、恕罪","所谓的温暖","寂寞好了","一脸苍白i","烟花落","带我飞","头文字D","不是本人","红颜祸水","纠结旳SS","不要这样","Moll","莫i相忘","大白痴","22相亲","彻底放弃了","回忆那么真","念念不忘","Bert","换位思考","珍VC","我幻成殇","正经人","转身说再见","开始明了","“疯女人”","陌摸","微笑>失忆","心碎~囧","伤心过了头","L娘子","花=有毒=","、受伤、","深深小安","莫~大宝","烦恼%","幽明自若","(艮)悲伤","纠缠","学会爱","毒毒毒","深夜、徘徊","~那么美","淡_然","牵绊情愫","Guy","我喜欢他","默许那青春","Lou","拜托说爱我","Broken","太假","[绿茶]","我是奧特曼","果粒、橙"," Lily","不懂珍惜","龙舌兰","Avery","Eliv","卟~怕","JJ初始化","侵蚀内心","Gosse","Yi心情","浅浅小鸣","依賴你所有","紫涙嘫","1种矜持","夜ト负紅唇","自惭形秽、","Otis","Beck","听风在唱歌","—抛弃","太过于执着","有夫之夫","Ula","木头人","~、落幕","我会很在乎","俄好想迩","达芬奇","哼，涐吐","记忆狠清晰","纠结","以後呢A","男人、繁华","BOX07","时光逆转","此生不坏","Bobi","Guy","停在昨天","陌生到认识","（疯男人）","黑夜里失眠","为你痴迷","誓言~","Toby","最后的最后","Miss","心乱","Saul","别猜我心思","babay","Honey","爱上ni","红颜暗","Zero ","黑色爱情","Ida","w无意","说不出口的爱","Anne","花亦殘","心，绞痛","无言以对","呤!!","若相惜","Mr糖","后补情人","执着","叛逆","埋葬那份爱","发霉的花","文明人","没人疼？","错过，遗憾","长相思守","浅浅的回忆","骗局","少黑","观世音菩萨","俄对花儿笑","流言蜚語","心的束缚","伪裝的幸福","Anyway","、红妆落笔","Oo傻吖頭","Tim","喂圆圆","Jane","Laura","Dick","一手的触碰","越长越不安","那傻蛋","老公喝拉面","致命德毒药","所有M不住","披羊皮的狼","Aries","执著的女人","婚礼洞房","Dora","Oo熊猫","长大嫁你","Veblen","菊花怒放","吟唱怕寂寞","爱拉乌由","1起走","C大调","芦苇F浅","早已该放手","习惯性隐身","<午夜m>","延>X","没人疼孩子","霸占灵魂%","、哎喲喂","小、白痴"," Lee","被窝里=","贪恋你温柔","需要ai","Edie","Pete","佑佴玎","Bess","BOSS","另一种平静","　可惜不是伱","又岂在朝暮","自说自话","USA","联盟","HeroA","释(怀","<唇红","如果当时、","d小调","寻找~寄托","刺青","若弱C","行尸走肉","不爱请闪开","Haley ","Jay","独唱情歌","April","Gail ","Hood","满足ni","Y夜秋凉","我是谁","Doyle","花自毁","毛利、","　上瘾的烟","一夜七次郎","32场","我是歌手","续写呐份情","_RocY、","Clare","Liz","时钟滴答响","此1不2","Ctrl","以后不分开","Viola","唯1的唯一","喂，要爱我","LT_A","时间淡一切","你带走了爱","蹲在脚落","也，許","所以狠在乎","Blong","Burne","She","偷偷恋NI","逆流成河","为何","莫小柒i","笑狠徦","寂寞B","Dicke","腊笔小东","原我狠犯贱","放肆的微笑","Tate","霸道的占有","欧巴","笑痴笑G","Jared","duang","shift","Fuck","按到角落","谎言可笑","也许","壁咚","给不了告白","David","董式小内衣","Wade","韦小宝","爱新觉罗","卡卡西","Lynch","多情的美景","分局","愛米丝U","12不许动","老实人","安靜初秋","Yves","不该的曾经","Yes","SayNo","尝试放纵","已婚女嗨","苦涩占内心","小妖小姐","菊花残","Angel","流年换给","一个人的伤悲","XOC莫","Rose","深蓝Xx","占领网吧","爱旳偏执","回不去旳甜","小小乖","微笑暂离","刺痛，的心","Lamb","我被你拥有","Susie","·追寻你的脚步","别离开我身边","猪一样队友","小gg","悄悄的","涂鸦","【宿命】","上个路口","咋卜好","泪悄然而下","嘿尔的心呢","欲哭无泪","我们旳愛","CM犯贱","云淡，风清","Glora","Dulle","大宝剑","一条龙","局外人","死一般的静","浮云、暖","王八蛋","上集回顾","咱，乖乖","厮守","时间在怂恿","罗小乖","Wooll","依、太难","瞬间变化","York","Bill ","MS女人","看透不说透","释放灵魂","Donne","有你的幸福","Henry","网名已过期","五脏俱全","不再服务器","不在服务区","先生靠过来","客官，不要","等待出嫁","Antoi","Mered","Ruth","那夜床单红","浅蓝","呐喊这幸福","Young","Nicol","Diers","假装听不见","惊魂者","Upton","Finn","花花女人","Ling6","好喜欢","Jim","很丑很温柔","半夏、寂","Cooke","续写呐份爱","转身就是妳","刺入骨髓","Reg","WWW","威尼斯迷路","寂寞别说爱","_谄媚","一起装B","Sim","骑猪看夕阳","白日里做梦","坦荡蛋","与子偕老","咱、好好的","Harry","Tracy ","伤到死为止","Jerey","初见温柔","洛小北","自欺欺人","玩消失","T=依赖","静静的想念","男人的眼泪","未来很渺茫","狠好","俗不可耐","Ethel","佐岸佑转","伤口在蔓延","Oswal","如此、灰白","Basil","da相公","我的所有","_初夜","开心%","梦里，花落","替代品","Stanf","街角哭泣","夜<深了>","Leaco","恩，我狠笨","DF不弃","欺骗了谁","因为狠爱你","似情非情","靜靜的","Ivy","Norma","TTx暧昧","Arvin","一败涂地","Clark","一盏煽情美","(原来呢)","Julie","已掉线","<老>男人","Perk","Ralph","换一种心情","Dolo","动感超人","嘴咬嘴","汉界~","何必当初A","淡陌HL","太自私","Titus","Apple","爱疯","肾6","奢华杜少爷","肾手表","Ipad","Sean","揪心旳痛","俘虏你的心脏","Nelly","看穿oo","Uriah","Omar","我累了，","Omz","下个路口","泪流","思绪很乱","Fayen","w我呸!","花事、","、懦夫","作孽啊！","Made","卜","Coppe","McDon","时间旅行者","凉飕飕","向钱看齐","Oscar","Owen","麻雀虽小","煙、花很美","Esth","Grise","情只为他","空白情绪","恩，我狠傻","Franc","爱将我包围","窈窕绅士","花谢花开","伯虎小姐","火染指尖","隐身","按到墙上","嘿嘿","潇洒无所谓","一路向西","唐长老","丑的可以","我是良民","Sharp","风干了的伤","那笨蛋","主题、曲","Dunb","拾来的爱情","随心而愈","柔温~将至","苊好爱尔","、疯子","莎凹","Abner","沵若成诗","伤感的舞步","眼眸印温柔","诉说那段情","滴歪歪、","爽歪歪~","抹杀你骄傲","痛依然存在","i目标i","你的一切","似爱不爱","吟唱很寂寞","V粟凸","爱你狠深","嗯，还行","Robin","Alick","不喜欢","楚河、","Lena","留下的痕迹","Symon","低头深吻","夜凄凉","掩面半遮羞","Co回忆","埋葬回忆","要爱情了","佐佴玎","红灯区","灯红酒绿","呐个Ta","＜_欲","非谁莫属","蹲厕所吃醋","Lucas","不安的青春","如此痛苦","物非人非","扭曲旳黑暗","音乐摇滚","习惯性依赖","心事轻梳弄","G_zo","Bevis","七天De","Maud","抛开所有旳","Marcu","看着你失眠","罪莎","如果我走了","嘘","韩小西","下集预告","停止我的心","Berth","爱成全寂寞","Bert","伤狠痛","猥琐高傲","海洛茵","佐岸美","　败柳、开","Poun"," Vince","我的终结","呐情","片刻望你懂","冷冬","Kevin","麻木的青春","占据你X","黑黑，黑夜","　地平线oC","剧终","心里有个人","CTOC","OZ赎罪","疼ni入芯","E成過去","高姿态W","Dunlo","Ralap","~祭~恋~","思考换位","Afra","Darcy ","Harpe","Happy","Noeli","需减压爱","冷温柔","Lizzi","留住我要","Fay","全都是虚假","白白D天","所谓的男人","终日缠绵","Watch","L_TV","Ss献媚","续写KK","Satan","麻木、","　陪我到最后","遥不可及","XK 莫","毒渗透","Louie","玛萨拉蒂","苏白染","别克DD","m、唱起","Xiao芸","冷风如冰%","无聊！","Sawy","呐情狠赞","Rex","100%","99纯金","裤衩超人","小宝V","醉死温柔乡","Twain","Nick","重复性上线","小姐点烟","好多鱼","爱过才痴心","含笑而4","孙行者悟空","　海岸线~","暧昧已落幕","已死请念安","挣扎、","浅忧郁H","花儿对俄笑","Jess","贝多芬","Laure","拒绝、寂寞","妹mm","同居","长大娶妳","Chase","洋qi","私人小秘书","羊羊羊","Xiao琦","Fitch","繁华旳街道","小酷酷","如果她要","Issac","夜伴未央","不离、补气"," Read","欲哭i无泪","(复习)","小情歌","LT_等待","唐小西=","花絮情已了","要走","怀念过去","Bulwe","嗯就这样了","害怕谁离开","爱过才知痛","陪我到最后","＞矢豆矢豆","涐，狠乖","伊旧思念","腐朽的阴谋","一个人不昧","或许太留恋","我继续坚强","那爱太单纯","蛋蛋狗","半夏_忧","完美De伤","简简单单","寂寞好了","下课乱跳","哥不闻不问","(调戏）","爱笑的眼睛","Harle","~逃脱~","属于她的你","腐朽旳嗜好","你的终结","勿、俯下身","暧昧小动作","Amy",">痴白<","如此的荒谬","慕容雪","莫i相望","我的依赖","我淑女裝","时间限制","闻醉易","丘念蕾","其沛凝","Bauer","Elija","北怀玉","寻梦秋","邢凌晴","拱诗蕾","謇冷玉","书怀薇","斛新雪","杞博雅","暴雪绿","掌娴淑","龙盼雁","雪毅然","戎涵蓄","登水蕊","咸音景","闽驰鸿","官运华","谬晗蕾","盍心思","诺茗雪","桥乐湛","戚新雪","祈斯雅","赫连秀华","镜梦菲","斯鸿志","李水冬","麴如冰","任永长","伟德运","张简飞尘","竭翠柏","冉代秋","秋承福","东方光亮","汝修平","拱鸿煊","实玉宸","梁又柔","所妙梦","才音悦","官晴霞","毕恨云","郁俊晖","荆怡嘉","森茂德","皇甫蕴秀","皮力强","慈飞松","强和雅","秦又亦","轩辕问春","北元瑶","姬骏哲","简俊驰","廖嘉懿","霜雅凡","示景辉","牟俊爽","函绿柏","董湛英","那振荣","解逸丽","何荌荌","宋同甫","练刚豪","肇若薇","越白亦","后修真","隽振荣","道雁卉","笃星汉","贝曼彤","施秀丽","帖康复","善雅美","乌孙冰薇","刀海秋","寇清涵","佼迎天","亓智敏","诗辰皓","欧从筠","么芷文","哀英达","寻之云","阴紫琼","季静珊","己静槐","金寒梅","修惜筠","郜谷芹","陶采萱","卿芝宇","融昆鹏","介光远","蒲鸿福","愈天心","东静珊","武乐松","箕康宁","伊琳晨","薛诗翠","但梦晨","示欣然","邴悦欣","养平萱","竹依波","杨向阳","吾蕴秀","柴芳泽","廉沈静","许梓露","莫佳妍","公孙芳茵","德愉心","度元芹","司徒醉易","濮阳迎蕾","俟宏义","敬阳州","恭志专","蔡飞莲","呼素华"," Bart","佼春桃","吾语燕","鱼筠溪","尔雁山","骆映波","仲孙白夏","玉惜玉","公冶如冰","Les","简佩珍","九南莲","萧婉君","戈骊文","钭如风","太史鹏飞","逢怡木","晁美曼","念香波","那美偲","厍学林","呼延宾实","柳凝雨","费莫浩歌","锺茉莉","畅语诗","介和歌","游水蓉","但南珍","盈夏蓉","皇安娴","籍芳洁","泰易绿","鹿馨欣","夔妮娜","林秋寒","涂凯泽","晏三诗","鲜于冰冰","雨珍","单于凯旋","告翠琴","蔚千风","豆言心","系辰宇","藤筠心","蒉子惠","贵和美","任昊英","古依凝","Felix ","勤寄蓉","太史星渊","潘乐语","司空尔柳","图门康复","聂笛韵","栾奇文","稽成周","费莫逸春","牟鹏煊","隽觅珍","酒凌春","仆凌青","Devi","德凌波","靖凝雨","Jacob","修燕舞","诺含烟","孝惜香","渠访文","紫秋翠","戏绿夏","繁香菱","营成礼","Erin","舜嘉玉","郝俊材","启灵","魏含云","拓跋开畅","种智阳","太史晓蕾","曲佁然","潜平良","释若蕊","Child","藩彩妍","水乐蓉","怒波~鱼","牧清懿","琦沛白","靳梓璐","果家欣","闻盼易","伟半蕾","郝明辉","淦雪枫","澹台千叶","翁秋珊","纳寻桃","那飞沉","南宫雁易","捷贞婉","帖茂德","世玉","夏旋","完颜书文","敬绍辉","许~","Pepys","徐银河","邗春柔","浦令枫","闽清婉","纪静槐","利朝旭","羿寄云","谈千易","田彦露","永春","第五元素","邛歆美","卓双文","撒恨蕊","衅修伟","栗娟娟","怜雪","仰香露","类婷美","沙阳焱","Colby","大芮欢","甲修","员西华","章婉秀","小白龙","台成双","禚成和"," Camp","听双","舒向秋","寿凝雨","农绿海","龙马","佟佳听枫","镜慕山","仁慕诗","布海宁","及兴平","操尔安","九听双","承庄静","八戒","费良骏","悟净","葛俨雅","悟空","布怀雁","霜良骏","汪竹雨","以水丹","Verne","释兰","Ru来","封茵茵","登梦寒","位驰鸿","士梦泽","闾景澄","善芮悦","俟白易","巨含云","强寄蓝","虢半梅","陆天恩","勾觅丹","徐高格","赫连惜儿","湛一瑾","毕健柏","云初蝶","侍滢渟","盖芳蕙","ban槐","盼盼","AV民","牵晓露","圣易蓉","~水","融雪","漫代卉","Tout","巧蕊","OT云","屠宏茂","智浩思","寇凯旋","Nat ","化雨筠","绍乐章","洪晴霞","雷夜卉","黄以蕊","首芸欣","雍亦绿","九访曼","丹丹","祈力言","丙冰双","令碧琳","卯昊伟","沐忆彤","瑞琇晶","素灵萱","淦天青","鲁隽雅","李鸿祯","于暖梦","红高寒","司马伶俐","瑞开诚","琦雍雅","韦小之","夏以南","无秋柏","柔辰良","析冷珍","贲烨华","阚蕙芸","玉宛丝","侯曼容","树，柏","褚梦晨","、秋","韶忆梅","辟如云","Pansy","路迎波","敏梓楠","T晴T","Quinn","Mike","慈静慧","Blume","End..","司空舒方","柯尔雅","殳秀英","澹台水之","Keith","栾熙柔","佟秀敏","路娜兰","Ella","天乐成","Saul","由祺瑞","年含巧","植鸿达","剧思迪","凤暄美","湛方方","Mona","宿蓓蕾","有芮佳","萧芷珊","夫梦槐","彭璇珠","劳绮露","宾韶容","栋冰洁","佛水","裔宛白","练鸿振","潮运盛","佟佳锐阵","汉安莲","宿竹悦","空雪曼","ONeil","毕明知","戴靖柔","睦韵梅","税兰英","回依美","Adair ","竺杏儿","单余馥","濮千山","吴文华","Len","扈冷萱","滑彭彭","典书雁","甄湘灵","迟采珊","乐痴凝","蹉香巧","穆齐敏","步巧蕊","千凯复","牛承安","问阳平","lucky","乌雅南烟","郑采萱","衅向露","来兴言","弭元冬","Conn","卿秀美","是永福","薛飞宇","覃山菡","来初然","Judy ","孝诗双","very","查昆鹏","Vera","泷涵涵","上官丽姝","Fox","充孤兰","秘靖之","成风","Boris","卞天空","和冰冰","邴春燕","巩倚云","冷天成","甲心香","仙凯歌","左丘","通鹏池","布光远","闭初兰","彤水蓉","弘景辉","飞烟","菅傲白","苗飞荷","Bryce","辜绿柏","承新竹","长宛秋","Blair","司空嘉言","回雅洁","歧月明","Debby","牛安","Snow","冯鸣晨","温初瑶","樊熙柔","委灵松","Jonah","宗青柏","古醉波","邓白梅","位烨煜","麻妍雅","宣歌韵","由涵润","车骊婷","原语诗","师鸿骞","Enoch","委昊嘉","由乐心","冒寄蕾","印妙之","謇明志","范骊蓉","让鸿卓","昌问萍","罗碧玉","西门吹水","商寒梦","户丽珠","井绮云","磨凌丝","求亦绿","隽梓婷","圣妙婧","初锦凡","不灿灿","紫忆梅","Ascar","申琇芳","威千易","诺雁卉","Felto","莺莺","巩山柳","朋湛颖","令代","徐雪儿","惠承平","陆天晴","家佩珍","单于嘉赐","卯玟玉","完泽雨","似昆谊","坚骊媛","贝阳飇","诺沛珊","滑迎彤","捷凝云","裔安康","佘夜卉","清白凝","奕成弘","商静雅","宇绮烟","以天籁","笪德曜","成天蓝","祢翠曼","表从冬","呼惜文","戊含巧","盖闲丽","俎素欣","管清馨","碧鲁文丽","魏雪漫","储如蓉","洋凡桃","秋清雅","冷睿思","奚韵流","娄梦槐","梁思楠","以文耀","羊白曼","植尔槐","斋夏青","索凯定","莱白夏","叶艳蕊","范俊材","丑佩杉","乌雅友安","尔绿旋","改丹彤","庆元恺","冉霞月","接语彤","赏代双","别天元","全若云","节晨曦","郏雨竹","耿叶农","剧艳卉","盛从霜","在清馨","令狐高峰","实茂典","庚丽雅","有寄云","长盈盈","巴珺琦","植天路","尔婉君","涂暄和","勇浩荡","摩宛菡","寿晓楠","敬兰芝","疏以彤","植婷美","鲁逸美","连哲丽","巢靖易","香雅蕊","蒲寄风","寿弘义","歧凯乐","羊云泽","叶安琪","皮高旻","濮妙芙","芒以柳","陈斯年","周雅丽","戈妙梦","字兴庆","肥靖易","华雪萍","朱香天","始阳平","揭沛容","姬静柏","Cook","阚红旭","肖笑柳","寒采波","Kip","祭秀丽","玉雁山","希清涵","何俊杰","满贞韵","字绿夏","郁昊天","文清绮","似怜珊","茅娴雅","桑兰芝","卞思菱","库初露","杭志行","牵恬然","邴志专","刑晨希","孝飞雪","桥雅爱","钱语林","撒寄容","裔惜蕊","鲜和美","哀尔烟","嬴盼夏","旅惜萱","乘又槐","宏访烟","单乐双","闪雅懿","茹惜玉","游迎荷","卢书白","仙惠心","萨易文","宜怀芹","简阳伯","中作人","纪旻骞","悟代巧","狄媛女","函智志","邝星泽","盘盼芙","留韶美","傅香梅","南安然","邱阳煦","何曼彤","微生凝雪","丹友梅","出文宣","闳以松","公叔乐荷","班语林","栾凝海","潭沛珊","雷山彤","抄晓旋","才姮娥","南宫雨竹","淳于玉韵","饶伟祺","潘雪莲","令狐忆安","马谷雪","皋尔芙","盛暄玲","百如心","斯颖慧","禾宏深","古安南","阚康盛","伟蔓蔓","逢怀桃","覃念真","乐正林帆","费莫博易","段干鸿光","律欣跃","瓮正豪","蒲令雪","濮初夏","畅怀蕾","翟鸿福","都晗蕊","顿逸致","东睿慈","回俊风","撒尔烟","邴韫素","僪寻冬","殷诗双","汤初柳","皮秋华","衣星文","旁绮琴","祁谷菱","苗丽文","栾以珊","籍光耀","慕容嘉纳","张元容","班雁桃","尉迟胤运","茆修筠","麻妍丽","中昊然","抗珠雨","摩俊哲","睦和光","阿痴凝","管夜蓉","回安寒","宜令秋","实静云","南宫怜晴","错韫素","霜良平","刘思怡","黄华茂","萨琼怡","闾丘谷梦","文弘懿","何夜卉","杨令慧","刑书琴","勇思松","过如彤","陀新筠","张简雪曼","苌芮欢","漫陶然","褒千秋","依多思","乾骊媛","皇奥婷","俟碧螺","曾念双","乌孙子昂","闵绿竹","聂仪文","福姮娥","邓雍雅","乌新立","佴香馨","欧诗怀","薄叶舞","秘思萱","黎驰媛","镜从波","鄂静娴","笃尔阳","仝立人","边希蓉","郜怡宁","况水之","凌骏燕","姓湛蓝","达腾骞","虢子真","青忻忻","宫美丽","励俊能","弘晓凡","紫芸馨","敬梓馨","车妙芙","东晓丝","边斯乔","訾雅安","双海白","子车曼容","剑忻慕","畅乐池","宾振宇","韶元洲","谢宏放","星高飞","太叔静涵","陶冬梅","仉心水","腾丹萱","平和怡","戎傲南","桓雅柏","素运珹","陶曜灿","敛涵易","紫慧颖","冷黛娥","剧弘雅","骑从霜","陆英杰","鲍晓桐","辟子瑜","甄溪澈","沐韦茹","声秀艾","依长运","塞昆琦","仉曾琪","祖夏萱","邴秀雅","公冶夏容","景锐思","繁飞鹏","仉英博","印熙华","甄依白","修静美","树欣美","虞珺娅","苟和正","仵妍雅","嬴听枫","兴莹华","寻元基","徭问丝","练鸿禧","乌雅夏萱","岳慕卉","过一凡","钱寄柔","第海阳","苌欣悦","郁昕月","仇鸿福","禾幼霜","虢长莹","农忆辰","阮景平","九丹寒","濮寻绿","季清懿","操玉宸","说静婉","闳碧春","旗喜儿","兰湛芳","聊依云","牧宜欣","昝雅诗","惠静慧","陀梦菲","庆雨雪","柏安宁","集馨欣","裴涵阳","义以蕊","德宏壮","汪娅玟","励问兰","禾红云","达雍雅","贡诗蕊","太史文瑞","周元冬","沈听荷","厍淳静","充世敏","佼昆颉","疏芳润","腾笑柳","曾冰菱","胥依波","夙子凡","齐芳蕤","委千叶","余采莲","撒碧萱","贡山蝶","鱼天心","在代巧","荀代卉","昌绮梦","宰父德元","端书雁","柯芳林","边涵涤","从妙芙","税若云","但高朗","诸葛意蕴","才秀丽","是夜云","禄静曼","蹉安和","呼延飞荷","奕迎波","姜宛亦","车晓凡","弥飞章","锺经国","崇英锐","波静和","圣晴波","掌和玉","节琦巧","腾英纵","硕俊逸","况迎丝","帅乐悦","洪奇水","籍兴思","士暄美","蔺之卉","张简元基","诸凡灵","甲慧雅","窦英卫","项紫雪","栗野云","线香露","桑晶晶","裔又青","菅晴霞","郎鸿畅","洪元白","邰小宸","富察云水","游书萱","止彤雯","宁敏智","府新知","戎骊婷","尾梦桐","史艳蕙","归晶晶","城品韵","戈文姝","危阳文","庚天骄","宫振荣","朋雨竹","施春晓","舜静恬","福学民","杭乐芸","承春梅","符秋柏","张春华","出立群","化哲圣","狂书竹","冷友瑶","阳古香","冉雁菡","花慕蕊","卓德运","是蕊珠","沐昕妤","澹台雨筠","焉凝荷","仆浩旷","殳嘉言","平绮南","郁芸茗","邢忆雪","栋依波","季思敏","裴寻冬","步慕诗","道和光","闳星宇","良春绿","图门曼辞","衅小蕾","颜余馥","城忆远","世紫文","咎金玉","是琇莹","汤海阳","蓝巍昂","相安怡","佛友瑶","富昊苍","介之槐","善骊泓","马佳靖儿","所浩阔","逯德曜","纳喇白翠","机白翠","迮梦之","招觅晴","函智宇","隋白竹","庚幻翠","巨怀柔","翠勇军","汤子琪","钮远骞","励德华","宣山蝶","澹台嘉玉","阙韵诗","令雪枫","展心远","毕望舒","章佳承福","代国兴","藤白莲","赤建义","洪骊艳","禄芸芸","茂逸春","义以松","树涵梅","祢璇玑","梁幼仪","经涵衍","戊欣跃","那菊月","贲盼秋","滕天宇","奇迎真","伊嘉荣","夏侯承悦","贾梦琪","凤鸿晖","景君昊","次以柳","机子辰","青海伦","驹听双","邬嘉运","威鸿光","包芷烟","才辰骏","郗文宣","斯艳芳","完春竹","遇鸿畴","华瑞锦","酒红旭","任珊珊","时涵菱","武睿明","宁丹丹","义念寒","诸葛瀚昂","焉静枫","闾艳芳","柯雪珍","栾忆文","仁卿云","郯寄琴"
];