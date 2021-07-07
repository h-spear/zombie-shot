'use strict';

export const ItemType = Object.freeze({
  zombie: 'zombie',
  pumpkin: 'pumpkin',
  life: 'life',
  time: 'time',
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
    this.field.addEventListener('click', this.onClick);
    this.shuffleTimer;
    this.timeProb;
    this.lifeProb;
  }

  init() {
    this.field.innerHTML = '';
    this._makeZombies(this.zombieCount, this.minWidth, this.maxWidth);
    this._makePumpkins(this.pumpkinCount);
    this._shuffleItems(5);
    this._makeItem(ItemType.life, this.lifeProb, 3);
    this._makeItem(ItemType.time, this.timeProb, 3);
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

  _shuffleItems(sec) {
    this.shuffleTimer = setInterval(() => {
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
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}