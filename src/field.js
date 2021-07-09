'use strict';


export const ItemType = Object.freeze({
  zombie: 'zombie',
  pumpkin: 'pumpkin',
  life: 'life',
  time: 'time',
  eye: 'eye',
  bomb: 'bomb',
  bomb2: 'bomb2',
  sun: 'sun',
});

const zombieTypeCount = 8;
const ZombieHeightRatio = [2.7, 2.2, 1.6, 1.9, 1.6, 1.2, 2, 1.8];
const pumpkinTypeCount = 6;

export class Field{
  constructor(zombieCount, minWidth, maxWidth, pumpkinCount) {
    this.zombieCount = zombieCount;
    this.minWidth = minWidth;
    this.maxWidth = maxWidth;
    this.pumpkinCount = pumpkinCount;
    this.field = document.querySelector('.game__field');
    this.fieldRect = this.field.getBoundingClientRect();
    this.game = document.querySelector('.game');
    this.field.addEventListener('click', this.onClick);
    this.shuffleTimer;
    this.timeProb;
    this.lifeProb;
    this.bombProb;
    this.eyeProb;
    this.nowSun = false;
    this.blackOutInterval = 5;
  }

  fieldClear(){
    this.field.innerHTML = '';
  }

  init() {
    this.field.innerHTML = '';
    this._makeZombies(this.zombieCount, this.minWidth, this.maxWidth);
    this._makePumpkins(this.pumpkinCount);
    this._shuffleItems(this.blackOutInterval);
    this._makeItem(ItemType.life, this.lifeProb, 3);
    this._makeItem(ItemType.time, this.timeProb, 3);
  }

  initSniperMode() {
    this.field.innerHTML = '';
    this._makeZombies(this.zombieCount, this.minWidth, this.maxWidth);
    this._makePumpkins(this.pumpkinCount);
    this._shuffleItems(this.blackOutInterval);
    this._makeScope(20);
    this._makeItem(ItemType.bomb, this.bombProb, 3);
    this._makeItem(ItemType.eye, this.eyeProb, 3);
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  stopShuffleTimer(){
    clearInterval(this.shuffleTimer);
  }

  setTimeProb(num) {
    this.timeProb = num;
  }

  setLifeProb(num) {
    this.lifeProb = num;
  }

  setBombProb(num) {
    this.bombProb = num;
  }

  setEyeProb(num) {
    this.eyeProb = num;
  }

  _makeScope(rad) {
    const scope = document.createElement('img')
  }

  _shuffleItems(sec) {
    this.shuffleTimer = setInterval(() => {
      if(this.nowSun === true)
        return;
      this._blackTime(1);
      this._reassignPosition();
    }, sec * 1000);
  }

  _blackTime(sec) {
    const blackField = document.createElement('div');
    blackField.setAttribute('class', 'game__field-black');
    this.field.appendChild(blackField);
    const tempTimer = setInterval(() => {
      this.field.removeChild(blackField);
      clearInterval(tempTimer);
    }, sec * 1000);
  }

  _reassignPosition() {
    this.field.childNodes.forEach((node) => {
      const x1 = 0;
      const y1 = 0;
      const x2 = this.fieldRect.width - node.width;
      const y2 = this.fieldRect.height - node.height;
      node.style.left = `${randomNumber(x1,x2)}px`;
      node.style.top = `${randomNumber(y1,y2)}px`;
    });
  }

  _makePumpkins(num) {
    for(let i = 0; i < num; i++)
    {
      const width = randomNumber(35, 110);
      const height = width;
      const item = document.createElement('img');
      const rand = Math.floor(Math.random() * pumpkinTypeCount) + 1;
      item.setAttribute('class', 'pumpkin');
      item.setAttribute('src', `imgs/pumpkins/pumpkin${rand}.png`);
      this._positioning(item, width, height);
      this.field.appendChild(item);
    }
  }

  _makeZombies(zombieCount, minWidth, maxWidth)
  {
    for(let i = 0; i < zombieCount; i++)
    {
      let randNum = Math.floor(Math.random() * zombieTypeCount) + 1;
      this._makeZombie(`zombie${randNum}`, minWidth, maxWidth);
    }
  }

  _makeZombie(type, minWidth, maxWidth) {
    const width = randomNumber(minWidth,maxWidth);
    const height = width * ZombieHeightRatio[type.replace('zombie','') - 1]
    const item = document.createElement('img');
    item.setAttribute('class', type);
    item.classList.add('zombie')
    item.setAttribute('src', `imgs/zombies/${type}.png`);
    this._positioning(item, width, height);
    this.field.appendChild(item);
  }
  
  _makeItem(item, prob, maxCount) {
    for(let i = 0; i < maxCount; i++) {
      if(Math.random() * 100 < prob) {
        const newItem = document.createElement('span');
        newItem.setAttribute('class', item);
        if(item === ItemType.life)
          newItem.innerText = '💖';
        else if(item === ItemType.time)
          newItem.innerText = '🕐';
        else if(item === ItemType.bomb)
          newItem.innerText = '💣';
        else if(item === ItemType.eye)
          newItem.innerText = '👁‍🗨';
        this._positioning(newItem, 50, 50)
        this.field.appendChild(newItem);
      }
    }
  }
  
  _positioning(item, width, height) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - width;
    const y2 = this.fieldRect.height - height;
    item.style.position = 'absolute';
    const x = randomNumber(x1,x2);
    const y = randomNumber(y1,y2);
    item.style.width = `${width}px`;
    item.style.height = `${height}px`;
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
  }

  onClick = (event) => {
    const target = event.target;
    if(target.matches('.zombie')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.zombie);
    } else if(target.matches('.pumpkin')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.pumpkin);
    } else if(target.matches('.life')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.life);
    } else if(target.matches('.time')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.time);
    } else if(target.matches('.bomb')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.bomb);
    } else if(target.matches('.eye')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.eye);
    } else if(target.matches('.bomb2')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.bomb2);
    } else if(target.matches('.sun')) {
      target.remove();
      this.onItemClick && this.onItemClick(ItemType.sun);
    }
  };
}

export class FieldInfiniteMode extends Field{
  constructor(zombieCount, minWidth, maxWidth, pumpkinCount) {
    super(zombieCount, minWidth,maxWidth, pumpkinCount);
    this.bomb2Prob;
    this.sunProb;

    this.zombieTimer = [];
    this.zombieRemoveTimer = [];
    this.pumpkinTimer = [];
    this.pumpkinRemoveTimer = [];
    this.itemTimer = [];
    this.itemRemoveTimer;
    this.started = false;
    this.blackOutIntervalErr = 2;
  }
  
  init() {
    this.field.innerHTML = '';
    this.started = true;
    this._infiniteZombies();
    this._infinitePumpkins();
    this._removeZombies();
    this._removePumpkins();
    this._infiniteItems();
    this._shuffleItems(this.blackOutInterval);
  }

  removeAllTimer() {
    this.started = false;
    this.zombieTimer.forEach((t) => clearInterval(t));
    this.zombieRemoveTimer.forEach((t) => clearInterval(t));
    this.pumpkinTimer.forEach((t) => clearInterval(t));
    this.pumpkinRemoveTimer.forEach((t) => clearInterval(t));
    this.itemTimer.forEach((t) => clearInterval(t));
    clearInterval(this.itemRemoveTimer);
  }
  
  itemSun(time){
    if(this.nowSun === true)
      return;
    
    this.nowSun = true;
    setTimeout(() => {
      this.nowSun = false;
    },time * 1000);
  }

  _removeItems(){
    this.itemRemoveTimer = setInterval(() => {
      if(!this.started)
        return;
      this.field.childNodes.forEach((node) => {
        if(node.matches('.bomb2') || node.matches('.sun'))
        {
          if((Math.random() * 100) < 60)
            this.field.removeChild(node);
        }
      });
    }, 14444);
  }

  _infiniteItems(){
    this._setBomb2Timer(4, 1, 0.8);
    this._setBomb2Timer(10, 0, 5);
    this._setBomb2Timer(17, 0, 10);
    this._setBomb2Timer(53, 10, 13);
    this._setBomb2Timer(114, 0, 50);
    this._setSunTimer(8, 0, 3);
    this._setSunTimer(17, 0, 10);
    this._setSunTimer(29, 8, 8);
    this._setSunTimer(52, 3, 15);
    this._setSunTimer(77, 0, 40);
  }

  countZombie(){
    let count = 0;
    this.field.childNodes.forEach((node) => {
      if(node.matches('.zombie'))
        count++;
    });
    return count;
  }

  _removePumpkins() {
    this._setPumpkinRemoveTimer(3, 0, 5);
    this._setPumpkinRemoveTimer(5, 4, 7);
    this._setPumpkinRemoveTimer(11, 20, 25);
    this._setPumpkinRemoveTimer(30, 20, 3);
    this._setPumpkinRemoveTimer(43, 0, 10);
    this._setPumpkinRemoveTimer(54, 0, 7);
    this._setPumpkinRemoveTimer(88, 0, 20);
    this._setPumpkinRemoveTimer(144, 0, 50);
    this._setPumpkinRemoveTimer(18, 90, 5);
  }

  _setPumpkinRemoveTimer(time, delay, prob) {
    let timerId;
    setTimeout(() => {
      if(!this.started)
        return;
      timerId = setInterval(() => {
        this.field.childNodes.forEach((node) => {
          if(node.matches('.pumpkin'))
          {
            if((Math.random() * 100) < prob)
              this.field.removeChild(node);
          }
        });
      }, time * 1000);
      this.pumpkinRemoveTimer.push(timerId);
    }, delay * 1000);
  }

  _infinitePumpkins(){
    this._setPumpkinTimer(3, 2, 0);
    this._setPumpkinTimer(2, 5, 10);
    this._setPumpkinTimer(4, 7, 17);
    this._setPumpkinTimer(1, 5, 37);
    this._setPumpkinTimer(3, 5.5, 78);
    this._setPumpkinTimer(2, 2, 83);
    this._setPumpkinTimer(3, 30, 111);
    this._setPumpkinTimer(4, 25, 50);
  }

  _setPumpkinTimer(maxPumpkin, time, delay) {
    let timerId;
    setTimeout(() => {
      if(!this.started)
        return;
      timerId = setInterval(() => {
        const rand = Math.floor(Math.random() * maxPumpkin) + 1;
        this._makePumpkins(rand);
      }, time * 1000);
      this.pumpkinTimer.push(timerId);
    }, delay * 1000);
  }

  _removeZombies() {
    this._setZombieRemoveTimer(5, 0, 5);
    this._setZombieRemoveTimer(7, 4, 10);
    this._setZombieRemoveTimer(11, 20, 7);
    this._setZombieRemoveTimer(30, 20, 25);
    this._setZombieRemoveTimer(67, 0, 5);
    this._setZombieRemoveTimer(79, 0, 6);
    this._setZombieRemoveTimer(88, 0, 70);
    this._setZombieRemoveTimer(109, 0, 40);
    this._setZombieRemoveTimer(18, 90, 5);
  }

  _setZombieRemoveTimer(time, delay, prob) {
    if(!this.started)
      return;
    let timerId;
    setTimeout(() => {
      timerId = setInterval(() => {
        this.field.childNodes.forEach((node) => {
          if(node.matches('.zombie'))
          {
            if((Math.random() * 100) < prob)
              this.field.removeChild(node);
          }
        });
      }, time * 1000);
      this.zombieRemoveTimer.push(timerId);
    }, delay * 1000);
  }

  _infiniteZombies(){
    this._setZombieTimer(2, 2, 0);
    this._setZombieTimer(3, 5, 10);
    this._setZombieTimer(5, 7, 20);
    this._setZombieTimer(1, 5, 40);
    this._setZombieTimer(3, 3.3, 70);
    this._setZombieTimer(1, 2, 90);
    this._setZombieTimer(7, 20, 120);
    this._setZombieTimer(2, 10, 200);
  }

  _setZombieTimer(maxZombie, time, delay) {
    let timerId;
    setTimeout(() => {
      if(!this.started)
        return;
      timerId = setInterval(() => {
        const rand = Math.floor(Math.random() * maxZombie) + 1;
        this._makeZombies(rand, this.minWidth, this.maxWidth);
      }, time * 1000);
      this.zombieTimer.push(timerId);
    }, delay * 1000);
  }

  _setBomb2Timer(time, delay, prob) {
    let timerId;
    setTimeout(() => {
      if(!this.started)
        return;
      timerId = setInterval(() => {
        if(Math.random() * 100 < prob)
        {
          this._makeItem(ItemType.bomb2, this.bomb2Prob, 1);
        }
      }, time * 1000);
      this.itemTimer.push(timerId);
    }, delay * 1000);
  }

  _setSunTimer(time, delay, prob) {
    let timerId;
    setTimeout(() => {
      if(!this.started)
        return;
      timerId = setInterval(() => {
        if(Math.random() * 100 < prob)
        {
          this._makeItem(ItemType.sun, this.sunProb, 1);
        }
      }, time * 1000);
      this.itemTimer.push(timerId);
    }, delay * 1000);
  }
  
  setBomb2Prob(num) {
    this.bomb2Prob = num;
  }

  setSunProb(num) {
    this.sunProb = num;
  }

  _makeItem(item, prob, maxCount) {
    for(let i = 0; i < maxCount; i++) {
      const newItem = document.createElement('span');
      newItem.setAttribute('class', item);
      if(item === ItemType.bomb2)
        newItem.innerText = '💣';
      else if(item === ItemType.sun)
        newItem.innerText = '☀️';
      this._positioning(newItem, 50, 50)
      this.field.appendChild(newItem);
    }
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}