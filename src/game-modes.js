import PopUp from './popup.js';
import { GameBuilder, Reason } from './game-set.js';
import * as sound from './sound.js';
import * as whats from './settings.js';
import { DatabaseService } from './service/firebase.js';

const soundA = new Audio('./sound/bg-start.mp3');

export function volumeSoundA(vol) {
    soundA.volume = vol;
}

export class GameModes {
    constructor() {
        this.DB = new DatabaseService();
        this.gameModeBtn = document.querySelectorAll('.game__mode-btn');
        this.gameFinishBanner = new PopUp();
        this.game;

        this.gameTitle = document.querySelector('.game__title');
        this.gameDescription = document.querySelector('.game__description');
        this.gameModePage = document.querySelector('.game__mode-page');
        this.gameModeBtnBox = document.querySelector('.game__mode-btn-box');
        this.gameRankingPage = document.querySelector('.game__ranking-page');
        this.gameField = document.querySelector('.game__field');
        this.gameRankingPrevBtn = document.querySelector(
            '.game__ranking-prev-btn'
        );

        this.gameModeBtnBox.addEventListener('click', (e) => {
            const target = e.target;
            if (target.nodeName === 'BUTTON') {
                const mode = parseInt(target.dataset.mode);
                this.gameStart(mode);
                sound.playGunShot2();
            }
        });

        this.gameRankingPrevBtn.addEventListener('click', (e) => {
            this.hideRankingPage();
            this.gameField.classList.remove('invisible');
        });

        this.gameFinishBanner.setClickListener(() => {
            this.game.start();
        });

        this.gameFinishBanner.setHomeClickListener(() => {
            this.game.clear();
            this.playBg();
            this.showModePage();
        });
    }

    playBg() {
        soundA.currentTime = 0;
        soundA.loop = true;
        soundA.play();
    }

    stopBg() {
        soundA.pause();
    }

    gameStart(mode) {
        this.hideModePage();
        this.makeGameDescription(mode);
    }

    hideModePage() {
        this.gameField.style.display = 'flex';
        this.gameModePage.style.display = 'none';
    }

    showModePage() {
        this.gameField.style.display = 'none';
        this.gameModePage.style.display = 'flex';
    }

    hideRankingPage() {
        this.gameField.style.display = 'flex';
        this.gameRankingPage.style.display = 'none';
    }

    showRankingPage() {
        this.gameField.style.display = 'none';
        this.gameRankingPage.style.display = 'flex';
    }

    makeGameDescription(mode) {
        // generate description field
        this.gameField.classList.add('description');
        const miniContainer = document.createElement('div');
        miniContainer.setAttribute('class', 'game__mini-container');
        this.gameField.appendChild(miniContainer);
        const title = document.createElement('h1');
        title.setAttribute('class', 'game__title');
        miniContainer.appendChild(title);
        const description = document.createElement('span');
        description.setAttribute('class', 'game__description');
        miniContainer.appendChild(description);
        title.innerText = whats.mode_title;
        description.innerHTML = eval(`whats.mode${mode}_description`);

        const prevBtn = document.querySelector('.game__prev-btn');
        prevBtn.addEventListener('click', () => {
            this.showModePage();
            this.gameField.innerHTML = '';
            this.gameField.classList.remove('description');
        });

        // 게임 시작 버튼 만들기
        const startMode = document.querySelector(`.start-mode${mode}`);
        startMode.addEventListener('click', () => {
            this.stopBg();
            sound.playZombie3();
            this.game = new GameBuilder()
                .gameDuration(eval(`whats.mode${mode}_settings.gameDuration`))
                .difficulty(
                    mode === 4 ? whats.difficultyInfiniteMode : whats.difficulty
                )
                .lifeCount(eval(`whats.mode${mode}_settings.lifeCount`))
                .mode(mode)
                .build();
            if (mode === 3)
                this.game.setScopeRate(
                    eval(`whats.mode${mode}_settings.scopeRate`)
                );

            this.lvBoundary = eval(`whats.mode${mode}_settings.levelBoundary`);
            this.game.setItem1Probability(
                eval(`whats.mode${mode}_settings.Item1Probability`)
            );
            this.game.setItem2Probability(
                eval(`whats.mode${mode}_settings.Item2Probability`)
            );
            this.game.setBlackOutInterval(
                eval(`whats.mode${mode}_settings.blackOutInterval`)
            );
            if (mode === 4)
                this.game.setGameStopListener((reason) =>
                    this.onGameStopInfiniteMode(reason, this.lvBoundary)
                );
            else
                this.game.setGameStopListener((reason) =>
                    this.onGameStop(reason, this.lvBoundary)
                );
            this.game.start();
        });

        // 랭킹 버튼 만들기
        const rankingBtn = document.querySelector('.game__ranking-btn');
        rankingBtn.addEventListener('click', () => {
            this.DB.loadRankingData(mode);
            this.showRankingPage(mode);
            this.gameField.classList.add('invisible');
        });
    }

    onGameStopInfiniteMode(reason, lvBoundary) {
        let message =
            `<span style="font-size: 18px;">Zombie ${this.game.score} shoted!</span>` +
            whats.loseMsg(this.game.score, lvBoundary);
        switch (reason) {
            case Reason.cancel:
                sound.playAlert();
                break;
            case Reason.lose:
                sound.playPumpkin();
                break;
            default:
                throw new Error('not valid reason');
        }
        this.game.refreshGame();
        this.gameFinishBanner.showHomeButton();
        this.gameFinishBanner.changeRedoButton();
        this.gameFinishBanner.showWithText(message);
    }

    onGameStop(reason, lvBoundary) {
        let message;
        switch (reason) {
            case Reason.cancel:
                message =
                    `<span style="font-size: 18px;">Stage ${this.game.level}</span>` +
                    whats.loseMsg(this.game.level, lvBoundary);
                sound.playAlert();
                this.game.refreshGame();
                this.gameFinishBanner.showHomeButton();
                this.gameFinishBanner.changeRedoButton();
                break;
            case Reason.win:
                message = `Stage ${this.game.level} Clear!`;
                sound.playWin();
                this.game.level++;
                this.game.setLevel(this.game.level);
                this.gameFinishBanner.hideHomeButton();
                this.gameFinishBanner.changeNextButton();
                break;
            case Reason.lose:
                message =
                    `<span style="font-size: 18px;">Stage ${this.game.level}</span>` +
                    whats.loseMsg(this.game.level, lvBoundary);
                sound.playPumpkin();
                this.game.refreshGame();
                this.gameFinishBanner.showHomeButton();
                this.gameFinishBanner.changeRedoButton();
                break;
            default:
                throw new Error('not valid reason');
        }
        this.gameFinishBanner.showWithText(message);
    }
}
