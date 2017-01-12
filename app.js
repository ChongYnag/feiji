//游戏的全局配置
//引入JQeury
//$(window).width();
//$(window).height();
var WIDTH=420;
var HEIGHT=680;
var bulletSpeed=10;//我方子弹飞行速度

var bulletRate = 3;//没60*5毫秒发射一次子弹
var enemy1Speed=6;//敌机1速度
var enemy2Speed=4;//敌机2速度
var enemy3Speed=2;//敌机3速度
var heroLife=3000;//英雄的默认命数
var score = 0;//记录游戏得分
var difficulty=300;//游戏难度，取值范围10-500之间。
var canvas = document.getElementById('canvas');
canvas.width=WIDTH;
canvas.height=HEIGHT;

var ctx=canvas.getContext('2d');

//游戏进行的五个阶段
const PHASE_READY=1;	//就绪阶段
const PHASE_LOADING=2;  //加载游戏
const PHASE_PLAY=3;		//游戏运行阶段
const PHASE_PAUSE=4;	//暂停阶段
const PHASE_GAMEOVER=5; //游戏结束阶段
var curPhase=0;	 //当前处在什么阶段

/**游戏第一个阶段**/
var bgImg = new Image();
bgImg.src="img/background.png";
var logo=new Image();
logo.src="img/start.png";
var sky=null;
bgImg.onload=function(){
	curPhase =  PHASE_READY;// 图片加载完成,进入就绪阶段
	sky=new Sky(this);
}
function Sky(bgImg){//包含两张背景图片的天空
	this.x1=0;//第一张背景图片的坐标X
	this.y1=0;//第一张背景图片的坐标Y
	this.x2=0;//第二张背景图片的坐标X
	this.y2=-bgImg.height;//第二张背景图片的坐标Y
	this.draw=function(){
		ctx.drawImage(bgImg,this.x1,this.y1);
		ctx.drawImage(bgImg,this.x2,this.y2);
	}
	this.move=function(){
		this.y1++;
		this.y2++;
		if(this.y1>=HEIGHT){
			this.y1=this.y2-bgImg.height;
		}
		if(this.y2>=HEIGHT){
			this.y2=this.y1-bgImg.height;
		}
	}
}
/*****游戏第一个阶段结束*****/

/******游戏第二个阶段*******/
var loadingImgs=[];
loadingImgs[0]=new Image();
loadingImgs[0].src="img/game_loading1.png";
loadingImgs[1]=new Image();
loadingImgs[1].src="img/game_loading2.png";
loadingImgs[2]=new Image();
loadingImgs[2].src="img/game_loading3.png";
loadingImgs[3]=new Image();
loadingImgs[3].src="img/game_loading4.png";

function Loading(imgs){
	this.index=0;//当前需要绘制的图片的下标
	this.moveCount=0;
	this.draw=function(){//绘制一次
		ctx.drawImage(imgs[this.index],0,HEIGHT-imgs[this.index].height);
	}
	this.move=function(){//移动一次
		this.moveCount++;
		if(this.moveCount%4==0){
			this.index++;
		}
		if(this.index>=imgs.length){
			curPhase = PHASE_PLAY;//所有的图片播放完成，进入游戏状态
		}
	}
}
var loading=new Loading(loadingImgs);
canvas.onclick=function(){//当画布单击，进入loading状态
	if(curPhase===PHASE_READY){
		curPhase= PHASE_LOADING;
	}
}
/*********游戏第二个阶段结束*********/

/***游戏第三阶段***/
/***3.1绘制英雄*/
var heroImgs=[];
heroImgs[0]=new Image();
heroImgs[0].src="img/hero1.png";
heroImgs[1]=new Image();
heroImgs[1].src="img/hero2.png";
heroImgs[2]=new Image();
heroImgs[2].src="img/hero_blowup_n1.png";
heroImgs[3]=new Image();
heroImgs[3].src="img/hero_blowup_n2.png";
heroImgs[4]=new Image();
heroImgs[4].src="img/hero_blowup_n3.png";
heroImgs[5]=new Image();
heroImgs[5].src="img/hero_blowup_n4.png";
function Hero(imgs){
	this.index=0;
	this.crashed=false;
	this.canDelete=false;
	this.width=99;
	this.height=124;
	this.x=(WIDTH-this.width)/2;
	this.y=HEIGHT-this.height;
	this.draw=function(){
		if(!this.canDelete){
			ctx.drawImage(imgs[this.index],this.x,this.y);
		}
	};
	this.moveCount=0;
	this.move=function(){
		//this.index++;
		if(this.index===0){
			this.index=1;
		}else if(this.index===1){
			this.index=0;
		}
		this.moveCount++;
		if(this.moveCount>=bulletRate){
		//发射子弹
			this.fire();
			this.moveCount=0;
		}
		if(this.crashed){
			if(this.index===0 || this.index===1){
			this.index=2;//刚开始撞毁程序
		}else if(this.index>=imgs.length-1){
			this.canDelete=true;//撞毁程序结束 删除英雄
			heroLife--;
			if(heroLife<=0){
				curPhase=PHASE_GAMEOVER;
			}else{
				hero=new Hero(heroImgs);
			}
		}else{
			this.index++;
		}
	}
	};
	
	this.fire=function(){
		bulletList.list.push(new Bullet(bulletImg));
	};
	//判断是否已经被撞击
}
var hero=new Hero(heroImgs);
canvas.onmousemove=function(e){
	if(curPhase===PHASE_PLAY){
		var x=e.offsetX;//距离画布左上角
		var y=e.offsetY;
		hero.x=x-(heroImgs[hero.index].width/2);
		hero.y=y-(heroImgs[hero.index].height/2);
	}
}
/***3.2绘制子弹*/
var bulletImg=new Image();
bulletImg.src='img/bullet.png';
function Bullet(img){
	this.carshed=false;
	this.width=9;
	this.height=21;
	this.x=hero.x+(hero.width-this.width)/2;
	this.y=hero.y-this.height;
	this.canDelete=false;//子弹是否可以被删除
	this.draw=function(){
		ctx.drawImage(img,this.x,this.y);
	}
	this.move=function(){
		this.y-=bulletSpeed;
		if(this.y<-this.height || this.crashed){
			this.canDelete=true;
		}
	}
}
function BulletList(){
	this.list=[];//保存屏幕中所有的子弹集合
	this.draw=function(){//绘制每一个子弹
		for (var i=0;i<this.list.length ;i++ ){
			this.list[i].draw();
		}
	}
	this.move=function(){
		for(var i=0; i<this.list.length;i++){
			this.list[i].move();
			if(this.list[i].canDelete){//判定子弹能不能被移除
				this.list.splice(i,1);
				i--;
			}
		}
	}
}
var bulletList= new BulletList();
/***3.3绘制敌机*/
var enemy1Imgs=[];
enemy1Imgs[0]=new Image();
enemy1Imgs[0].src='img/enemy1.png';
enemy1Imgs[1]=new Image();
enemy1Imgs[1].src='img/enemy1_down1.png';
enemy1Imgs[2]=new Image();
enemy1Imgs[2].src='img/enemy1_down2.png';
enemy1Imgs[3]=new Image();
enemy1Imgs[3].src='img/enemy1_down3.png';
enemy1Imgs[4]=new Image();
enemy1Imgs[4].src='img/enemy1_down4.png';

var enemy2Imgs=[];
enemy2Imgs[0]=new Image();
enemy2Imgs[0].src='img/enemy2.png';
enemy2Imgs[1]=new Image();
enemy2Imgs[1].src='img/enemy2_down1.png';
enemy2Imgs[2]=new Image();
enemy2Imgs[2].src='img/enemy2_down2.png';
enemy2Imgs[3]=new Image();
enemy2Imgs[3].src='img/enemy2_down3.png';
enemy2Imgs[4]=new Image();
enemy2Imgs[4].src='img/enemy2_down4.png';

var enemy3Imgs=[];
enemy3Imgs[0]=new Image();
enemy3Imgs[0].src='img/enemy3_n1.png';
enemy3Imgs[1]=new Image();
enemy3Imgs[1].src='img/enemy3_n2.png';
enemy3Imgs[2]=new Image();
enemy3Imgs[2].src='img/enemy3_down1.png';
enemy3Imgs[3]=new Image();
enemy3Imgs[3].src='img/enemy3_down2.png';
enemy3Imgs[4]=new Image();
enemy3Imgs[4].src='img/enemy3_down3.png';
enemy3Imgs[5]=new Image();
enemy3Imgs[5].src='img/enemy3_down4.png';
enemy3Imgs[6]=new Image();
enemy3Imgs[6].src='img/enemy3_down5.png';
enemy3Imgs[7]=new Image();
enemy3Imgs[7].src='img/enemy3_down6.png';

function Enemy1(imgs){
	this.life=1;//一条命被撞击1次 坠毁
	this.crashed=false;//是否开始坠毁
	this.index=0;
	this.width=57;
	this.height=51;
	this.x=Math.random()*(WIDTH-this.width);
	this.y=-this.height;
	this.canDelete=false;//是否可以删除
	this.draw=function(){
		ctx.drawImage(imgs[this.index],this.x,this.y);
	}
	this.move=function(){
		this.y+=enemy1Speed;
		if(this.y>=HEIGHT){
			this.canDelete=true;
		}
		if(this.crashed){
			if(this.index===0){
				this.index=1;
			}else if(this.index>=imgs.length-1){
				this.canDelete=true;
			}else{
				this.index++;
			}
		}
	}
	this.hit=function(target){//target表撞击目标
		if((this.x+this.width>=target.x)
			&&(target.x+target.width>=this.x)
			&&(this.y+this.height>=target.y)
			&&(target.y+target.height>=this.y)){//碰撞成功
			target.crashed=true;
			this.life--;
			if(this.life<=0){
				this.crashed=true;
			}
		}
	}
}
function Enemy2(imgs){
	this.life=5;//2条命
	this.crashed=false;//是否开始坠毁
	this.index=0;
	this.width=69;
	this.height=95;
	this.x=Math.random()*(WIDTH-this.width);
	this.y=-this.height;
	this.canDelete=false;//是否可以删除
	this.draw=function(){
		ctx.drawImage(imgs[this.index],this.x,this.y);
	}
	this.move=function(){
		this.y+=enemy2Speed;
		if(this.y>=HEIGHT){
			this.canDelete=true;
		}
		if(this.crashed){
			if(this.index===0){
				this.index=1;
			}else if(this.index>=imgs.length-1){
				this.canDelete=true;
			}else{
				this.index++;
			}
		}
	}
	this.hit=function(target){//target表撞击目标
		if((this.x+this.width>=target.x)
			&&(target.x+target.width>=this.x)
			&&(this.y+this.height>=target.y)
			&&(target.y+target.height>=this.y)){//碰撞成功
			target.crashed=true;
			this.life--;
			if(this.life<=0){
				this.crashed=true;
			}
		}
	}
}
function Enemy3(imgs){
	this.life=5;//15条命
	this.crashed=false;//是否开始坠毁
	this.index=0;
	this.width=169;
	this.height=258;
	this.x=Math.random()*(WIDTH-this.width);
	this.y=-this.height;
	this.canDelete=false;//是否可以删除
	this.draw=function(){
		ctx.drawImage(imgs[this.index],this.x,this.y);
	}
	this.move=function(){
		if(this.index===1){
			this.index=0;
		}else if(this.index===0){
			this.index=1;
		}
		this.y+=enemy3Speed;
		if(this.y>=HEIGHT){
			this.canDelete=true;
		}
		if(this.crashed){
			if(this.index===0||this.index===1){
				this.index=2;
			}else if(this.index>=imgs.length-1){
				this.canDelete=true;
			}else{
				this.index++;
			}
		}
	}
	this.hit=function(target){//target表撞击目标
		if((this.x+this.width>=target.x)
			&&(target.x+target.width>=this.x)
			&&(this.y+this.height>=target.y)
			&&(target.y+target.height>=this.y)){//碰撞成功
			target.crashed=true;
			this.life--;
			if(this.life<=0){
				this.crashed=true;
			}
		}
	}
}
//敌机刘表
function EnemyList(){
	this.list=[];//保存所有的敌机
	this.draw=function(){
		this.generate();
		for(var i=0;i<this.list.length;i++){
			this.list[i].draw();
		}
	}
	this.move=function(){
		for(var i=0;i<this.list.length;i++){
			this.list[i].move();//敌机移动
			//敌机与我方子弹例表的碰撞检验
			for(var j=0;j<bulletList.list.length;j++){
				var b=bulletList.list[j];//我方的子弹
				this.list[i].hit(b);//碰撞检验
			}
			//敌机与我方英雄碰撞检验
			this.list[i].hit(hero);
			if(this.list[i].canDelete){
				this.list.splice(i,1);
				i--;
			}
		}
	}
	this.generate=function(){//生产一个新的敌机
		//敌机生成原则：随机生成，有时多些，有时少些
		//小号敌机最多，大号敌机最少。
		var num=Math.floor(Math.random()*difficulty);
		if(num===1){
			enemyList.list.push(new Enemy3(enemy3Imgs));
		}else if(num<=4){
			enemyList.list.push(new Enemy2(enemy2Imgs));
		}else if(num<=10){
			enemyList.list.push(new Enemy1(enemy1Imgs));
		}
	}
}
var enemyList=new EnemyList();
/***3.4绘制子弹碰撞敌机*/
//为每种敌机添加 life 表明生命值
//为每种敌机添加 crashed 表明是否开始 坠毁
//为每种敌机添加方法 hit 碰撞成功一次，减少一次生命值。直到生命值为0 坠毁；
//修改每种敌机的坠毁方法，若crashed为true则开始绘制敌机坠毁图
//修改EnenyList move方法，每个敌机移动时，都要检验一次碰撞


/***3.5绘制英雄碰撞敌机*/
//给英雄添加crashed属性。
//给英雄添加坠毁图片。
//修改英雄draw方法 只有不能移除时 才绘制英雄
//修改EnemyList.move方法。只要敌机移动检验是否与英雄撞击。
//添加英雄剩余命数全局变量heroLife.
//在画布右上角添加剩余命数的显示
function drawHeroLife(){
	var txt='Life: '+heroLife;
	var w=ctx.measureText(txt).width;
	ctx.font="20px '微软雅黑'";
	ctx.fillText(txt,WIDTH-w-15,20+6);
}

/******游戏第三阶段结束*****/
/********游戏进入第四阶段暂停阶段*********/
canvas.onmouseout=function(){
	if(curPhase=PHASE_PLAY){
		curPhase=PHASE_PAUSE;
	}
}
canvas.onmouseover=function(){
	if(curPhase=PHASE_PAUSE){
		curPhase=PHASE_PLAY;
	}
}
var pauseImg= new Image();
pauseImg.src='img/game_pause_nor.png';
function drawPause(){
	ctx.drawImage(pauseImg,(WIDTH-pauseImg.width)/2,(HEIGHT-pauseImg.height)/2);
}


/************第四阶段结束**************/

/**游戏第五阶段*/
function drawGameOver(){
	var txt='GAME OVER'
	ctx.font="blod 20px '微软雅黑'";
	var w=ctx.measureText(txt).width;
	ctx.fillText(txt,(WIDTH-w)/2,HEIGHT/2+50/2);
}
/*游戏第五阶段结束**/
/***游戏的主定时器**/
var timer = setInterval(function(){
	sky.draw();
	sky.move();
	switch(curPhase){
		case PHASE_READY:
			ctx.drawImage(logo,(WIDTH-logo.width)/2,(HEIGHT-logo.height)/2);
			break;
		case PHASE_LOADING:
			loading.draw();
			loading.move();
			break;
		case PHASE_PLAY:
			hero.draw();
			hero.move();
			bulletList.draw();
			bulletList.move();
			enemyList.draw();
			enemyList.move();
			drawHeroLife();
			break;
		case PHASE_PAUSE:
			hero.draw();
			bulletList.draw();
			enemyList.draw();
			drawHeroLife();
			drawPause();
			break;
		case PHASE_GAMEOVER:
			drawHeroLife();
			drawGameOver();
			break;
	}
},62);