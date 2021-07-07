'use strict'

import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

const backImgPath = [
  'imgs/background1.jpg',
  'imgs/background2.jpg',
  'imgs/background3.jpg',
  'imgs/background4.jpg',
  'imgs/background5.jpg',
  'imgs/background6.jpg',
]

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel',
});

// Builder Pattern
export class GameBuilder {
  gameDuration(num) {
    this.gameDuration = num;
    return this;
  }

  difficulty(arr) {
    this.difficulty = arr;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,
      this.difficulty
    );
  }
}

class Game{
  constructor(gameDuration, difficulty) {
    this.gameDuration = gameDuration;
    this.difficulty = difficulty;
    this.level = 1;
    this.lifeCount = 3;

    this.zombieCount = this.difficulty[this.level][0];
    this.minWidth = this.difficulty[this.level][1];
    this.maxWidth = this.difficulty[this.level][2];
    this.pumpkinCount = this.difficulty[this.level][3];

    this.gameFieldClass = document.querySelector('.game__field');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameLevel = document.querySelector('.game__level');
    this.gameLife = document.querySelector('.game__life');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
    this.remainingTimeSec;
      if(this.started) {
        this.stop(Reason.cancel);
      } else { 
        this.start();
      }
    });
    
    this.gameField = new Field(this.zombieCount, this.minWidth, this.maxWidth, this.pumpkinCount);
    this.gameField.setClickListener(this.onItemClick);
    
    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  setLevel(level){
    let currentLevel = level;
    if(level > this.difficulty[0]) {
      currentLevel = this.difficulty[0];
      this.zombieCount = level - Math.floor(Math.random() * 4);
      this.pumpkinCount = level - 5 - Math.floor(Math.random() * 4);
    } else {
      this.zombieCount = this.difficulty[currentLevel][0];
      this.pumpkinCount = this.difficulty[currentLevel][3];
    }
    this.minWidth = this.difficulty[currentLevel][1];
    this.maxWidth = this.difficulty[currentLevel][2];
    this.gameField = new Field(this.zombieCount, this.minWidth, this.maxWidth, this.pumpkinCount);
    this.gameLevel.innerText = this.level;
  }
  
  start() {
    this.started = true;
    this.initGame();
    this.showStopButton();
    this.showTimerAndScore();
    this.startGameTimer();
    sound.playBackground();
  }
  
  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.gameField.stopShuffleTimer();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if(!this.started) {
      return;
    }
    if(item === ItemType.zombie) {
      this.score++;
      this.updateScoreBoard();
      sound.playZombieDead();
      if(this.score === this.zombieCount) {
        this.stop(Reason.win);
      }
    } else if(item === ItemType.pumpkin) {
      this.lifeCount--;
      this.updateLifeBoard();
      sound.playPumpkin();
      if(this.lifeCount === 0) {
        this.stop(Reason.lose);
      }
    } else if(item === ItemType.life) {
      this.lifeCount++;
      this.updateLifeBoard();
      sound.playLifeItem();
    } else if(item === ItemType.time) {
      this.remainingTimeSec = this.remainingTimeSec + 5;
      this.updateTimerText(this.remainingTimeSec);
      sound.playTimeItem();
    }
  };

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
    this.gameBtn.style.visibility = 'visible';
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
  
  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }
  
  startGameTimer() {
    this.remainingTimeSec = this.gameDuration;
    this.updateTimerText(this.remainingTimeSec);
    this.timer = setInterval(() => {
      if(this.remainingTimeSec <= 0) {
        clearInterval(this.timer);
        this.stop(this.zombieCount === this.score ? Reason.win : Reason.lose)
        return;
      }
      this.updateTimerText(--this.remainingTimeSec);
    }, 1000);
  }
  
  stopGameTimer() {
    clearInterval(this.timer);
  }
  
  updateTimerText(time) {
    const minutes = Math.floor(time / 60)
    const seconds = time % 60;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
  }
  
  initGame() {
    this.score = 0;
    this.gameField.setLifeProb((35 - this.level > 10) ? (50 - this.level) : 10);
    this.gameField.setTimeProb((this.level > 40) ? this.level / 5 : 10);
    this.gameScore.innerHTML = this.zombieCount;
    this.gameField.init();
    this.changeBackground();
  }
  
  updateScoreBoard() {
    this.gameScore.innerText = this.zombieCount - this.score;
  }

  updateLifeBoard() {
    let string;
    if(this.lifeCount > 3)
      string = `<b>💖 X ${this.lifeCount}</b>`;
    else
      string = "💖".repeat(this.lifeCount);
    this.gameLife.innerHTML = string;
  }

  setLifeCount(num) {
    this.lifeCount = num;
    this.updateLifeBoard();
  }

  changeBackground(){
    let rand = Math.floor(Math.random() * backImgPath.length);
    this.gameFieldClass.style.background = `url("${backImgPath[rand]}") center/cover`;
  }
}