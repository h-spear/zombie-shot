'use strict';

export const difficulty = [
  30,
  // zombie count, zombie min width, zombie max width, pumpkin count
  [2, 150, 170, 4],  // 1 
  [3, 140, 160, 4],  // 2
  [3, 130, 150, 5],  // 3 
  [4, 120, 150, 5],  // 4 
  [4, 110, 130, 6],  // 5 
  [6, 100, 110, 6],  // 6 
  [6, 90, 105, 7],   // 7
  [7, 85, 105, 7],   // 8
  [8, 80, 95, 8],    // 9
  [8, 70, 90, 8],    // 10
  [9, 70, 80, 9],    // 11 
  [10, 70, 80, 9],   // 12
  [11, 65, 80, 9],   // 13
  [11, 65, 75, 9],   // 14
  [12, 60, 70, 9],   // 15
  [13, 60, 70, 10],  // 16  
  [13, 60, 70, 10],  // 17 
  [14, 65, 75, 10],  // 18
  [14, 60, 70, 12],  // 19
  [15, 60, 70, 12],  // 20
  [18, 50, 65, 12],  // 21 
  [18, 50, 60, 14],  // 22
  [20, 45, 55, 14],  // 23
  [20, 45, 55, 14],  // 24
  [22, 40, 55, 18],  // 25
  [22, 40, 50, 18],  // 26  
  [24, 35, 50, 20],  // 27 
  [24, 30, 50, 20],  // 28
  [26, 30, 45, 22],  // 29
  [26, 25, 45, 24],  // 30
];

export const difficultyInfiniteMode = [
  [],
  [2, 25, 80, 2]
];
  
export function loseMsg(level, levelArr) {
  let message;
  if (level <= levelArr[0])
    message = `<br><span style="font-size: 32px;">YOU LOST 🤮</span>`;
  else if (level <= levelArr[1])
    message = `<br><span style="font-size: 32px;">BAD... 😭</span>`;
  else if (level <= levelArr[2])
    message = `<br><span style="font-size: 32px;">So so... 🙄</span>`
  else if (level <= levelArr[3])
    message = `<br><span style="font-size: 32px;">CHEER UP! 😆</span>`
  else if (level <= levelArr[4])
    message = `<br><span style="font-size: 32px;">GOOD 😀</span>`
  else if (level <= levelArr[5])
    message = `<br><span style="font-size: 32px;">NICE~ 😎</span>`
  else if (level <= levelArr[6])
    message = `<br><span style="font-size: 32px;">GREAT! 🤗</span>`
  else if (level <= levelArr[7])
    message = `<br><span style="font-size: 32px;">EXCELLENT!! 🤩</span>`
  else
    message = `<br><span style="font-size: 26px;">YOU ARE GOD!!! 🤴🏻🤴🏻🤴🏻</span>`
  return message;
}