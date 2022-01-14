import { volumeSoundA } from './game-modes.js';

const alertSound = new Audio('./sound/alert.mp3');
const bgSound = [
    new Audio('./sound/bg.mp3'),
    new Audio('./sound/bg2.mp3'),
    new Audio('./sound/bg3.mp3'),
];
const zombieSound = [
    new Audio('./sound/zombie-dead1.mp3'),
    new Audio('./sound/zombie-dead2.mp3'),
    new Audio('./sound/zombie-dead3.mp3'),
];
const pumpkinSound = new Audio('./sound/pumpkin-crash.mp3');
const winSound = new Audio('./sound/game_win.mp3');
const lifeItemSound = new Audio('./sound/life-up.mp3');
const timeItemSound = new Audio('./sound/time-item.wav');

const gunShotSound = [
    new Audio('./sound/gun-shot.mp3'),
    new Audio('./sound/gun-shot2.mp3'),
    new Audio('./sound/gun-shot3.wav'),
    new Audio('./sound/gun-shot4.wav'),
];
const gunLoadSound = [
    new Audio('./sound/gun-load.mp3'),
    new Audio('./sound/gun-load2.wav'),
];
const nasaItemSound = new Audio('./sound/nasa.wav');
const sunItemSound = new Audio('./sound/sun.wav');
const bombItemSound = new Audio('./sound/bomb.mp3');
const eyeItemSound = new Audio('./sound/eye.wav');

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

export function playNasaItem() {
    playSound(nasaItemSound);
}

export function playEyeItem() {
    playSound(eyeItemSound);
}

export function playSunItem() {
    playSound(sunItemSound);
}

export function playBombItem() {
    playSound(bombItemSound);
}

export function stopGunShotSound() {
    gunShotSound.forEach((sound) => {
        stopSound(sound);
    });
}

export function playGunShotSound() {
    let rand = Math.floor(Math.random() * gunShotSound.length);
    playSound(gunShotSound[rand]);
}

export function playGunLoadSound() {
    let rand = Math.floor(Math.random() * gunLoadSound.length);
    playSound(gunLoadSound[rand]);
}

export function playBackground() {
    let rand = Math.floor(Math.random() * bgSound.length);
    playSound(bgSound[rand]);
}

export function stopBackground() {
    bgSound.forEach((sound) => {
        stopSound(sound);
    });
}

export function playGunShot2() {
    playSound(gunShotSound[1]);
}
export function playZombie3() {
    playSound(zombieSound[2]);
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
    });
}

function changeZombieVolume(vol) {
    zombieSound.forEach((sound) => {
        sound.volume = vol;
    });
}

function changePumpkinVolume(vol) {
    pumpkinSound.volume = vol;
}

function changeGunVolume(vol) {
    gunShotSound.forEach((sound) => {
        sound.volume = vol;
    });
    gunLoadSound.forEach((sound) => {
        sound.volume = vol;
    });
}

function changeGameVolume(vol) {
    winSound.volume = vol;
    lifeItemSound.volume = vol;
    timeItemSound.volume = vol;
    bombItemSound.volume = vol;
    sunItemSound.volume = vol;
    eyeItemSound.volume = vol;
    nasaItemSound.volume = vol;
    alertSound.volume = vol;
}

// Game Volumn
const volumeBar = document.querySelector('.volume__bar');
const volume = document.querySelector('.game__volume');
volumeBar.addEventListener('change', () => {
    changeVolume(volumeBar.value * 0.01);
    volumeMuteBtn.classList.remove('active');
});

function changeVolume(vol) {
    changeBgVolume(vol);
    changeZombieVolume(vol);
    changePumpkinVolume(vol);
    changeGameVolume(vol);
    changeGunVolume(vol);
    volumeSoundA(vol);
    changeVolumeText(vol * 100);
}

function changeVolumeText(vol) {
    let text = null;

    if (vol == 0) text = '<i class="fas fa-volume-mute"></i>';
    else if (vol < 30) text = '<i class="fas fa-volume-down"></i>';
    else text = '<i class="fas fa-volume-up"></i>';

    volume.innerHTML = Math.floor(vol);
    volumeMuteBtn.innerHTML = text;
    volumeBar.value = vol;
}

let orgVolume = 0;
const volumeMuteBtn = document.querySelector('.game__volume__mute');
volumeMuteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (volumeBar.value == 0) {
        changeVolume(orgVolume * 0.01);
        volumeBar.value = orgVolume;
        changeVolumeText(orgVolume);
    } else {
        orgVolume = volumeBar.value;
        changeVolume(0);
    }
});
