const alertSound = new Audio('./sound/alert.mp3');
const bgSound1 = new Audio('./sound/bg.mp3');
const bgSound2 = new Audio('./sound/bg2.mp3');
const bgSound3 = new Audio('./sound/bg3.mp3');
const zombieSound1 = new Audio('./sound/zombie-dead1.mp3');
const zombieSound2 = new Audio('./sound/zombie-dead2.mp3');
const zombieSound3 = new Audio('./sound/zombie-dead3.mp3');
const pumpkinSound = new Audio('./sound/pumpkin-crash.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const lifeItemSound = new Audio('./sound/life-up.mp3');
const timeItemSound = new Audio('./sound/time-item.wav');

export function playZombieDead() {
  let rand = Math.floor(Math.random() * 3);
  if(rand === 2)
    playSound(zombieSound1);
  else if(rand === 1)
    playSound(zombieSound2);
  else
    playSound(zombieSound3);
}

export function playPumpkin() {
  playSound(pumpkinSound);
}

export function playAlert() {
  playSound(alertSound);
}

export function playWin() {
  playSound(winSound);
}

export function playLifeItem() {
  playSound(lifeItemSound);
}

export function playTimeItem() {
  playSound(timeItemSound);
}

export function playBackground() {
  let rand = Math.floor(Math.random() * 3);
  if(rand === 2)
    playSound(bgSound1);
  else if(rand === 1)
    playSound(bgSound2);
  else
    playSound(bgSound3);
}

export function stopBackground() {
  stopSound(bgSound1);
  stopSound(bgSound2);
  stopSound(bgSound3);
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}