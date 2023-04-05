"use strict";

// ���ַ�����
function binarySearch(vlss, vl) {
  var low = 0;
  var high = vlss.length - 1;
  while (low <= high) {
    var mid = (low + high) >> 1;
    if (vlss[mid][0] < vl) {
      low = mid + 1;
    } else if (vlss[mid][0] > vl) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
}

var MATE_VALUE = 10000;				// ��߷�ֵ
var BAN_VALUE = MATE_VALUE - 100;	// �����и��ķ�ֵ
var WIN_VALUE = MATE_VALUE - 200;	// Ӯ���ֵ�����ڴ˷�ֵ����Ӯ�壩
var DRAW_VALUE = 20;				// ����ʱ���صķ���(ȡ��ֵ)
var NULL_SAFE_MARGIN = 400;			// �ղ��ü���Ч����С����
var NULL_OKAY_MARGIN = 200;			// ���Խ��пղ��ü�����С����
var ADVANCED_VALUE = 3;				// ����Ȩ��ֵ

// ���ӱ��
var PIECE_KING = 0;		// ��
var PIECE_ADVISOR = 1;	// ʿ
var PIECE_BISHOP = 2;	// ��
var PIECE_KNIGHT = 3;	// ��
var PIECE_ROOK = 4;		// ��
var PIECE_CANNON = 5;	// ��
var PIECE_PAWN = 6;		// ��

// ���̷�Χ
var RANK_TOP = 3;
var RANK_BOTTOM = 12;
var FILE_LEFT = 3;
var FILE_RIGHT = 11;

var ADD_PIECE = false;
var DEL_PIECE = true;

var IN_BOARD_ = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var IN_FORT_ = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

var LEGAL_SPAN = [
                       0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0,
];

var KNIGHT_PIN_ = [
                              0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,-16,  0,-16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0, -1,  0,  0,  0,  1,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0, 16,  0, 16,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  0,  0,  0,  0,  0,  0,  0,
];

var KING_DELTA = [-16, -1, 1, 16];
var ADVISOR_DELTA = [-17, -15, 15, 17];
var KNIGHT_DELTA = [[-33, -31], [-18, 14], [-14, 18], [31, 33]];
var KNIGHT_CHECK_DELTA = [[-33, -18], [-31, -14], [14, 31], [18, 33]];
var MVV_VALUE = [50, 10, 10, 30, 40, 30, 20, 0];	// MVV/LVAÿ�������ļ�ֵ

// ����λ�ü�ֵ����
var PIECE_VALUE = [
  [	// 
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  9,  9,  9, 11, 13, 11,  9,  9,  9,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 34, 42, 44, 42, 34, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 32, 37, 37, 37, 32, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 23, 27, 29, 30, 29, 27, 23, 19,  0,  0,  0,  0,
    0,  0,  0, 14, 18, 20, 27, 29, 27, 20, 18, 14,  0,  0,  0,  0,
    0,  0,  0,  7,  0, 13,  0, 16,  0, 13,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  7,  0,  7,  0, 15,  0,  7,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0, 11, 15, 11,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20,  0,  0,  0, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 18,  0,  0, 20, 23, 20,  0,  0, 18,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20, 20,  0, 20, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20,  0,  0,  0, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 18,  0,  0, 20, 23, 20,  0,  0, 18,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0, 23,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0, 20, 20,  0, 20, 20,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0, 90, 90, 90, 96, 90, 96, 90, 90, 90,  0,  0,  0,  0,
    0,  0,  0, 90, 96,103, 97, 94, 97,103, 96, 90,  0,  0,  0,  0,
    0,  0,  0, 92, 98, 99,103, 99,103, 99, 98, 92,  0,  0,  0,  0,
    0,  0,  0, 93,108,100,107,100,107,100,108, 93,  0,  0,  0,  0,
    0,  0,  0, 90,100, 99,103,104,103, 99,100, 90,  0,  0,  0,  0,
    0,  0,  0, 90, 98,101,102,103,102,101, 98, 90,  0,  0,  0,  0,
    0,  0,  0, 92, 94, 98, 95, 98, 95, 98, 94, 92,  0,  0,  0,  0,
    0,  0,  0, 93, 92, 94, 95, 92, 95, 94, 92, 93,  0,  0,  0,  0,
    0,  0,  0, 85, 90, 92, 93, 78, 93, 92, 90, 85,  0,  0,  0,  0,
    0,  0,  0, 88, 85, 90, 88, 90, 88, 90, 85, 88,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,206,208,207,213,214,213,207,208,206,  0,  0,  0,  0,
    0,  0,  0,206,212,209,216,233,216,209,212,206,  0,  0,  0,  0,
    0,  0,  0,206,208,207,214,216,214,207,208,206,  0,  0,  0,  0,
    0,  0,  0,206,213,213,216,216,216,213,213,206,  0,  0,  0,  0,
    0,  0,  0,208,211,211,214,215,214,211,211,208,  0,  0,  0,  0,
    0,  0,  0,208,212,212,214,215,214,212,212,208,  0,  0,  0,  0,
    0,  0,  0,204,209,204,212,214,212,204,209,204,  0,  0,  0,  0,
    0,  0,  0,198,208,204,212,212,212,204,208,198,  0,  0,  0,  0,
    0,  0,  0,200,208,206,212,200,212,206,208,200,  0,  0,  0,  0,
    0,  0,  0,194,206,204,212,200,212,204,206,194,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,100,100, 96, 91, 90, 91, 96,100,100,  0,  0,  0,  0,
    0,  0,  0, 98, 98, 96, 92, 89, 92, 96, 98, 98,  0,  0,  0,  0,
    0,  0,  0, 97, 97, 96, 91, 92, 91, 96, 97, 97,  0,  0,  0,  0,
    0,  0,  0, 96, 99, 99, 98,100, 98, 99, 99, 96,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 96, 96,100, 96, 96, 96, 96,  0,  0,  0,  0,
    0,  0,  0, 95, 96, 99, 96,100, 96, 99, 96, 95,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 96, 96, 96, 96, 96, 96, 96,  0,  0,  0,  0,
    0,  0,  0, 97, 96,100, 99,101, 99,100, 96, 97,  0,  0,  0,  0,
    0,  0,  0, 96, 97, 98, 98, 98, 98, 98, 97, 96,  0,  0,  0,  0,
    0,  0,  0, 96, 96, 97, 99, 99, 99, 97, 96, 96,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ], [	
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  9,  9,  9, 11, 13, 11,  9,  9,  9,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 34, 42, 44, 42, 34, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 24, 32, 37, 37, 37, 32, 24, 19,  0,  0,  0,  0,
    0,  0,  0, 19, 23, 27, 29, 30, 29, 27, 23, 19,  0,  0,  0,  0,
    0,  0,  0, 14, 18, 20, 27, 29, 27, 20, 18, 14,  0,  0,  0,  0,
    0,  0,  0,  7,  0, 13,  0, 16,  0, 13,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  7,  0,  7,  0, 15,  0,  7,  0,  7,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  2,  2,  2,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0, 11, 15, 11,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  ],
];

// �ж�ĳλ���Ƿ�������
function IN_BOARD(sq) {
  return IN_BOARD_[sq] != 0;
}

// �ж�ĳλ���Ƿ��ھŹ�
function IN_FORT(sq) {
  return IN_FORT_[sq] != 0;
}

// ����һά���󣬻�ȡ��ά��������
function RANK_Y(sq) {
  return sq >> 4;
}

// ����һά���󣬻�ȡ��ά��������
function FILE_X(sq) {
  return sq & 15;
}

// ����ά����ת��Ϊһά����
function COORD_XY(x, y) {
  return x + (y << 4);
}

function SQUARE_FLIP(sq) {
  return 254 - sq;
}

function FILE_FLIP(x) {
  return 14 - x;
}

function CHR(n) {
  return String.fromCharCode(n);
}

function ASC(c) {
  return c.charCodeAt(0);
}

function CHAR_TO_PIECE(c) {
  switch (c) {
  case "K":
    return PIECE_KING;
  case "A":
    return PIECE_ADVISOR;
  case "B":
    return PIECE_BISHOP;
  case "N":
    return PIECE_KNIGHT;
  case "R":
    return PIECE_ROOK;
  case "C":
    return PIECE_CANNON;
  case "P":
    return PIECE_PAWN;
  default:
    return -1;
  }
}

// ��ú�ڱ��(������8��������16)
function SIDE_TAG(sd) {
  return 8 + (sd << 3);
}

// ��öԷ���ڱ��
function OPP_SIDE_TAG(sd) {
  return 16 - (sd << 3);
}

// ��ȡ�߷������
function SRC(mv) {
  return mv & 255;
}

// ��ȡ�߷����յ�
function DST(mv) {
  return mv >> 8;
}

// ��һ���߷��������յ㣬ת��Ϊһ����������
function MOVE(sqSrc, sqDst) {
  return sqSrc + (sqDst << 8);
}

function MIRROR_MOVE(mv) {
  return MOVE(MIRROR_SQUARE(SRC(mv)), MIRROR_SQUARE(DST(mv)));
}

// ��MVV/LVAֵ
function MVV_LVA(pc, lva) {
  return MVV_VALUE[pc & 7] - lva;
}

function MIRROR_SQUARE(sq) {
  return COORD_XY(FILE_FLIP(FILE_X(sq)), RANK_Y(sq));
}

// sp������λ�ã�sd�����巽���췽0���ڷ�1�������ر����䣩��ǰ��һ����λ�á�
function SQUARE_FORWARD(sq, sd) {
  return sq - 16 + (sd << 5);
}

// У�齫��˧�����߷�
function KING_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] == 1;
}

// ����ʿ���ˣ����߷�
function ADVISOR_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] == 2;
}

// У�����ࣩ���߷�
function BISHOP_SPAN(sqSrc, sqDst) {
  return LEGAL_SPAN[sqDst - sqSrc + 256] == 3;
}

// ���۵�λ��
function BISHOP_PIN(sqSrc, sqDst) {
  return (sqSrc + sqDst) >> 1;
}
// ��������߷��Ϸ����򷵻���Ӧ���ŵ�λ�á����򷵻�sqSrc��
function KNIGHT_PIN(sqSrc, sqDst) {
  return sqSrc + KNIGHT_PIN_[sqDst - sqSrc + 256];
}

// sp������λ�ã�sd�����巽���췽0���ڷ�1���������λ��δ���ӣ��򷵻�true�����򷵻�false��
function HOME_HALF(sq, sd) {
  return (sq & 0x80) != (sd << 7);
}

// sp������λ�ã�sd�����巽���췽0���ڷ�1���������λ���ѹ��ӣ��򷵻�true�����򷵻�false��
function AWAY_HALF(sq, sd) {
  return (sq & 0x80) == (sd << 7);
}

// ��������sqSrc���յ�sqDstû�й��ӣ��򷵻�true�����򷵻�false
function SAME_HALF(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0x80) == 0;
}

// ���sqSrc��sqDst��ͬһ���򷵻�true�����򷵻�false
function SAME_RANK(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0xf0) == 0;
}

// ���sqSrc��sqDst��ͬһ���򷵻�true�����򷵻�false
function SAME_FILE(sqSrc, sqDst) {
  return ((sqSrc ^ sqDst) & 0x0f) == 0;
}

function RC4(key) {
  this.x = this.y = 0;
  this.state = [];
  for (var i = 0; i < 256; i ++) {
    this.state.push(i);
  }
  var j = 0;
  for (var i = 0; i < 256; i ++) {
    j = (j + this.state[i] + key[i % key.length]) & 0xff;
    this.swap(i, j);
  }
}

RC4.prototype.swap = function(i, j) {
  var t = this.state[i];
  this.state[i] = this.state[j];
  this.state[j] = t;
}

RC4.prototype.nextByte = function() {
  this.x = (this.x + 1) & 0xff;
  this.y = (this.y + this.state[this.x]) & 0xff;
  this.swap(this.x, this.y);
  var t = (this.state[this.x] + this.state[this.y]) & 0xff;
  return this.state[t];
}

// ����32λ�����
RC4.prototype.nextLong = function() {
  var n0 = this.nextByte();
  var n1 = this.nextByte();
  var n2 = this.nextByte();
  var n3 = this.nextByte();
  return n0 + (n1 << 8) + (n2 << 16) + ((n3 << 24) & 0xffffffff);
}

var PreGen_zobristKeyPlayer, PreGen_zobristLockPlayer;
var PreGen_zobristKeyTable = [], PreGen_zobristLockTable = [];

var rc4 = new RC4([0]);
PreGen_zobristKeyPlayer = rc4.nextLong();
rc4.nextLong();
PreGen_zobristLockPlayer = rc4.nextLong();
for (var i = 0; i < 14; i ++) {
  var keys = [];
  var locks = [];
  for (var j = 0; j < 256; j ++) {
    keys.push(rc4.nextLong());
    rc4.nextLong();
    locks.push(rc4.nextLong());
  }
  PreGen_zobristKeyTable.push(keys);
  PreGen_zobristLockTable.push(locks);
}

function Position() {
  
}

// ��ʼ���������
Position.prototype.clearBoard = function() {
  this.sdPlayer = 0;	// ��˭���塣0-�췽��1-�ڷ�
  this.squares = [];	// �������һά�������
  for (var sq = 0; sq < 256; sq ++) {
    this.squares.push(0);
  }
  this.zobristKey = this.zobristLock = 0;
  this.vlWhite = this.vlBlack = 0;
}

Position.prototype.setIrrev = function() {
  this.mvList = [0];				// ���ÿ���߷�������
  this.pcList = [0];				// ���ÿ�����Ե����ӡ����û�����ӱ��ԣ���ŵ���0
  this.keyList = [0];				// ���zobristKeyУ����
  this.chkList = [this.checked()];	// �Ƿ񱻽���
  this.distance = 0;				// ���������
}

// ��FEN��תΪһά���飬��ʼ�����
Position.prototype.fromFen = function(fen) {
  this.clearBoard();
  var y = RANK_TOP;
  var x = FILE_LEFT;
  var index = 0;
  if (index == fen.length) {
    this.setIrrev();
    return;
  }
  var c = fen.charAt(index);
  while (c != " ") {
    if (c == "/") {
      x = FILE_LEFT;
      y ++;
      if (y > RANK_BOTTOM) {
        break;
      }
    } else if (c >= "1" && c <= "9") {
      x += (ASC(c) - ASC("0"));
    } else if (c >= "A" && c <= "Z") {
      if (x <= FILE_RIGHT) {
        var pt = CHAR_TO_PIECE(c);
        if (pt >= 0) {
          this.addPiece(COORD_XY(x, y), pt + 8);
        }
        x ++;
      }
    } else if (c >= "a" && c <= "z") {
      if (x <= FILE_RIGHT) {
        var pt = CHAR_TO_PIECE(CHR(ASC(c) + ASC("A") - ASC("a")));
        if (pt >= 0) {
          this.addPiece(COORD_XY(x, y), pt + 16);
        }
        x ++;
      }
    }
    index ++;
    if (index == fen.length) {
      this.setIrrev();
	  return;
    }
    c = fen.charAt(index);
  }
  index ++;
  if (index == fen.length) {
    this.setIrrev();
	return;
  }

  this.setIrrev();
}

// ������ֵ������߷���vls��Ϊnullʱ�����ɳ����߷�
Position.prototype.generateMoves = function(vls) {
  var mvs = [];
  var pcSelfSide = SIDE_TAG(this.sdPlayer);
  var pcOppSide = OPP_SIDE_TAG(this.sdPlayer);
  for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {
    var pcSrc = this.squares[sqSrc];
    if ((pcSrc & pcSelfSide) == 0) {
      continue;
    }
    switch (pcSrc - pcSelfSide) {
    case PIECE_KING:
      for (var i = 0; i < 4; i ++) {
        var sqDst = sqSrc + KING_DELTA[i];
        if (!IN_FORT(sqDst)) {
          continue;
        }
        var pcDst = this.squares[sqDst];
        if (vls == null) {
          if ((pcDst & pcSelfSide) == 0) {
            mvs.push(MOVE(sqSrc, sqDst));
          }
        } else if ((pcDst & pcOppSide) != 0) {	// Ŀ��λ�ô��ڶԷ����ӣ�����Ҫ���ɳ����߷���
          mvs.push(MOVE(sqSrc, sqDst));			// �洢�����߷�
          vls.push(MVV_LVA(pcDst, 5));			// �ó����߷��ķ�ֵ��MVV/LVA������
        }
      }
      break;
    case PIECE_ADVISOR:
      for (var i = 0; i < 4; i ++) {
        var sqDst = sqSrc + ADVISOR_DELTA[i];
        if (!IN_FORT(sqDst)) {
          continue;
        }
        var pcDst = this.squares[sqDst];
        if (vls == null) {
          if ((pcDst & pcSelfSide) == 0) {
            mvs.push(MOVE(sqSrc, sqDst));
          }
        } else if ((pcDst & pcOppSide) != 0) {
          mvs.push(MOVE(sqSrc, sqDst));
          vls.push(MVV_LVA(pcDst, 1));
        }
      }
      break;
    case PIECE_BISHOP:
      for (var i = 0; i < 4; i ++) {	// ���4������
        var sqDst = sqSrc + ADVISOR_DELTA[i];
        if (!(IN_BOARD(sqDst) && HOME_HALF(sqDst, this.sdPlayer) &&
            this.squares[sqDst] == 0)) {	//	����������
          continue;
        }
        sqDst += ADVISOR_DELTA[i];
        var pcDst = this.squares[sqDst];
        if (vls == null) {
          if ((pcDst & pcSelfSide) == 0) {
            mvs.push(MOVE(sqSrc, sqDst));
          }
        } else if ((pcDst & pcOppSide) != 0) {
          mvs.push(MOVE(sqSrc, sqDst));
          vls.push(MVV_LVA(pcDst, 1));
        }
      }
      break;
    case PIECE_KNIGHT:
      for (var i = 0; i < 4; i ++) {
        var sqDst = sqSrc + KING_DELTA[i];
        if (this.squares[sqDst] > 0) {
          continue;
        }
        for (var j = 0; j < 2; j ++) {
          sqDst = sqSrc + KNIGHT_DELTA[i][j];
          if (!IN_BOARD(sqDst)) {
            continue;
          }
          var pcDst = this.squares[sqDst];
          if (vls == null) {
            if ((pcDst & pcSelfSide) == 0) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else if ((pcDst & pcOppSide) != 0) {
            mvs.push(MOVE(sqSrc, sqDst));
            vls.push(MVV_LVA(pcDst, 1));
          }
        }
      }
      break;
    case PIECE_ROOK:
      for (var i = 0; i < 4; i ++) {
        var delta = KING_DELTA[i];
        var sqDst = sqSrc + delta;
        while (IN_BOARD(sqDst)) {
          var pcDst = this.squares[sqDst];
          if (pcDst == 0) {
            if (vls == null) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else {
            if ((pcDst & pcOppSide) != 0) {
              mvs.push(MOVE(sqSrc, sqDst));
              if (vls != null) {
                vls.push(MVV_LVA(pcDst, 4));
              }
            }
            break;
          }
          sqDst += delta;
        }
      }
      break;
    case PIECE_CANNON:
      for (var i = 0; i < 4; i ++) {
        var delta = KING_DELTA[i];
        var sqDst = sqSrc + delta;
        while (IN_BOARD(sqDst)) {
          var pcDst = this.squares[sqDst];
          if (pcDst == 0) {
            if (vls == null) {
              mvs.push(MOVE(sqSrc, sqDst));
            }
          } else {
            break;
          }
          sqDst += delta;
        }
        sqDst += delta;
        while (IN_BOARD(sqDst)) {
          var pcDst = this.squares[sqDst];
          if (pcDst > 0) {
            if ((pcDst & pcOppSide) != 0) {
              mvs.push(MOVE(sqSrc, sqDst));
              if (vls != null) {
                vls.push(MVV_LVA(pcDst, 4));
              }
            }
            break;
          }
          sqDst += delta;
        }
      }
      break;
    case PIECE_PAWN:
      var sqDst = SQUARE_FORWARD(sqSrc, this.sdPlayer);
      if (IN_BOARD(sqDst)) {
        var pcDst = this.squares[sqDst];
        if (vls == null) {
          if ((pcDst & pcSelfSide) == 0) {
            mvs.push(MOVE(sqSrc, sqDst));
          }
        } else if ((pcDst & pcOppSide) != 0) {
          mvs.push(MOVE(sqSrc, sqDst));
          vls.push(MVV_LVA(pcDst, 2));
        }
      }
      if (AWAY_HALF(sqSrc, this.sdPlayer)) {
        for (var delta = -1; delta <= 1; delta += 2) {
          sqDst = sqSrc + delta;
          if (IN_BOARD(sqDst)) {
            var pcDst = this.squares[sqDst];
            if (vls == null) {
              if ((pcDst & pcSelfSide) == 0) {
                mvs.push(MOVE(sqSrc, sqDst));
              }
            } else if ((pcDst & pcOppSide) != 0) {
              mvs.push(MOVE(sqSrc, sqDst));
              vls.push(MVV_LVA(pcDst, 2));
            }
          }
        }
      }
      break;
    }
  }
  return mvs;
}

// �жϲ����Ƿ�Ϸ������򷵻�true�����򷵻�false
Position.prototype.legalMove = function(mv) {
  var sqSrc = SRC(mv);						// ��ȡ�߷������λ��
  var pcSrc = this.squares[sqSrc];			// ��ȡ���λ�õ�����
  var pcSelfSide = SIDE_TAG(this.sdPlayer);	// ��ڱ��(������8��������16) 
  
  if ((pcSrc & pcSelfSide) == 0) {
    // ���λ�õ����ӣ����Ǳ������ӡ����ǶԷ����ӣ����߸���û�����ӣ�
	return false;
  }

  var sqDst = DST(mv);				// ��ȡ�߷����յ�λ��
  var pcDst = this.squares[sqDst];	// ��ȡ�յ�λ�õ�����
  
  if ((pcDst & pcSelfSide) != 0) {
    // �յ�λ�������ӣ������Ǳ�������
	return false;
  }

  switch (pcSrc - pcSelfSide) {
  case PIECE_KING:		// ��������ǽ���˧����У���߷�
    return IN_FORT(sqDst) && KING_SPAN(sqSrc, sqDst);
  case PIECE_ADVISOR:	// ����������ˣ��ˣ���У���߷�
    return IN_FORT(sqDst) && ADVISOR_SPAN(sqSrc, sqDst);
  case PIECE_BISHOP:	// ������������ࣩ��У���߷�
    return SAME_HALF(sqSrc, sqDst) && BISHOP_SPAN(sqSrc, sqDst) &&
        this.squares[BISHOP_PIN(sqSrc, sqDst)] == 0;
  case PIECE_KNIGHT:	// �������������У���߷�
    var sqPin = KNIGHT_PIN(sqSrc, sqDst);
    return sqPin != sqSrc && this.squares[sqPin] == 0;
  case PIECE_ROOK:		// ��������ǳ���У���߷�
  case PIECE_CANNON:	// ����������ڣ�У���߷�
    var delta;			// ��ʶ���ĸ���������
    if (SAME_RANK(sqSrc, sqDst)) {
	  // �����յ�λ��ͬһ�С��ٸ��������յ�Ĵ�С��ϵ���жϾ��������ĸ��������塣
      delta = (sqDst < sqSrc ? -1 : 1);
    } else if (SAME_FILE(sqSrc, sqDst)) {
	  // �����յ�λ��ͬһ�С��ٸ��������յ�Ĵ�С��ϵ���жϾ��������ĸ��������塣
      delta = (sqDst < sqSrc ? -16 : 16);
    } else {
	  // �����յ㲻��ͬһ�У�Ҳ����ͬһ�С��߷��ǷǷ��ġ�
      return false;
    }
    var sqPin = sqSrc + delta;	// ���ŷ���delta��һ����
    while (sqPin != sqDst && this.squares[sqPin] == 0) {
      // �ط���deltaһ������ǰ�ߣ�ֱ���������ӣ�����sqPin�ߵ����յ��λ����
	  sqPin += delta;
    }
    if (sqPin == sqDst) {
	  // ����յ�û�����ӣ������ǳ������ڣ��ⲽ�嶼�ǺϷ��ġ�����ǳ��������յ���û�����ӣ��Է����ӣ����ⲽ�嶼�Ϸ���
      return pcDst == 0 || pcSrc - pcSelfSide == PIECE_ROOK;
    }
	// ��ʱ�Ѿ���ɽ���յ���������ӣ�������������ڣ������ⲽ�岻�Ϸ�
    if (pcDst == 0 || pcSrc - pcSelfSide != PIECE_CANNON) {
      return false;
    }
    sqPin += delta;
    while (sqPin != sqDst && this.squares[sqPin] == 0) {
      sqPin += delta;
    }
    return sqPin == sqDst;
  case PIECE_PAWN:
    // ���ѹ��ӣ��������������������ߵ�
    if (AWAY_HALF(sqDst, this.sdPlayer) && (sqDst == sqSrc - 1 || sqDst == sqSrc + 1)) {
      return true;
    }
	// �жϱ��ǲ�������ǰ��
    return sqDst == SQUARE_FORWARD(sqSrc, this.sdPlayer);
  default:
    return false;
  }
}

/**
* �жϽ���˧���Ƿ񱻶Է�������
* @return boolean true-������ false-û�б�����
*/
Position.prototype.checked = function() {
  var pcSelfSide = SIDE_TAG(this.sdPlayer);		// ������ڱ��
  var pcOppSide = OPP_SIDE_TAG(this.sdPlayer);	// �Է���ڱ��
  for (var sqSrc = 0; sqSrc < 256; sqSrc ++) {
    // ����������飬ֱ�����������Ľ���˧��
	if (this.squares[sqSrc] != pcSelfSide + PIECE_KING) {
      continue;
    }
    
	// �ж϶Է��������Ƿ�ṥ���������Ͻ�
	if (this.squares[SQUARE_FORWARD(sqSrc, this.sdPlayer)] == pcOppSide + PIECE_PAWN) {
      return true;
    }
	// �ж϶Է�ƽ����ǰ���ǲ��ѹ��ӣ����Ƿ�ṥ���������Ͻ�
    for (var delta = -1; delta <= 1; delta += 2) {
      if (this.squares[sqSrc + delta] == pcOppSide + PIECE_PAWN) {
        return true;
      }
    }
	
	// �ж϶Է����Ƿ񹥻��������Ͻ�
    for (var i = 0; i < 4; i ++) {
      if (this.squares[sqSrc + ADVISOR_DELTA[i]] != 0) {	// �������ӣ����ú���Ŷ
        continue;
      }
      for (var j = 0; j < 2; j ++) {
        var pcDst = this.squares[sqSrc + KNIGHT_CHECK_DELTA[i][j]];
        if (pcDst == pcOppSide + PIECE_KNIGHT) {
          return true;
        }
      }
    }
	
	// �ж϶Է��ĳ������ǹ������˼����Ͻ����Լ���˧�Ƿ����
    for (var i = 0; i < 4; i ++) {
      var delta = KING_DELTA[i];
      var sqDst = sqSrc + delta;
      while (IN_BOARD(sqDst)) {
        var pcDst = this.squares[sqDst];
        if (pcDst > 0) {
          if (pcDst == pcOppSide + PIECE_ROOK || pcDst == pcOppSide + PIECE_KING) {	// �Է����ܹ��������Ͻ������߽�˧������
            return true;
          }
          break;
        }
        sqDst += delta;
      }
      sqDst += delta;
      while (IN_BOARD(sqDst)) {
        var pcDst = this.squares[sqDst];
        if (pcDst > 0) {
          if (pcDst == pcOppSide + PIECE_CANNON) {
            return true;
          }
          break;
        }
        sqDst += delta;
      }
    }
    return false;
  }
  return false;
}

// ������ߵĻ�������true�����򷵻�false
Position.prototype.isMate = function() {
  var mvs = this.generateMoves(null);
  for (var i = 0; i < mvs.length; i ++) {
    if (this.makeMove(mvs[i])) {
      this.undoMakeMove();
      return false;
    }
  }
  return true;
}

// ���������ȵ������ֵ
Position.prototype.mateValue = function() {
  return this.distance - MATE_VALUE;
}

// ���������ȵĳ����и���ֵ
Position.prototype.banValue = function() {
  return this.distance - BAN_VALUE;
}

// �����ֵ
Position.prototype.drawValue = function() {
  return (this.distance & 1) == 0 ? -DRAW_VALUE : DRAW_VALUE;
}

// ĳ���߹������Ƿ񱻽���
Position.prototype.inCheck = function() {
  return this.chkList[this.chkList.length - 1];
}

//��ĳ���߹����壬�Ƿ��ǳ����߷�
Position.prototype.captured = function() {
  return this.pcList[this.pcList.length - 1] > 0;
}

// �����ظ�����ʱ�����صķ�ֵ
Position.prototype.repValue = function(vlRep) {
  var vlReturn = ((vlRep & 2) == 0 ? 0 : this.banValue()) +
      ((vlRep & 4) == 0 ? 0 : -this.banValue());
  return vlReturn == 0 ? this.drawValue() : vlReturn;
}

// �ж��Ƿ�����ظ�����
Position.prototype.repStatus = function(recur_) {
  var recur = recur_;
  var selfSide = false;
  var perpCheck = true;
  var oppPerpCheck = true;
  var index = this.mvList.length - 1;
  while (this.mvList[index] > 0 && this.pcList[index] == 0) {
	if (selfSide) {
      perpCheck = perpCheck && this.chkList[index];
      if (this.keyList[index] == this.zobristKey) {	// ���ǳ���ѭ��������
        recur --;
        if (recur == 0) {
          return 1 + (perpCheck ? 2 : 0) + (oppPerpCheck ? 4 : 0);
        }
      }
    } else {
      oppPerpCheck = oppPerpCheck && this.chkList[index];
    }
    selfSide = !selfSide;
    index --;
  }
  return 0;
}

// �л����巽
Position.prototype.changeSide = function() {
  this.sdPlayer = 1 - this.sdPlayer;
  this.zobristKey ^= PreGen_zobristKeyPlayer;
  this.zobristLock ^= PreGen_zobristLockPlayer;
}

// ��һ����
Position.prototype.makeMove = function(mv) {
  var zobristKey = this.zobristKey;
  this.movePiece(mv);
  
  // ��������Ƿ񱻽���������ǣ�˵���������������������岢����false��
  if (this.checked()) {	
    this.undoMovePiece(mv);
    return false;
  }
  this.keyList.push(zobristKey);		// �洢�����zobristKeyУ����
  this.changeSide();					// �л����巽
  this.chkList.push(this.checked());	// �洢������󣬶Է��Ƿ��ڱ�������״̬
  this.distance ++;						// �������+1
  return true;
}

// ȡ����һ��������
Position.prototype.undoMakeMove = function() {
  this.distance --;		// ������ȼ�1
  this.chkList.pop();
  this.changeSide();	// �л����巽
  this.keyList.pop();
  this.undoMovePiece();	// ȡ����һ��������
}

// �ղ�����
Position.prototype.nullMove = function() {
  this.mvList.push(0);
  this.pcList.push(0);
  this.keyList.push(this.zobristKey);
  this.changeSide();
  this.chkList.push(false);
  this.distance ++;
}

// ������һ���Ŀղ�����
Position.prototype.undoNullMove = function() {
  this.distance --;
  this.chkList.pop();
  this.changeSide();
  this.keyList.pop();
  this.pcList.pop();
  this.mvList.pop();
}

// �����߷��ƶ����ӣ�ɾ���յ�λ�õ����ӣ������λ�õ����ӷ������յ��λ�á�
Position.prototype.movePiece = function(mv) {
  var sqSrc = SRC(mv);
  var sqDst = DST(mv);
  var pc = this.squares[sqDst];
  this.pcList.push(pc);
  if (pc > 0) {
    // ����յ������ӣ���Ҫɾ��������
    this.addPiece(sqDst, pc, DEL_PIECE);
  }
  pc = this.squares[sqSrc];
  this.addPiece(sqSrc, pc, DEL_PIECE);	// ɾ���������
  this.addPiece(sqDst, pc, ADD_PIECE);	// ��ԭ�������������ӵ��յ�
  this.mvList.push(mv);
}

// ȡ����һ�������ӵ��ƶ�
Position.prototype.undoMovePiece = function() {
  var mv = this.mvList.pop();
  var sqSrc = SRC(mv);
  var sqDst = DST(mv);
  var pc = this.squares[sqDst];
  this.addPiece(sqDst, pc, DEL_PIECE);	// ɾ���յ�����
  this.addPiece(sqSrc, pc, ADD_PIECE);	// ���յ�λ�õ��������ӵ����
  pc = this.pcList.pop();
  if (pc > 0) {
    // �ⲽ�巢���˳��ӣ���Ҫ�ѳԵ������ӷŻ��յ�λ��
    this.addPiece(sqDst, pc, ADD_PIECE);
  }
}

// ���bDelΪfalse��������pc���ӽ�����е�spλ�ã����bDelΪtrue����ɾ��spλ�õ����ӡ�
Position.prototype.addPiece = function(sq, pc, bDel) {
  var pcAdjust;
  
  // ���ӻ�ɾ������
  this.squares[sq] = bDel ? 0 : pc;
  
  // ���º��˫��������ֵ
  if (pc < 16) {
    pcAdjust = pc - 8;
    this.vlWhite += bDel ? -PIECE_VALUE[pcAdjust][sq] :
        PIECE_VALUE[pcAdjust][sq];
  } else {
    pcAdjust = pc - 16;
    this.vlBlack += bDel ? -PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)] :
        PIECE_VALUE[pcAdjust][SQUARE_FLIP(sq)];
	pcAdjust += 7;
  }
  
  // ���¾����zobristKeyУ�����zobristLockУ����
  this.zobristKey ^= PreGen_zobristKeyTable[pcAdjust][sq];
  this.zobristLock ^= PreGen_zobristLockTable[pcAdjust][sq];
}

// �����������������ص�ǰ���巽������
Position.prototype.evaluate = function() {
  var vl = (this.sdPlayer == 0 ? this.vlWhite - this.vlBlack :
      this.vlBlack - this.vlWhite) + ADVANCED_VALUE;
  return vl == this.drawValue() ? vl - 1 : vl;	// ���������������ķ�ֵ��Ҫ������ķ�ֵ���ֿ���
}

// ��ǰ����������Ƿ����Խ��пղ�����
Position.prototype.nullOkay = function() {
  return (this.sdPlayer == 0 ? this.vlWhite : this.vlBlack) > NULL_OKAY_MARGIN;
}

// �ղ������õ��ķ�ֵ�Ƿ���Ч
Position.prototype.nullSafe = function() {
  return (this.sdPlayer == 0 ? this.vlWhite : this.vlBlack) > NULL_SAFE_MARGIN;
}

Position.prototype.mirror = function() {
  var pos = new Position();
  pos.clearBoard();
  for (var sq = 0; sq < 256; sq ++) {
    var pc = this.squares[sq];
    if (pc > 0) {
      pos.addPiece(MIRROR_SQUARE(sq), pc);
    }
  }
  if (this.sdPlayer == 1) {
    pos.changeSide();
  }
  return pos;
}

// ��ȡ���ֿ��е��߷�
Position.prototype.bookMove = function() {
  if (typeof BOOK_DAT != "object" || BOOK_DAT.length == 0) {
    return 0;
  }
  var mirror = false;
  var lock = this.zobristLock >>> 1; // Convert into Unsigned
  var index = binarySearch(BOOK_DAT, lock);

  if (index < 0) {
    mirror = true;
    lock = this.mirror().zobristLock >>> 1; // Convert into Unsigned
    index = binarySearch(BOOK_DAT, lock);
  }
  if (index < 0) {
    return 0;
  }

  index --;
  while (index >= 0 && BOOK_DAT[index][0] == lock) {
    index --;
  }
  var mvs = [], vls = [];
  var value = 0;
  index ++;
  while (index < BOOK_DAT.length && BOOK_DAT[index][0] == lock) {
    var mv = BOOK_DAT[index][1];
    mv = (mirror ? MIRROR_MOVE(mv) : mv);
    if (this.legalMove(mv)) {
      mvs.push(mv);
      var vl = BOOK_DAT[index][2];
      vls.push(vl);
      value += vl;
    }
    index ++;
  }
  if (value == 0) {
    return 0;
  }

  //һ��������Ӧ�����߷���������Ϊ���������������ԡ�����ÿ����ı����ǲ�һ���ġ�
  value = Math.floor(Math.random() * value);
  for (index = 0; index < mvs.length; index ++) {
    value -= vls[index];
    if (value < 0) {
      break;
    }
  }

  return mvs[index];
}

// ��ȡ��ʷ����ָ��
Position.prototype.historyIndex = function(mv) {
  return ((this.squares[SRC(mv)] - 8) << 8) + DST(mv);
}