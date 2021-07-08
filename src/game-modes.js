'use strict'

import PopUp from "./popup.js";
import { GameStrictTimeModeBuilder,GameSequentialModeBuilder, Reason } from "./game-set.js";
import { difficulty, loseMsg } from "./game-details.js";
import * as sound from "./sound.js";

const mode_description = `
게임방법은 간단합니다.<br>
화면에 나타난 좀비들을 처치하면 됩니다!<br><br>
<span style="color: red;"><b>단, 호박을 터트려서는 안됩니다!</b></span><br>
호박을 터트릴 경우, 라이프가 <b>1</b>씩 감소합니다.<br>
상단에 남은 좀비 수, 제한시간, 라이프 등 정보가 표기됩니다.<br><br>
또한, 5초에 한번씩 <span style="font-size: 24px; color: red;">
  블랙아웃 타임</span>이 찾아옵니다.<br>
블랙아웃이 찾아오면 1초동안 검은 화면으로 뒤덮이고,<br>
블랙아웃 후에는 좀비와 호박의 위치가 변경되어 있을 것입니다!<br><br>
마지막으로, 확률적으로 생성되는 아이템들이 있습니다.<br>
<span style="font-size: 28px">💖</span>
라이프 1 회복　　　
<span style="font-size: 28px">🕐</span>
시간 5초 증가<br><br>`;

const mode1_gameDuration = 30;
const mode1_lifeCount = 3;
const mode1_levelBoundary = [1, 3, 7, 15, 20, 35, 50, 70];
const mode1_timeItemProbability = '(this.level / 2 < 25) ? this.level / 2 : 25';
const mode1_LifeItemProbability = '(50 - this.level) > 10 ? (50 - this.level) : 10';
let mode1_description = mode_description + `
<div class="important">
<span style="font-size: 22px;"><b>Strict Time Mode</b></span>는<br>
모든 스테이지의 제한시간이 같습니다.<br>
기본 라이프는 <b>${mode1_lifeCount}</b>, 초기 제한시간은 <b>${mode1_gameDuration}초</b>입니다.<br>
스테이지가 높아질 수록 많은 수의 좀비를 빠르게 처치해야할 것입니다!<br>
<button class="game__start start-mode1">게임시작</button>
</div>
`;

const mode2_gameDuration = 10;
const mode2_lifeCount = 1;
const mode2_levelBoundary = [1, 3, 7, 15, 20, 35, 50, 70];
const mode2_timeItemProbability = '(50 - this.level > 10) ? (50 - this.level) : 10';
const mode2_LifeItemProbability = '10';
let mode2_description = mode_description + `
<div class="important">
<span style="font-size: 22px;"><b>Sequential Time Mode</b></span>는<br>
스테이지가 올라가도 이전 스테이지의 제한시간으로 이어서 진행됩니다.<br>
기본 라이프는 <b>${mode2_lifeCount}</b>, 초기 제한시간은 <b>${mode2_gameDuration}초</b>입니다.<br>
라이프가 적으므로 조심해야하고, <b>시간 증가 아이템</b>이 중요할 것입니다!<br>
<button class="game__start start-mode2">게임시작</button>
</div>
`;

export class GameModes{
  constructor(){
    this.gameStartBtn = document.querySelectorAll('.game__mode-btn');
    this.gameFinishBanner = new PopUp();
    this.game;

    this.gameTitle = document.querySelector('.game__title');
    this.gameDescription = document.querySelector('.game__description');
    this.gameStartBox = document.querySelector('.game__start-box');
    this.gameStartBtnBox = document.querySelector('.game__btn-box');

    this.gameStartBtnBox.addEventListener('click', (e) => {
      const target = e.target;
      if(target.nodeName === 'BUTTON')
      {
        const mode = parseInt(target.dataset.mode);
        if(mode === 3 || mode === 4)
          window.alert('준비중입니다.');
        else
          this.gameStart(target.dataset.mode);
      }
    });

    this.gameFinishBanner.setClickListener(() => {
      this.game.start();
    });

    this.gameFinishBanner.setHomeClickListener(() => {
      this.game.clear();
      this.showStartBox();
    });
  }

  gameStart(mode){
    this.gameTitle.innerText = "게임방법";
    this.gameDescription.innerHTML = eval(`mode${mode}_description`);
    this.gameStartBtnBox.style.display = 'none';
    const startMode = document.querySelector(`.start-mode${mode}`);
    startMode.addEventListener('click', () => {
      this.hideStartBox();
      this.game = new GameSequentialModeBuilder()
        .gameDuration(eval(`mode${mode}_gameDuration`))
        .difficulty(difficulty)
        .lifeCount(eval(`mode${mode}_lifeCount`))
        .build();
      this.game.start();

      this.lvBoundary = eval(`mode${mode}_levelBoundary`);
      this.game.setTimeItemProbability(eval(`mode${mode}_timeItemProbability`));
      this.game.setLifeItemProbability(eval(`mode${mode}_LifeItemProbability`));
      this.game.setGameStopListener(reason => this.onGameStopFunction(reason, this.lvBoundary));
    });
  }

  hideStartBox(){
    this.gameStartBox.style.display = 'none';
  }

  showStartBox(){
    this.game
    this.gameStartBox.style.display = 'block';
    this.gameTitle.innerText = '좀비 샷';
    this.gameDescription.innerHTML = `게임모드를 선택하세요.<br>`;
    this.gameStartBtnBox.style.display = 'block';
  }

  onGameStopFunction(reason, lvBoundary) {
    let message;
    switch (reason) {
      case Reason.cancel:
        message = 'REPLAY ❓'
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
        message = `<span style="font-size: 18px;">Stage ${this.game.level}</span>`
                  + loseMsg(this.game.level, lvBoundary);
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
