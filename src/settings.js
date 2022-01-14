/**
 * Settings
 * gameDuration : 게임 지속 시간
 * lifeCount : 시작 라이프 수
 * levelBoundary : loseMsg 출력 기준 레벨
 * ItemProbability : 각 아이템 등장 확률(최대 3개)
 * blackOutInterval : 블랙아웃 타임이 나타나는 시간
 * scopeRate : 스나이퍼 모드에서 스코프 감소 범위
 */
export const mode_title = 'ZOMBIE SHOT';

export const mode1_settings = {
    gameDuration: 30,
    lifeCount: 3,
    levelBoundary: [1, 3, 7, 11, 17, 22, 35, 50],
    Item1Probability: '(this.level / 2 < 25) ? this.level / 2 : 25', // time
    Item2Probability: '(50 - this.level) > 10 ? (50 - this.level) : 10', // life
    blackOutInterval: 5,
};

export const mode2_settings = {
    gameDuration: 10,
    lifeCount: 1,
    levelBoundary: [1, 3, 5, 10, 15, 20, 30, 45],
    Item1Probability: '80', //time
    Item2Probability: '20', //life
    blackOutInterval: 5,
};

export const mode3_settings = {
    gameDuration: 60,
    lifeCount: 10,
    levelBoundary: [1, 3, 5, 11, 13, 17, 24, 35],
    Item1Probability: '(90 - this.level) > 40 ? (50 - this.level) : 40', // nasa
    Item2Probability: '(90 - this.level * 2) > 40 ? (50 - this.level) : 40', // eye
    scopeRate: '(400 - this.level * 3) > 150 ? (400 - this.level * 3) : 150',
    blackOutInterval: 15,
};

export const mode4_settings = {
    gameDuration: 300,
    lifeCount: 3,
    levelBoundary: [10, 30, 50, 100, 150, 300, 444, 777],
    Item1Probability: '100', // Random
    Item2Probability: '100', // Random
    blackOutInterval: 11,
};

export const item_settings = {
    plus_time: 5, // 시계 아이템 획득 시 증가 시간
    nasa_duration: 8, // 나사 아이템 획득 시 지속 시간
    scope_range: 75, // 스코프 아이템 획득 시 증가 범위
    sun_duration: 15, // 태양 아이템 획득 시 지속 시간
};

export const difficulty = [
    25,
    // zombie count, zombie min width, zombie max width, pumpkin count
    [1, 140, 170, 3], //1
    [2, 140, 170, 3], //2
    [4, 120, 150, 3], //3
    [5, 110, 140, 6], //4
    [7, 100, 130, 6], //5
    [10, 80, 130, 8], //6
    [12, 80, 110, 10], //7
    [14, 70, 100, 12], //8
    [17, 65, 85, 15], //9
    [20, 55, 75, 17], //10
    [22, 50, 75, 20], //11
    [24, 50, 70, 22], //12
    [24, 45, 65, 24], //13
    [27, 40, 60, 25], //14
    [28, 40, 55, 25], //15
    [29, 35, 55, 27], //16
    [30, 30, 55, 29], //17
    [31, 30, 55, 29], //18
    [33, 25, 50, 30], //19
    [35, 25, 50, 30], //20
    [37, 25, 45, 30], //21
    [40, 25, 45, 33], //22
    [41, 25, 45, 35], //23
    [43, 25, 45, 37], //24
    [45, 25, 45, 40], //25
    [46, 25, 40, 42], //26
    [48, 25, 40, 42], //27
    [50, 25, 40, 44], //28
    [52, 25, 40, 44], //29
    [55, 25, 40, 45], //30
];

export const difficultyInfiniteMode = [[], [2, 25, 80, 2]];

export function loseMsg(level, levelArr) {
    let message;
    if (level <= levelArr[0]) message = loseText('YOU LOST 🤮');
    else if (level <= levelArr[1]) message = loseText('BAD... 😭');
    else if (level <= levelArr[2]) message = loseText('So so... 🙄');
    else if (level <= levelArr[3]) message = loseText('CHEER UP! 😆');
    else if (level <= levelArr[4]) message = loseText('GOOD 😀');
    else if (level <= levelArr[5]) message = loseText('NICE~ 😎');
    else if (level <= levelArr[6]) message = loseText('GREAT! 🤗');
    else if (level <= levelArr[7]) message = loseText('EXCELLENT!! 🤩');
    else message = loseText('YOU ARE GOD!!! 🤴🏻🤴🏻🤴🏻', 26);
    return message;
}

function loseText(text, font_size = 32) {
    return `<br><span style="font-size: ${font_size}px;">${text}</span>`;
}

export const base_description = `
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
시간 ${item_settings.plus_time}초 증가<br><br>`;

export const mode1_description =
    base_description +
    `
<div class="important">
<span style="font-size: 22px;"><b>Strict Time Mode</b></span>는<br>
모든 스테이지의 제한시간은 <b>${mode1_settings.gameDuration}초</b>로 같습니다.<br>
스테이지가 넘어가도 라이프는 누적되며, 제한시간은 초기화됩니다.<br>
스테이지가 높아질 수록 많은 수의 좀비를 빠르게 처치해야할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode1">게임시작</button>
</div>
`;

export const mode2_description =
    base_description +
    `
<div class="important">
<span style="font-size: 22px;"><b>Sequential Time Mode</b></span>는<br>
스테이지가 넘어가도 라이프와 제한시간이 누적되어 진행됩니다.<br>
기본 라이프는 <b>${mode2_settings.lifeCount}</b>, 초기 제한시간은 <b>${mode2_settings.gameDuration}초</b>입니다.<br>
<b>시간 증가 아이템</b>의 확보가 중요할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode2">게임시작</button>
</div>
`;

export const mode3_description = `
게임방법은 간단합니다.<br>
화면에 나타난 좀비들을 처치하면 됩니다!<br><br>
<span style="color: red;"><b>단, 호박을 터트려서는 안됩니다!</b></span><br>
호박을 터트릴 경우, 게임이 종료됩니다.<br>
상단에 남은 좀비 수, 제한시간, 라이프 등 정보가 표기됩니다.<br><br>
단, 타겟의 스코프가 제한되어 난이도가 높을 수 있습니다.<br>
단계가 높아질수록 스코프의 크기가 작아져 당신을 힘들게 할 것입니다.<br>
대신 블랙아웃 타임은 ${mode3_settings.blackOutInterval}초에 한번씩 찾아옵니다.<br><br>

마지막으로, 확률적으로 생성되는 아이템들이 있습니다.<br>
<span style="font-size: 28px">🔩</span>
스코프 축소 ${item_settings.nasa_duration}초간 방지(중첩X)
<span style="font-size: 28px">👁‍🗨</span>
스코프 범위 ${item_settings.scope_range} 증가<br><br>
<div class="important">
<span style="font-size: 22px;"><b>Dark Sniper Mode</b></span>는<br>
제한시간 <b>${mode3_settings.gameDuration}초</b>로, Strict Time Mode로 진행됩니다.<br>
기본 라이프는 <b>${mode3_settings.lifeCount}</b>이며 <span style="color: red;"><b>라이프, 시간 증가 아이템은 드랍되지 않습니다.<br></b></span>
시야가 좁으므로, 신중하게 저격해야할 것입니다.<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode3">게임시작</button>
</div>
`;

export const mode4_description = `
게임방법은 간단합니다.<br>
화면에 무한히 나타나는 좀비들을 처치하면 됩니다!<br><br>
<span style="color: red;"><b>단, 호박을 터트려서는 안됩니다!</b></span><br>
호박을 터트릴 경우, 게임이 종료됩니다.<br>
상단에 잡은 좀비 수, 제한시간, 라이프 등 정보가 표기됩니다.<br><br>
좀비들은 일정 시간이 지나면 사라집니다.<br>
시간이 지날수록 작은 좀비가 빠르게 나왔다 사라질 것입니다.<br>
블랙아웃 타임은 ${mode4_settings.blackOutInterval}초에 한번씩 찾아옵니다.<br><br>

마지막으로, 확률적으로 생성되는 아이템들이 있습니다.<br>
<span style="font-size: 28px">💣</span>
필드 클리어
<span style="font-size: 28px">☀️</span>
${item_settings.sun_duration}초간 블랙아웃 정지(중첩X)<br><br>
<div class="important">
<span style="font-size: 22px;"><b>Infinite Zombie Mode</b></span>는<br>
<b>${mode4_settings.gameDuration}초</b>동안 많은 좀비를 잡는 모드입니다.<br>
좀비, 호박, 아이템은 모두 랜덤한 시간 후 사라지므로,<br></b></span>
필요한 아이템은 즉시 잡아야 할 것입니다!<br>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
<button class="game__start start-mode4">게임시작</button>
</div>
`;
