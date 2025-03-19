export const DEFAULT_EDITOR_WIDTH = 1000;
export const DEFAULT_EDITOR_HEIGHT = (1000 / 16) * 9;

/** 热键 */
export const enum HOTKEY {
  C = 'C',
  X = 'X',
  Z = 'Z',
  Y = 'Y',
  A = 'A',
  G = 'G',
  L = 'L',
  F = 'F',
  D = 'D',
  B = 'B',
  P = 'P',
  O = 'O',
  R = 'R',
  T = 'T',
  MINUS = '-',
  EQUAL = '=',
  DIGIT_0 = '0',
  DELETE = 'DELETE',
  UP = 'ARROWUP',
  DOWN = 'ARROWDOWN',
  LEFT = 'ARROWLEFT',
  RIGHT = 'ARROWRIGHT',
  ENTER = 'ENTER',
  SPACE = ' ',
  TAB = 'TAB',
  BACKSPACE = 'BACKSPACE',
  ESC = 'ESCAPE',
  PAGEUP = 'PAGEUP',
  PAGEDOWN = 'PAGEDOWN',
  F5 = 'F5',
  CONTROL = 'CONTROL',
  SHIFT = 'SHIFT',
  ALT = 'ALT',
}

/** 元素缩放点 */
export const enum OPERATE_RESIZE_HANDLERS {
  LEFT_TOP = 'left-top',
  TOP = 'top',
  RIGHT_TOP = 'right-top',
  LEFT = 'left',
  RIGHT = 'right',
  LEFT_BOTTOM = 'left-bottom',
  BOTTOM = 'bottom',
  RIGHT_BOTTOM = 'right-bottom',
}

/** 元素选中边框线 4个边 */
export const enum OPERATE_LINE {
  T = 'top',
  R = 'right',
  B = 'bottom',
  L = 'left',
}
