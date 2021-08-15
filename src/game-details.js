"use strict";

export const difficulty = [
	25,
	// zombie count, zombie min width, zombie max width, pumpkin count
	[1, 140, 170, 3], //1
	[2, 140, 170, 3], //2
	[4, 120, 150, 3], //3
	[5, 110, 140, 6], //4
	[7, 100, 130, 6], //5
	[10, 80, 130, 8], //6
	[12, 80, 110, 10], //7
	[14, 70, 100, 12], //8
	[17, 65, 85, 15], //9
	[20, 55, 75, 17], //10
	[22, 50, 75, 20], //11
	[24, 50, 70, 22], //12
	[24, 45, 65, 24], //13
	[27, 40, 60, 25], //14
	[28, 40, 55, 25], //15
	[29, 35, 55, 27], //16
	[30, 30, 55, 29], //17
	[31, 30, 55, 29], //18
	[33, 25, 50, 30], //19
	[35, 25, 50, 30], //20
	[37, 25, 45, 30], //21
	[40, 25, 45, 33], //22
	[41, 25, 45, 35], //23
	[43, 25, 45, 37], //24
	[45, 25, 45, 40], //25
	[46, 25, 40, 42], //26
	[48, 25, 40, 42], //27
	[50, 25, 40, 44], //28
	[52, 25, 40, 44], //29
	[55, 25, 40, 45], //30
];

export const difficultyInfiniteMode = [[], [2, 25, 80, 2]];

export function loseMsg(level, levelArr) {
	let message;
	if (level <= levelArr[0])
		message = `<br><span style="font-size: 32px;">YOU LOST 🤮</span>`;
	else if (level <= levelArr[1])
		message = `<br><span style="font-size: 32px;">BAD... 😭</span>`;
	else if (level <= levelArr[2])
		message = `<br><span style="font-size: 32px;">So so... 🙄</span>`;
	else if (level <= levelArr[3])
		message = `<br><span style="font-size: 32px;">CHEER UP! 😆</span>`;
	else if (level <= levelArr[4])
		message = `<br><span style="font-size: 32px;">GOOD 😀</span>`;
	else if (level <= levelArr[5])
		message = `<br><span style="font-size: 32px;">NICE~ 😎</span>`;
	else if (level <= levelArr[6])
		message = `<br><span style="font-size: 32px;">GREAT! 🤗</span>`;
	else if (level <= levelArr[7])
		message = `<br><span style="font-size: 32px;">EXCELLENT!! 🤩</span>`;
	else
		message = `<br><span style="font-size: 26px;">YOU ARE GOD!!! 🤴🏻🤴🏻🤴🏻</span>`;
	return message;
}
