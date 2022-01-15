import {
    Field,
    FieldInfiniteMode,
    FieldSniperMode,
    ItemType,
} from './field.js';
import * as sound from './sound.js';
import { item_settings } from './settings.js';

const backImgPath = [
    'imgs/background1.jpg',
    'imgs/background2.jpg',
    'imgs/background3.jpg',
    'imgs/background4.jpg',
    'imgs/background5.jpg',
    'imgs/background6.jpg',
];

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
        if (this.mode == 1) {
            return new GameStrictTimeMode(
                this.difficulty,
                this.gameDuration,
                this.lifeCount
            );
        } else if (this.mode == 2) {
            return new GameSequentialMode(
                this.difficulty,
                this.gameDuration,
                this.lifeCount
            );
        } else if (this.mode == 3) {
            return new GameDarkSniperMode(
                this.difficulty,
                this.gameDuration,
                this.lifeCount
            );
        } else if (this.mode == 4) {
            return new GameInfiniteZombieMode(
                this.difficulty,
                this.gameDuration,
                this.lifeCount
            );
        }
    }
}

class Game {
    constructor(difficulty, gameDuration = 30, lifeCount = 3) {
        this.difficulty = difficulty;
        this.gameDuration = gameDuration;
        this.lifeCount = lifeCount;
        this.orgLifeCount = lifeCount;
        this.level = 1;
        this.currentLevel = 0;
        this.mode = 0;

        // difficulty
        this.zombieCount = this.difficulty[this.level][0];
        this.minWidth = this.difficulty[this.level][1];
        this.maxWidth = this.difficulty[this.level][2];
        this.pumpkinCount = this.difficulty[this.level][3];

        this.timeItemProb = '0';
        this.lifeItemProb = '0';
        this.gunCount = 0;

        this.gameFieldClass = document.querySelector('.game__field');
        this.gameTimer = document.querySelector('.game__timer');
        this.gameScore = document.querySelector('.game__score');
        this.gameLevel = document.querySelector('.game__level');
        this.gameLife = document.querySelector('.game__life');
        this.gameBtn = document.querySelector('.game__pause');
        this.remainingTimeSec = gameDuration;
        this.gameBtn.addEventListener('click', () => {
            if (this.started) this.stop(Reason.cancel);
        });

        this.gameFieldClass.addEventListener('click', () => {
            if (this.started) {
                this.gunCount++;
                sound.playGunShotSound();
                if (this.gunCount % 15 === 0) {
                    setTimeout(() => {
                        sound.stopGunShotSound();
                        sound.playGunLoadSound();
                    }, 1000);
                }
            }
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
        if (this.mode !== 4) {
            this.currentLevel = this.level;
        }
        this.level = 1;
        this.setLevel(this.level);
        this.refreshLifeCount();
        this.refreshTimer();
    }

    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }

    setLevel(level) {
        let tmpLevel = level;
        if (level > this.difficulty[0]) {
            tmpLevel = this.difficulty[0];
            this.zombieCount = level - Math.floor(Math.random() * 4);
            this.pumpkinCount = level - 5 - Math.floor(Math.random() * 4);
        } else {
            this.zombieCount = this.difficulty[tmpLevel][0];
            this.pumpkinCount = this.difficulty[tmpLevel][3];
        }
        this.minWidth = this.difficulty[tmpLevel][1];
        this.maxWidth = this.difficulty[tmpLevel][2];
        this.gameField = new Field(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameLevel.innerText = this.level;
    }

    setItem1Probability(str) {
        this.timeItemProb = str;
    }

    setItem2Probability(str) {
        this.lifeItemProb = str;
    }

    setBlackOutInterval(num) {
        this.gameField.blackOutInterval = num;
    }

    start() {
        if (this.mode != 2) this.remainingTimeSec = this.gameDuration;
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

    clear() {
        this.started = false;
        this.gameScore.innerText = '?';
        this.gameLife.innerText = '';
        this.gameTimer.innerText = 'TIME';
        this.gameLevel.innerText = '1';
        this.changeStartBackground();
        this.gameField.fieldClear();
    }

    onItemClick = (item) => {
        if (!this.started) {
            return;
        }
        if (item === ItemType.zombie) {
            sound.playZombieDead();
            this.score++;
            this.updateScoreBoard();
            if (this.score === this.zombieCount) {
                this.stop(Reason.win);
            }
        } else if (item === ItemType.pumpkin) {
            sound.playPumpkin();
            this.lifeCount--;
            this.updateLifeBoard();
            if (this.lifeCount === 0) {
                this.stop(Reason.lose);
            }
        } else if (item === ItemType.life) {
            sound.playLifeItem();
            this.lifeCount++;
            this.updateLifeBoard();
        } else if (item === ItemType.time) {
            sound.playTimeItem();
            this.remainingTimeSec =
                this.remainingTimeSec + item_settings.plus_time;
            this.updateTimerText(this.remainingTimeSec);
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
            if (this.remainingTimeSec <= 0) {
                clearInterval(this.timer);
                this.stop(
                    this.zombieCount === this.score ? Reason.win : Reason.lose
                );
                return;
            }
            this.updateTimerText(--this.remainingTimeSec);
        }, 1000);
    }

    stopGameTimer() {
        clearInterval(this.timer);
    }

    updateTimerText(time) {
        const minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (seconds < 10) seconds = '0' + seconds;
        this.gameTimer.innerText = `${minutes}:${seconds}`;
    }

    updateScoreBoard() {
        this.gameScore.innerText = this.zombieCount - this.score;
    }

    updateLifeBoard() {
        let string;
        if (this.lifeCount > 3) string = `💖<b> X ${this.lifeCount}</b>`;
        else string = '💖'.repeat(this.lifeCount);
        this.gameLife.innerHTML = string;
    }

    setLifeCount(num) {
        this.lifeCount = num;
        this.updateLifeBoard();
    }

    changeBackground() {
        let rand = Math.floor(Math.random() * backImgPath.length);
        this.gameFieldClass.style.background = `url("${backImgPath[rand]}") center/cover`;
    }

    changeStartBackground() {
        this.gameFieldClass.style.background = `url("imgs/background-start.jpg") center/cover`;
    }
}

class GameDarkSniperMode extends Game {
    constructor(difficulty, gameDuration, lifeCount) {
        super(difficulty, gameDuration, lifeCount);
        this.mode = 3;

        super.timeItemProb = '0';
        super.lifeItemProb = '0';
        this.nasaItemProb = '10';
        this.eyeItemProb = '10';

        this.scopeRate = '400';
        this.gameField = new FieldSniperMode(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameField.setClickListener(this.onItemClick);
    }

    setItem1Probability(str) {
        this.nasaItemProb = str;
    }

    setItem2Probability(str) {
        this.eyeItemProb = str;
    }

    setScopeRate(str) {
        this.scopeRate = str;
    }

    initGame() {
        this.score = 0;
        this.gameField.setNasaProb(eval(this.nasaItemProb));
        this.gameField.setEyeProb(eval(this.eyeItemProb));
        this.updateLifeBoard();
        this.gameScore.innerHTML = this.zombieCount;
        this.gameField.setScopeRate(eval(this.scopeRate));
        this.gameField.setScopeDownsizingRate(this.scopeDownsizingRate());
        this.gameField.init();
        this.changeBackground();
    }

    stop(reason) {
        this.started = false;
        this.stopGameTimer();
        this.hideGameButton();
        sound.stopBackground();
        this.gameField.removeScope();
        this.gameField.stopShuffleTimer();
        this.onGameStop && this.onGameStop(reason);
    }

    setLevel(level) {
        let tmpLevel = level;
        if (level > this.difficulty[0]) {
            tmpLevel = this.difficulty[0];
            this.zombieCount = level - Math.floor(Math.random() * 4);
            this.pumpkinCount = level - 5 - Math.floor(Math.random() * 4);
        } else {
            this.zombieCount = this.difficulty[tmpLevel][0];
            this.pumpkinCount = this.difficulty[tmpLevel][3];
        }
        this.minWidth = this.difficulty[tmpLevel][1];
        this.maxWidth = this.difficulty[tmpLevel][2];
        this.gameField = new FieldSniperMode(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameLevel.innerText = this.level;
    }

    onItemClick = (item) => {
        if (!this.started) {
            return;
        }
        if (item === ItemType.zombie) {
            sound.playZombieDead();
            this.score++;
            this.updateScoreBoard();
            if (this.score === this.zombieCount) {
                this.stop(Reason.win);
            }
        } else if (item === ItemType.pumpkin) {
            sound.playPumpkin();
            this.lifeCount--;
            this.updateLifeBoard();
            if (this.lifeCount === 0) {
                this.stop(Reason.lose);
            }
        } else if (item === ItemType.nasa) {
            sound.playNasaItem();
            this.gameField.stopScopeDownsizing(item_settings.nasa_duration);
        } else if (item === ItemType.eye) {
            sound.playEyeItem();
            this.gameField.scopeSizeUp(item_settings.scope_range);
        }
    };

    scopeDownsizingRate() {
        if (this.level < 10) return 10;
        else if (this.level < 25) return 3;
        else if (this.level < 37) return 1;
        else return 0.2;
    }
}

class GameInfiniteZombieMode extends Game {
    constructor(difficulty, gameDuration, lifeCount) {
        super(difficulty, gameDuration, lifeCount);
        this.mode = 4;

        super.timeItemProb = '0';
        super.lifeItemProb = '0';
        this.bombItemProb = '0';
        this.sunItemProb = '0';

        this.gameField = new FieldInfiniteMode(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameField.setClickListener(this.onItemClick);
    }

    setItem1Probability(str) {
        this.bombItemProb = str;
    }

    setItem2Probability(str) {
        this.sunItemProb = str;
    }

    initGame() {
        this.score = 0;
        this.gameLevel.innerText = '∞';
        //this.gameField.setBombProb(eval(this.bombItemProb));
        //this.gameField.setSunProb(eval(this.sunItemProb));
        this.updateLifeBoard();
        this.gameScore.innerHTML = `${this.score}`;
        this.gameField.init();
        this.changeBackground();
    }

    onItemClick = (item) => {
        if (!this.started) {
            return;
        }
        if (item === ItemType.zombie) {
            sound.playZombieDead();
            this.score++;
            this.updateScoreBoard();
        } else if (item === ItemType.pumpkin) {
            sound.playPumpkin();
            this.lifeCount--;
            this.updateLifeBoard();
            if (this.lifeCount === 0) {
                this.stop(Reason.lose);
            }
        } else if (item === ItemType.bomb) {
            this.score += this.gameField.countZombie();
            sound.playBombItem();
            this.updateScoreBoard();
            this.gameField.fieldClear();
        } else if (item === ItemType.sun) {
            sound.playSunItem();
            this.gameField.itemSun(item_settings.sun_duration);
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

class GameSequentialMode extends Game {
    constructor(difficulty, gameDuration, lifeCount) {
        super(difficulty, gameDuration, lifeCount);
        this.mode = 2;
        this.gameField = new Field(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameField.setClickListener(this.onItemClick);
    }
}

class GameStrictTimeMode extends Game {
    constructor(difficulty, gameDuration, lifeCount) {
        super(difficulty, gameDuration, lifeCount);
        this.mode = 1;
        this.gameField = new Field(
            this.zombieCount,
            this.minWidth,
            this.maxWidth,
            this.pumpkinCount
        );
        this.gameField.setClickListener(this.onItemClick);
    }
}
