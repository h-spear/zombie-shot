'use strict';

import { GameModes } from './game-modes.js';

const Game = new GameModes();

const gameContainer = document.querySelector('.game__container');
const nextBtn = document.querySelector('.game__large-btn');
const welcomePage = document.querySelector('.game__welcome-page');
const modeSelectPage = document.querySelector('.game__mode-page');
nextBtn.addEventListener('click', () => {
    gameContainer.removeChild(welcomePage);
    modeSelectPage.classList.remove('invisible');
    Game.playBg();
});
