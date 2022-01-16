import PopUp from './popup.js';
import { GameBuilder, Reason } from './game-set.js';
import * as sound from './sound.js';
import * as settings from './settings.js';
import { DatabaseService } from './service/firebase.js';

const soundA = new Audio('./sound/bg-start.mp3');
const pattern_gap = /\s/g;

export function volumeSoundA(vol) {
    soundA.volume = vol;
}

export class GameBody {
    constructor() {
        this.DB = new DatabaseService();
        this.gameFinishBanner = new PopUp();
        this.game;
        this.gameMode;

        this.currentPage;
        this.gameTitle = document.querySelector('.game__title');
        this.gameDescription = document.querySelector('.game__description');
        this.gameModeBtn = document.querySelectorAll('.game__mode-btn');
        this.gameModeBtnBox = document.querySelector('.game__mode-btn-box');
        this.gameModePage = document.querySelector('.game__mode-page');
        this.gameRankingPage = document.querySelector('.game__ranking-page');
        this.gameNoticePage = document.querySelector('.game__notice-page');
        //this.gameLogBtn = document.querySelector('.game__log-btn');
        //this.gameRuleBtn = document.querySelector('.game__rule-btn');
        this.gameField = document.querySelector('.game__field');
        this.gameNoticeBtnBox = document.querySelector('.game__btn-container');
        this.gameNoticeContents = document.querySelectorAll('.notice-content');
        this.gameLogBtn = document.querySelector('.game__update-log-btn');
        this.gameRankingModeBox = document.querySelector(
            '.game__ranking-mode-box'
        );
        this.gameRankingPrevBtn = document.querySelector(
            '.game__ranking-prev-btn'
        );

        this.gameNoticePrevBtn = document.querySelector(
            '.game__notice-prev-btn'
        );

        this.gameMode;

        this.gameNoticeBtnBox.addEventListener('click', (e) => {
            const selected = e.target.dataset.content;

            if (selected === undefined) {
                return;
            }
            this.hideModePage();
            this.showNoticePage(selected);
        });

        this.gameLogBtn.addEventListener('click', (e) => {
            this.hideModePage();
            this.showNoticePage(0);
        });

        this.gameNoticePrevBtn.addEventListener('click', () => {
            for (let i = 0; i < 4; i++)
                this.gameNoticePage.classList.remove(`notice${i}`);
            this.hideNoticePage();
            sound.playGunShot2();
            if (this.currentPage !== 'description') {
                this.showModePage();
                return;
            }
        });

        this.gameModeBtnBox.addEventListener('click', (e) => {
            const target = e.target;
            if (target.nodeName === 'BUTTON') {
                this.gameMode = parseInt(target.dataset.mode);

                // 준비중인 모드 접근 불가
                if (this.gameMode > 4) {
                    alert('Coming Soon');
                    return;
                }
                this.gameStart(this.gameMode);
                sound.playGunShot2();
            }
        });

        this.gameRankingModeBox.addEventListener('click', (e) => {
            const mode = e.target.dataset.mode;
            if (mode === undefined) return;

            this.DB.loadRankingData(mode);
            this.showRankingPage(mode);
            this.gameNoticePage.style.display = 'none';
            sound.playGunShot2();
        });

        this.gameRankingPrevBtn.addEventListener('click', () => {
            this.hideRankingPage();
            this.showNoticePage(3);
            sound.playGunShot2();
        });

        this.gameFinishBanner.setClickListener(() => {
            this.game.start();
        });

        this.gameFinishBanner.setHomeClickListener(() => {
            this.game.clear();
            this.playBg();
            this.showModePage();
        });

        this.gameFinishBanner.setWriteClickListener(() => {
            this.gameFinishBanner.toggleWriteForm();
        });

        this.gameFinishBanner.setSubmitListener(() => {
            const { name, comment } = this.gameFinishBanner.getFormData();
            if (
                name.replace(pattern_gap, '') === '' ||
                comment.replace(pattern_gap, '') === ''
            ) {
                alert('Blanks exist!');
                return;
            }

            const replaced = comment.replace(/(?:\r\n|\r|\n)/g, '<br />');
            const score =
                this.gameMode === 4 ? this.game.score : this.game.currentLevel;
            this.DB.saveRankingData(this.gameMode, name, replaced, score);
            alert('Success!');
            this.gameFinishBanner.hideWriteForm();
            this.gameFinishBanner.hideWriteButton();
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

    hideNoticePage() {
        this.gameField.style.display = 'flex';
        this.gameNoticePage.style.display = 'none';
    }

    showNoticePage(selected) {
        this.gameNoticePage.classList.add(`notice${selected}`);
        this.gameField.style.display = 'none';
        this.gameNoticePage.style.display = 'flex';
        this.gameNoticeContents.forEach((content) => {
            content.classList.add('invisible');
        });
        this.gameNoticeContents[selected].classList.remove('invisible');
    }

    hideModePage() {
        this.gameField.style.display = 'flex';
        this.gameModePage.style.display = 'none';
    }

    showModePage() {
        this.currentPage = 'modesel';
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
        title.innerText = settings.mode_title;
        description.innerHTML = eval(`settings.mode${mode}_description`);

        const prevBtn = document.querySelector('.game__prev-btn');
        prevBtn.addEventListener('click', () => {
            this.showModePage();
            this.gameField.innerHTML = '';
            this.gameField.classList.remove('description');
            sound.playGunShot2();
        });

        // 게임 시작 버튼 만들기
        const startMode = document.querySelector(`.start-mode${mode}`);
        startMode.addEventListener('click', () => {
            this.stopBg();
            sound.playZombie3();
            this.game = new GameBuilder()
                .gameDuration(
                    eval(`settings.mode${mode}_settings.gameDuration`)
                )
                .difficulty(
                    mode === 4
                        ? settings.difficultyInfiniteMode
                        : settings.difficulty
                )
                .lifeCount(eval(`settings.mode${mode}_settings.lifeCount`))
                .mode(mode)
                .build();
            if (mode === 3)
                this.game.setScopeRate(
                    eval(`settings.mode${mode}_settings.scopeRate`)
                );

            this.lvBoundary = eval(
                `settings.mode${mode}_settings.levelBoundary`
            );
            this.game.setItem1Probability(
                eval(`settings.mode${mode}_settings.Item1Probability`)
            );
            this.game.setItem2Probability(
                eval(`settings.mode${mode}_settings.Item2Probability`)
            );
            this.game.setBlackOutInterval(
                eval(`settings.mode${mode}_settings.blackOutInterval`)
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

        const howToPlayBtn = document.querySelector('.game__how-to-play-btn');
        howToPlayBtn.addEventListener('click', () => {
            this.currentPage = 'description';
            this.showNoticePage(1);
            this.gameField.classList.add('invisible');
            sound.playGunShot2();
        });
    }

    onGameStopInfiniteMode(reason, lvBoundary) {
        let message =
            `<span style="font-size: 20px;">Zombie ${this.game.score} shoted!</span>` +
            settings.loseMsg(this.game.score, lvBoundary);
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
        this.gameFinishBanner.hideWriteForm();
        this.gameFinishBanner.showWriteButton();
        this.gameFinishBanner.showHomeButton();
        this.gameFinishBanner.changeRedoButton();
        this.gameFinishBanner.showWithText(message);
    }

    onGameStop(reason, lvBoundary) {
        let message;
        switch (reason) {
            case Reason.cancel:
                message =
                    `<span style="font-size: 22px;">Stage ${this.game.level}</span>` +
                    settings.loseMsg(this.game.level, lvBoundary);
                sound.playAlert();
                this.game.refreshGame();
                this.gameFinishBanner.hideWriteForm();
                this.gameFinishBanner.showWriteButton();
                this.gameFinishBanner.showHomeButton();
                this.gameFinishBanner.changeRedoButton();
                break;
            case Reason.win:
                message = `Stage ${this.game.level} Clear!`;
                sound.playWin();
                this.game.level++;
                this.game.setLevel(this.game.level);
                this.gameFinishBanner.hideWriteForm();
                this.gameFinishBanner.hideWriteButton();
                this.gameFinishBanner.hideHomeButton();
                this.gameFinishBanner.changeNextButton();
                break;
            case Reason.lose:
                message =
                    `<span style="font-size: 18px;">Stage ${this.game.level}</span>` +
                    settings.loseMsg(this.game.level, lvBoundary);
                sound.playPumpkin();
                this.game.refreshGame();
                this.gameFinishBanner.hideWriteForm();
                this.gameFinishBanner.showWriteButton();
                this.gameFinishBanner.showHomeButton();
                this.gameFinishBanner.changeRedoButton();
                break;
            default:
                throw new Error('not valid reason');
        }
        this.gameFinishBanner.showWithText(message);
    }
}
