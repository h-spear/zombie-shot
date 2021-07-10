'use strict'

import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game-set.js";
import { difficulty, difficultyInfiniteMode, loseMsg } from "./game-details.js";
import * as sound from "./sound.js";

const mode_title = `ZOMBIE SHOT`;

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
const mode1_levelBoundary = [1, 3, 7, 15, 20, 35, 50, 75];
const mode1_Item1Probability = '(this.level / 2 < 25) ? this.level / 2 : 25';
const mode1_Item2Probability = '(50 - this.level) > 10 ? (50 - this.level) : 10';
const mode1_blackOutInterval = 5;
let mode1_description = mode_description + `
<div class="important">
<span style="font-size: 22px;"><b>Strict Time Mode</b></span>는<br>
모든 스테이지의 제한시간은 <b>${mode1_gameDuration}초</b>로 같습니다.<br>
스테이지가 넘어가도 라이프는 누적되며, 제한시간은 초기화됩니다.<br>
스테이지가 높아질 수록 많은 수의 좀비를 빠르게 처치해야할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode1">게임시작</button>
</div>
`;

const mode2_gameDuration = 10;
const mode2_lifeCount = 1;
const mode2_levelBoundary = [1, 5, 10, 15, 30, 45, 60, 80];
const mode2_Item1Probability = '80';//time
const mode2_Item2Probability = '20';//life
const mode2_blackOutInterval = 5;
let mode2_description = mode_description + `
<div class="important">
<span style="font-size: 22px;"><b>Sequential Time Mode</b></span>는<br>
스테이지가 넘어가도 라이프와 제한시간이 누적되어 진행됩니다.<br>
기본 라이프는 <b>${mode2_lifeCount}</b>, 초기 제한시간은 <b>${mode2_gameDuration}초</b>입니다.<br>
<b>시간 증가 아이템</b>의 확보가 중요할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode2">게임시작</button>
</div>
`;

const mode3_gameDuration = 60;
const mode3_lifeCount = 10;
const mode3_levelBoundary = [1, 5, 10, 17, 29, 44, 55, 77];
const mode3_Item1Probability = '(90 - this.level) > 40 ? (50 - this.level) : 40';
const mode3_Item2Probability = '(90 - this.level * 2) > 40 ? (50 - this.level) : 40';
const mode3_scopeRate = '(400 - this.level * 3) > 150 ? (400 - this.level * 3) : 150';
const mode3_blackOutInterval = 15;
let mode3_description = `
게임방법은 간단합니다.<br>
화면에 나타난 좀비들을 처치하면 됩니다!<br><br>
<span style="color: red;"><b>단, 호박을 터트려서는 안됩니다!</b></span><br>
호박을 터트릴 경우, 게임이 종료됩니다.<br>
상단에 남은 좀비 수, 제한시간, 라이프 등 정보가 표기됩니다.<br><br>
단, 타겟의 스코프가 제한되어 난이도가 높을 수 있습니다.<br>
단계가 높아질수록 스코프의 크기가 작아져 당신을 힘들게 할 것입니다.<br>
대신 블랙아웃 타임은 ${mode3_blackOutInterval}초에 한번씩 찾아옵니다.<br><br>

마지막으로, 확률적으로 생성되는 아이템들이 있습니다.<br>
<span style="font-size: 28px">🔩</span>
스코프 축소 8초간 방지(중첩X)　　　
<span style="font-size: 28px">👁‍🗨</span>
스코프 범위 50 증가<br><br>
<div class="important">
<span style="font-size: 22px;"><b>Dark Sniper Mode</b></span>는<br>
제한시간 <b>${mode3_gameDuration}초</b>로, Strict Time Mode로 진행됩니다.<br>
기본 라이프는 <b>${mode3_lifeCount}</b>이며 <span style="color: red;"><b>라이프, 시간 증가 아이템은 드랍되지 않습니다.<br></b></span>
시야가 좁으므로, 신중하게 저격해야할 것입니다.<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode3">게임시작</button>
</div>
`;

const mode4_gameDuration = 300;
const mode4_lifeCount = 3;
const mode4_levelBoundary = [10, 30, 50, 100, 150, 300, 444, 777];
const mode4_Item1Probability = '100';
const mode4_Item2Probability = '100';
const mode4_blackOutInterval = 11;
let mode4_description = `
게임방법은 간단합니다.<br>
화면에 무한히 나타나는 좀비들을 처치하면 됩니다!<br><br>
<span style="color: red;"><b>단, 호박을 터트려서는 안됩니다!</b></span><br>
호박을 터트릴 경우, 게임이 종료됩니다.<br>
상단에 잡은 좀비 수, 제한시간, 라이프 등 정보가 표기됩니다.<br><br>
좀비들은 일정 시간이 지나면 사라집니다.<br>
시간이 지날수록 작은 좀비가 빠르게 나왔다 사라질 것입니다.<br>
블랙아웃 타임은 ${mode4_blackOutInterval}초에 한번씩 찾아옵니다.<br><br>

마지막으로, 확률적으로 생성되는 아이템들이 있습니다.<br>
<span style="font-size: 28px">💣</span>
필드 클리어　　　
<span style="font-size: 28px">☀️</span>
15초간 블랙아웃 정지(중첩X)<br><br>
<div class="important">
<span style="font-size: 22px;"><b>Infinite Zombie Mode</b></span>는<br>
<b>${mode4_gameDuration}초</b>동안 많은 좀비를 잡는 모드입니다.<br>
좀비, 호박, 아이템은 모두 랜덤한 시간 후 사라지므로,<br></b></span>
필요한 아이템은 즉시 잡아야 할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode4">게임시작</button>
</div>
`;

const soundA = new Audio('./sound/bg-start.mp3');

export function volumeSoundA(vol) {
  soundA.volume = vol;
}

export class GameModes{
  constructor(){
    this.gameStartBtn = document.querySelectorAll('.game__mode-btn');
    this.gameFinishBanner = new PopUp();
    this.game;

    this.gameTitle = document.querySelector('.game__title');
    this.gameDescription = document.querySelector('.game__description');
    this.gameStartBox = document.querySelector('.game__start-box');
    this.gameStartBtnBox = document.querySelector('.game__btn-box');
    this.gameField = document.querySelector('.game__field');

    this.gameStartBtnBox.addEventListener('click', (e) => {
      const target = e.target;
      if(target.nodeName === 'BUTTON')
      {
        const mode = parseInt(target.dataset.mode);
        this.gameStart(mode);
        sound.playGunShot2();
      }
    });

    this.gameFinishBanner.setClickListener(() => {
      this.game.start();
    });

    this.gameFinishBanner.setHomeClickListener(() => {
      this.game.clear();
      this.playBg();
      this.showStartBox();
    });
  }

  playBg(){
    soundA.currentTime = 0;
    soundA.loop = true;
    soundA.play();
  }

  stopBg(){
    soundA.pause();
  }

  gameStart(mode){
    this.hideStartBox();
    this.gameField.classList.add('description');
    const boxContainer = document.createElement('div');
    boxContainer.setAttribute('class', 'box-container');
    this.gameField.appendChild(boxContainer);
    const title = document.createElement('h1');
    title.setAttribute('class', 'game__title');
    boxContainer.appendChild(title);
    const description = document.createElement('span');
    description.setAttribute('class', 'game__description');
    boxContainer.appendChild(description);
    title.innerText = mode_title;
    description.innerHTML = eval(`mode${mode}_description`);

    const prevBtn = document.querySelector('.game__prev-btn');
    prevBtn.addEventListener('click', () => {
      this.showStartBox();
      this.gameField.innerHTML = '';
      this.gameField.classList.remove('description');
    });

    const startMode = document.querySelector(`.start-mode${mode}`);
    startMode.addEventListener('click', () => {
      this.stopBg();
      sound.playZombie3();
      this.game = new GameBuilder()
      .gameDuration(eval(`mode${mode}_gameDuration`))
      .difficulty(mode === 4 ? difficultyInfiniteMode : difficulty)
      .lifeCount(eval(`mode${mode}_lifeCount`))
      .mode(mode)
      .build();

      if(mode === 3)
        this.game.setScopeRate(eval(`mode${mode}_scopeRate`));
      
      this.lvBoundary = eval(`mode${mode}_levelBoundary`);
      this.game.setItem1Probability(eval(`mode${mode}_Item1Probability`));
      this.game.setItem2Probability(eval(`mode${mode}_Item2Probability`));
      this.game.setBlackOutInterval(eval(`mode${mode}_blackOutInterval`));
      if(mode === 4)
        this.game.setGameStopListener(reason => this.onGameStopInfiniteMode(reason, this.lvBoundary));
      else
        this.game.setGameStopListener(reason => this.onGameStop(reason, this.lvBoundary));
      this.game.start();
    });
  }

  hideStartBox(){
    this.gameField.style.display = 'flex';
    this.gameStartBox.style.display = 'none';
  }

  showStartBox(){
    this.gameField.style.display = 'none';
    this.gameStartBox.style.display = 'flex';
  }

  onGameStopInfiniteMode(reason, lvBoundary) {
    let message = `<span style="font-size: 18px;">Zombie ${this.game.score} shoted!</span>`
    + loseMsg(this.game.score, lvBoundary);
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
