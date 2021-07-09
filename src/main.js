'use strict'

import { GameModes } from "./game-modes.js";

const Game = new GameModes();

const gameContainer = document.querySelector('.container');
const nextBtn = document.querySelector('.main-btn');
const pageFirst = document.querySelector('.start-first');
const pageSecond = document.querySelector('.start-second');
nextBtn.addEventListener('click', () => {
  gameContainer.removeChild(pageFirst);
  pageSecond.classList.remove('invisible');
  Game.playBg();
});