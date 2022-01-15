'use strict';

import { GameBody } from './game-body.js';

const Game = new GameBody();
const gameContainer = document.querySelector('.game__container');
const mainBtn = document.querySelector('.game__large-btn');
const welcomePage = document.querySelector('.game__welcome-page');
const modeSelectPage = document.querySelector('.game__mode-page');

mainBtn.addEventListener('click', () => {
    gameContainer.removeChild(welcomePage);
    modeSelectPage.classList.remove('invisible');
    Game.playBg();
});
