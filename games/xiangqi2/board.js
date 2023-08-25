"use strict";
var res = document.getElementById("restart")
// �Ծֽ��
var RESULT_UNKNOWN = 0;	// δ֪
var RESULT_WIN = 1;		// Ӯ
var RESULT_DRAW = 2;	// ����
var RESULT_LOSS = 3;	// ��

var BOARD_WIDTH = 521;
var BOARD_HEIGHT = 577;
var SQUARE_SIZE = 57;
var SQUARE_LEFT = (BOARD_WIDTH - SQUARE_SIZE * 9) >> 1;
var SQUARE_TOP = (BOARD_HEIGHT - SQUARE_SIZE * 10) >> 1;
var THINKING_SIZE = 32;
var THINKING_LEFT = (BOARD_WIDTH - THINKING_SIZE) >> 1;
var THINKING_TOP = (BOARD_HEIGHT - THINKING_SIZE) >> 1;
var PIECE_NAME = [
  "oo", null, null, null, null, null, null, null,
  "rk", "ra", "rb", "rn", "rr", "rc", "rp", null,
  "bk", "ba", "bb", "bn", "br", "bc", "bp", null,
];

// ���Ӿ���������߿�ľ���
function SQ_X(sq) {
  return SQUARE_LEFT + (FILE_X(sq) - 3) * SQUARE_SIZE;
}

// ���Ӿ��������ϱ߿�ľ���
function SQ_Y(sq) {
  return SQUARE_TOP + (RANK_Y(sq) - 3) * SQUARE_SIZE;
}

function alertDelay(message) {
  setTimeout(function() {
    alert(message);
  }, 250);
}

function Board(container, images) {
  this.images = images;			// ͼƬ·��
  this.imgSquares = [];			// img���飬��Ӧ�����ϵ�90��λ������
  this.pos = new Position();
  //this.pos.fromFen("rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1");	// ����FEN����ʼ�����
  this.pos.fromFen("9/9/9/9/9/9/9/9/9/9 w - - 0 1");
  this.sqSelected = 0;			// ��ǰѡ�����ӵ�λ�ã����Ϊ0����ʾ��ǰû�����ӱ�ѡ�У�
  this.mvLast = 0;				// ��һ���߷�
  this.search = null;			// Search�����ʵ��
  this.computer = -1;			// this.computer = 0����ʾ����ִ�ڣ�this.computer = 1����ʾ����ִ��
  this.result = RESULT_UNKNOWN;	// �Ծֽ��
  this.busy = false;			// false-����״̬��true-��æ״̬��������Ӧ�û������

  var style = container.style;
  style.position = "relative";
  style.width = BOARD_WIDTH + "px";
  style.height = BOARD_HEIGHT + "px";
  style.background = "url(" + images + "board.jpg)";
  var this_ = this;
  for (var sq = 0; sq < 256; sq ++) {
    // �����������̵�256����
	
	// 1.�жϸõ��Ƿ�λ����ʵ����
	if (!IN_BOARD(sq)) {
      this.imgSquares.push(null);
      continue;
    }
	
	// 2.�����ϵ�90������ÿ�����򶼻ᶨ��һ����Ӧ��img��ǩ
    var img = document.createElement("img");
    var style = img.style;
    style.position = "absolute";
    style.left = SQ_X(sq);
    style.top = SQ_Y(sq);
    style.width = SQUARE_SIZE;
    style.height = SQUARE_SIZE;
    style.zIndex = 0;
	
	// 3.ÿ���������򶼻�󶨵���¼�������sq_��ʾ�˾����������򡣣������õ��ˡ��հ�����֪ʶ�ɣ�
    img.onmousedown = function(sq_) {
      return function() {
        this_.clickSquare(sq_);
      }
    } (sq);

	// 4.������õ�img��ǩ׷�ӵ�html��
    container.appendChild(img);
	
	// 5.��img��ǩ�洢��imgSquares�����У���������Ը�������в��������磬��ʾ��ͬ������ͼƬ��
	this.imgSquares.push(img);
  }
  
  // ����˼���е�ͼƬ��Ҳ����thinking.gif��
  this.thinking = document.createElement("img");
  this.thinking.src = images + "thinking.gif";
  style = this.thinking.style;
  style.visibility = "hidden";
  style.position = "absolute";
  style.left = THINKING_LEFT + "px";
  style.top = THINKING_TOP + "px";
  container.appendChild(this.thinking);

  // ��ʾ����ͼƬ
  this.flushBoard();
}

// ���������㷨
Board.prototype.setSearch = function(hashLevel) {
  this.search = hashLevel == 0 ? null : new Search(this.pos, hashLevel);
}

// ��ת����λ�ã�����ִ�죬Ҳ���ǵ������ߵ�ʱ�򣬻�Ѻ�����ʾ���������棬������ʾ�����棩
Board.prototype.flipped = function(sq) {
  return this.computer == 0 ? SQUARE_FLIP(sq) : sq;
}

// ����õ������壬����true�����򣬷���false
Board.prototype.computerMove = function() {
  return this.pos.sdPlayer == this.computer;
}

// �ж��ⲽ���Ƿ�Ϸ�������Ϸ�����ִ���ⲽ��
Board.prototype.addMove = function(mv, computerMove) {
  // �ж��ⲽ���Ƿ�Ϸ�
  if (!this.pos.legalMove(mv)) {
    return;
  }
  
  // ִ���ⲽ��
  if (!this.pos.makeMove(mv)) {
    return;
  }
  
  this.postAddMove(mv, computerMove);
}

Board.prototype.postAddMove = function(mv, computerMove) {
  // �����һ����ѡ�з���
  if (this.mvLast > 0) {
    this.drawSquare(SRC(this.mvLast), false);
    this.drawSquare(DST(this.mvLast), false);
  }

  // ��ʾ��һ�������ѡ�з���
  this.drawSquare(SRC(mv), true);
  this.drawSquare(DST(mv), true);
  
  this.sqSelected = 0;
  this.mvLast = mv;
  
  // �ж���Ϸ�Ƿ����
  if (this.pos.isMate()) {	// ������ߣ�ʵ���Ͼ��Ǳ�������
    this.result = computerMove ? RESULT_LOSS : RESULT_WIN;
	this.postMate(computerMove);
  }
  
  // �ж��Ƿ���ֳ���
  var vlRep = this.pos.repStatus(3);
  if (vlRep > 0) {
    vlRep = this.pos.repValue(vlRep);
    if (vlRep > -WIN_VALUE && vlRep < WIN_VALUE) {
      this.result = RESULT_DRAW;
      alertDelay("和局Tie!");
    } else if (computerMove == (vlRep < 0)) {
      this.result = RESULT_LOSS;
      alertDelay("和局tie!but you lost!");
    } else {
      this.result = RESULT_WIN;
      alertDelay("和局tie!but you won!");
    }
    this.busy = false;
    return;
  }
  
  // ���Ի�һ����
  this.response();
}

Board.prototype.postMate = function(computerMove) {
  alertDelay(computerMove ? "you lost！" : "you won！");
  this.busy = false;
}

// ���Ի�һ����
Board.prototype.response = function() {
  if (this.search == null || !this.computerMove()) {	// ��������Ϊnull���߲��õ�������
    this.busy = false;
    return;
  }
  this.thinking.style.visibility = "visible";			// ��ʾ����˼���е�ͼƬ
  var this_ = this;
  var mvResult = 0;
  this.busy = true;
  
  setTimeout(
    function() {
      var start = new Date().getTime();
      this_.addMove(board.search.searchMain(LIMIT_DEPTH, 1000), true);
      this_.thinking.style.visibility = "hidden";
      var end = new Date().getTime();
      var x=MillisecondToDate(end-start);
      inmp('AI计算花费用时:'+x);
      
  }, 250); 
}

// ������̵���Ӧ������������̣����ӻ��߿�λ�ã����ͻ���øú�����sq_�ǵ����λ��
Board.prototype.clickSquare = function(sq_) {
  if (this.busy || this.result != RESULT_UNKNOWN) {
    return;
  }
  var sq = this.flipped(sq_);		// �����λ�ã�����ǵ���ִ�죬λ���Ǳ���ת�ġ���ִ��һ��flipped��λ�þͱ���ת�����ˡ���
  var pc = this.pos.squares[sq];	// ���������
  if ((pc & SIDE_TAG(this.pos.sdPlayer)) != 0) {
    // ����˼������ӣ�ֱ��ѡ�и���
	
	if (this.mvLast != 0) {
      this.drawSquare(SRC(this.mvLast), false);
      this.drawSquare(DST(this.mvLast), false);
    }
    if (this.sqSelected) {
      this.drawSquare(this.sqSelected, false);
    }
    this.drawSquare(sq, true);
    this.sqSelected = sq;
  } else if (this.sqSelected > 0) {
    // ����Ĳ��Ǽ������ӣ��Է����ӻ������ӵ�λ�ã���������ѡ����(һ�����Լ�����)����ôִ������߷�
	this.addMove(MOVE(this.sqSelected, sq), false);
  }
}

// ��ʾsqλ�õ�����ͼƬ�������λ��û���ӣ�����ʾһ��͸����ͼƬ�����selectedΪtrue����Ҫ��ʾ����ѡ��ʱ�ı߿�
Board.prototype.drawSquare = function(sq, selected) {
  var img = this.imgSquares[this.flipped(sq)];
  img.src = this.images + PIECE_NAME[this.pos.squares[sq]] + ".gif";
  img.style.backgroundImage = selected ? "url(" + this.images + "oos.gif)" : "";
}

// ������ʾ�����ϵ�����
Board.prototype.flushBoard = function() {
  for (var sq = 0; sq < 256; sq ++) {
    if (IN_BOARD(sq)) {
      this.drawSquare(sq);
    }
  }
}

// ������¿�ʼ
Board.prototype.restart = function(fen) {
  if (this.busy) {				// ��������˼���У�����Ӧ�κε���¼�
    return;
  }

  this.result = RESULT_UNKNOWN;	// ���öԾֽ��Ϊ��δ֪��
  this.pos.fromFen(fen);		// �����û�ѡ��ľ������¿�ʼ
  this.flushBoard();			// ������ʾ����
  this.response();				// �������ִ�����ߣ����Զ��߲��塣
}

// ����
Board.prototype.retract = function() {
  if (this.busy) {
    return;
  }

  // ���öԾֽ��Ϊ��δ֪��
  this.result = RESULT_UNKNOWN;
  
  // ����߷����鲻Ϊ�գ���ô�ͳ���һ����
  if (this.pos.mvList.length > 1) {
    this.pos.undoMakeMove();
  }
  
  // ����߷����鲻Ϊ�գ����Ҹõ������壬��ô��Ҫ�ٳ���һ����
  if (this.pos.mvList.length > 1 && this.computerMove()) {
    this.pos.undoMakeMove();
  }

  this.flushBoard();
  this.response();
};


function MillisecondToDate(msd) {
  var time = parseFloat(msd) / 1000; //先将毫秒转化成秒
  if (null != time && "" != time) {
      if (time > 60 && time < 60 * 60) {
          time = parseInt(time / 60.0) + "min" + parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60) + "s";
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
          time = parseInt(time / 3600.0) + "h" + parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) + "min" + parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) - parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "s";
      } else {
          time = parseInt(time) + "s";
      }
  }
  return time;
};
