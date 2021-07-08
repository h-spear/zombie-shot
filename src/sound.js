
const alertSound = new Audio('./sound/alert.mp3');

const bgSound = [new Audio('./sound/bg.mp3'),
                new Audio('./sound/bg2.mp3'),
                new Audio('./sound/bg3.mp3')];
const zombieSound = [new Audio('./sound/zombie-dead1.mp3'),
                    new Audio('./sound/zombie-dead2.mp3'),
                    new Audio('./sound/zombie-dead3.mp3')]
const pumpkinSound = new Audio('./sound/pumpkin-crash.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const lifeItemSound = new Audio('./sound/life-up.mp3');
const timeItemSound = new Audio('./sound/time-item.wav');

export function playZombieDead() {
  let rand = Math.floor(Math.random() * zombieSound.length);
  playSound(zombieSound[rand]);
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
  let rand = Math.floor(Math.random() * bgSound.length);
  playSound(bgSound[rand]);
}

export function stopBackground() {
  bgSound.forEach((sound) => {
    stopSound(sound);
  })
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}

function changeBgVolume(vol) {
  bgSound.forEach((sound) => {
    sound.volume = vol;
  })
}

function changeZombieVolume(vol) {
  zombieSound.forEach((sound) => {
    sound.volume = vol;
  })
}

function changePumpkinVolume(vol) {
  pumpkinSound.volume = vol;
}

function changeGameVolume(vol) {
  winSound.volume = vol;
  lifeItemSound.volume = vol;
  timeItemSound.volume = vol;
  alertSound.volume = vol;
}

function changeVolume(vol) {
  changeBgVolume(vol);
  changeZombieVolume(vol);
  changePumpkinVolume(vol);
  changeGameVolume(vol);
}

const volumeBar = document.querySelector('.volume__bar');
const volume = document.querySelector('.game__volume');
volumeBar.addEventListener('change', () => {
  let text = null;
  const vol = volumeBar.value;
  if(vol === 0)
    text = '<i class="fas fa-volume-mute"></i>';
  else if(vol < 30)
    text = '<i class="fas fa-volume-down"></i>';
  else
    text = '<i class="fas fa-volume-up"></i>';

  text = text + volumeBar.value;
  changeVolume(volumeBar.value * 0.01);
  volume.innerHTML = text;
});