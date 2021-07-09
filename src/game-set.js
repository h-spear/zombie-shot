'use strict'

import { Field, FieldInfiniteMode, ItemType } from "./field.js";
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

  lifeCount(num) {
    this.lifeCount = num;
    return this;
  }

  difficulty(arr) {
    this.difficulty = arr;
    return this;
  }

  mode(num) {
    this.mode = num;
    return this;
  }

  build() {
    if(this.mode == 1) {
      return new GameStrictTimeMode(
        this.difficulty,
        this.gameDuration,
        this.lifeCount
      );
    } else if(this.mode == 2) {
      return new GameSequentialMode(
        this.difficulty,
        this.gameDuration,
        this.lifeCount
      );
    } else if(this.mode == 3) {
      return new GameDarkSniperMode(
        this.difficulty,
        this.gameDuration,
        this.lifeCount
      );
    } else if(this.mode == 4) {
      return new GameInfiniteZombieMode(
        this.difficulty,
        this.gameDuration,
        this.lifeCount
      );
    }
  }
}

class Game{
  constructor(difficulty, gameDuration = 30, lifeCount = 3) {
    this.difficulty = difficulty;
    this.gameDuration = gameDuration;
    this.lifeCount = lifeCount;
    this.orgLifeCount = lifeCount;
    this.level = 1;
    this.mode = 0;

    // difficulty
    this.zombieCount = this.difficulty[this.level][0];
    this.minWidth = this.difficulty[this.level][1];
    this.maxWidth = this.difficulty[this.level][2];
    this.pumpkinCount = this.difficulty[this.level][3];

    this.timeItemProb = '0';
    this.lifeItemProb = '0';

    this.gameFieldClass = document.querySelector('.game__field');
    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameLevel = document.querySelector('.game__level');
    this.gameLife = document.querySelector('.game__life');
    this.gameBtn = document.querySelector('.game__button');
    this.remainingTimeSec = gameDuration;
    this.gameBtn.addEventListener('click', () => {
      if(this.started)
        this.stop(Reason.cancel);
    });
    
    
    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  refreshTimer() {
    this.remainingTimeSec = this.gameDuration;
  }

  refreshLifeCount() {
    this.lifeCount = this.orgLifeCount;
  }

  refreshGame() {
    this.level = 1;
    this.setLevel(this.level);
    this.refreshLifeCount();
    this.refreshTimer();
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

  setItem1Probability(str){
    this.timeItemProb = str;
  }

  setItem2Probability(str){
    this.lifeItemProb = str;
  }

  setBlackOutInterval(str){
    this.gameField.blackOutInterval = str;
  }
  
  start() {
    if(this.mode != 2)
      this.remainingTimeSec = this.gameDuration;
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

  clear(){
    this.started = false;
    this.gameScore.innerText = '?';
    this.gameLife.innerText = '';
    this.gameTimer.innerText = 'TIME';
    this.gameLevel.innerText = '1';
    this.changeStartBackground();
    this.gameField.fieldClear();
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
    } else if(item === ItemType.bomb) {
      this.remainingTimeSec = this.remainingTimeSec + 5;
      this.updateTimerText(this.remainingTimeSec);
      sound.playTimeItem();
    } else if(item === ItemType.eye) {
      this.remainingTimeSec = this.remainingTimeSec + 5;
      this.updateTimerText(this.remainingTimeSec);
      sound.playTimeItem();
    }
  };

  initGame() {
    this.score = 0;
    this.gameField.setLifeProb(eval(this.lifeItemProb));
    this.gameField.setTimeProb(eval(this.timeItemProb));
    this.updateLifeBoard();
    this.gameScore.innerHTML = this.zombieCount;
    this.gameField.init();
    this.changeBackground();
  }

  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    this.gameBtn.style.visibility = 'visible';
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
  
  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }

  setInitTimer() {
    this.remainingTimeSec = this.gameDuration;
  }
  
  startGameTimer() {
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
    let seconds = time % 60;
    if(seconds < 10)
      seconds = '0' + seconds;
    this.gameTimer.innerText = `${minutes}:${seconds}`;
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

  changeStartBackground(){
    this.gameFieldClass.style.background = `url("imgs/background-start.jpg") center/cover`;
  }
}

class GameDarkSniperMode extends Game{
  constructor(difficulty, gameDuration, lifeCount){ 
    super(difficulty, gameDuration, lifeCount);
    this.mode = 3;

    super.timeItemProb = '0';
    super.lifeItemProb = '0';
    this.bombItemProb = '0';
    this.eyeItemProb = '0';
  }

  setItem1Probability(str){
    this.bombItemProb = str;
  }

  setItem2Probability(str){
    this.eyeItemProb = str;
  }

  initGame() {
    this.score = 0;
    this.gameField.setBombProb(eval(this.bombItemProb));
    this.gameField.setEyeProb(eval(this.eyeItemProb));
    this.updateLifeBoard();
    this.gameScore.innerHTML = this.zombieCount;
    this.gameField.initSniperMode();
    this.changeBackground();
  }
}

class GameInfiniteZombieMode extends Game{
  constructor(difficulty, gameDuration, lifeCount){ 
    super(difficulty, gameDuration, lifeCount);
    this.mode = 4;

    super.timeItemProb = '0';
    super.lifeItemProb = '0';
    this.bomb2ItemProb = '0';
    this.sunItemProb = '0';

    this.gameField = new FieldInfiniteMode(this.zombieCount, this.minWidth, this.maxWidth, this.pumpkinCount);
    this.gameField.setClickListener(this.onItemClick);
    
  }

  setItem1Probability(str){
    this.bomb2ItemProb = str;
  }

  setItem2Probability(str){
    this.sunItemProb = str;
  }

  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBackground();
    this.gameField.stopShuffleTimer();
    this.onGameStop && this.onGameStop(reason);
  }

  initGame() {
    this.score = 0;
    //this.gameField.setBomb2Prob(eval(this.bomb2ItemProb));
    //this.gameField.setSunProb(eval(this.sunItemProb));
    this.updateLifeBoard();
    this.gameScore.innerHTML = `${this.score}`;
    this.gameField.init();
    this.changeBackground();
  }

  onItemClick = (item) => {
    if(!this.started) {
      return;
    }
    if(item === ItemType.zombie) {
      this.score++;
      this.updateScoreBoard();
      sound.playZombieDead();
    } else if(item === ItemType.pumpkin) {
      this.lifeCount--;
      this.updateLifeBoard();
      sound.playPumpkin();
      if(this.lifeCount === 0) {
        this.stop(Reason.lose);
      }
    } else if(item === ItemType.bomb2) {
      this.score += this.gameField.countZombie();
      this.updateScoreBoard();
      this.gameField.fieldClear();
      sound.playLifeItem();
    } else if(item === ItemType.sun) {
      this.gameField.itemSun(15);
      sound.playTimeItem();
    }
  };
  
  updateScoreBoard() {
    this.gameScore.innerText = this.score;
  }
  
  refreshGame() {
    this.refreshLifeCount();
    this.refreshTimer();
    this.gameField.removeAllTimer();
  }
}

class GameSequentialMode extends Game{
  constructor(difficulty, gameDuration, lifeCount){ 
    super(difficulty, gameDuration, lifeCount);
    this.mode = 2;
    this.gameField = new Field(this.zombieCount, this.minWidth, this.maxWidth, this.pumpkinCount);
    this.gameField.setClickListener(this.onItemClick);
  }
}

class GameStrictTimeMode extends Game{
  constructor(difficulty, gameDuration, lifeCount){ 
    super(difficulty, gameDuration, lifeCount);
    this.mode = 1;
    this.gameField = new Field(this.zombieCount, this.minWidth, this.maxWidth, this.pumpkinCount);
    this.gameField.setClickListener(this.onItemClick);
  }
}