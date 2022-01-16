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
    Item1Probability: 'this.level < 40 ? (81 - this.level) : 30', // nasa
    Item2Probability: 'this.level < 25 ? (50 - this.level) : 45', // eye
    scopeRate: 'this.level < 40 ? (440 - this.level * 7) : 150',
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
    else if (level <= levelArr[3]) message = loseText('CHEER UP! 😀');
    else if (level <= levelArr[4]) message = loseText('GOOD 😆');
    else if (level <= levelArr[5]) message = loseText('NICE~ 😎');
    else if (level <= levelArr[6]) message = loseText('GREAT! 🤗');
    else if (level <= levelArr[7]) message = loseText('EXCELLENT!! 🤩');
    else message = loseText('YOU ARE GOD!!! 🤴🏻🤴🏻🤴🏻', 26);
    return message;
}

function loseText(text, font_size = 32) {
    return `<br><span style="font-size: ${font_size}px;">${text}</span>`;
}

export const base_description = ``;

export const mode1_description = `
<span class="description-mode-title"><b>Strict Time Mode</b></span>에서<br>
모든 스테이지의 제한시간이 같습니다.<br>
스테이지가 넘어가도 라이프는 누적됩니다.<br>
스테이지가 높아질 수록 많은 수의 좀비를 빠르게 처치해야할 것입니다!<br><br>

<div class="description-box">
    <div class="description-minibox">
        <h3 style="font-size:30px">제한시간</h3><p style="">30초</p>
        <span>매 라운드 초기화</span>
    </div>
    <div class="description-minibox">
        <h3>기본 라이프</h3><p style="font-size:28px;">💖💖💖</p>
        <span>아이템 획득 시 누적</span>
    </div>
    <div class="description-minibox">
        <h3>블랙아웃</h3><p style="font-size:24px;">${mode1_settings.blackOutInterval}초에 한번</p>
        <span>1초간 검은 화면</span>
    </div>
</div>
<div class="description-item">
    <p>드랍되는 아이템</p>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">💖</span>라이프<br></div>
        <span>라이프 1 증가</span>
    </div>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">🕐</span>시계<br></div>
        <span>제한시간 ${item_settings.plus_time}초 증가</span>
    </div>
</div>
<button class="game__start start-mode1">게임시작</button>
<button style="margin-top: 15px;" class='game__how-to-play-btn'>게임방법</button>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
</div>
`;

export const mode2_description = `
<span class="description-mode-title"><b>Sequential Time Mode</b></span>는<br>
스테이지가 넘어가도 라이프와 제한시간이 누적되어 진행됩니다.<br>
기본 라이프는 <b>${mode2_settings.lifeCount}</b>, 초기 제공시간은 <b>${mode2_settings.gameDuration}초</b>입니다.<br>
<b>시간 증가 아이템</b>의 확보가 중요할 것입니다!<br><br>
<div class="description-box">
    <div class="description-minibox">
        <h3 style="font-size:24px; letter-spacing:-2px;">초기 제공시간</h3><p style="">${mode2_settings.gameDuration}</p>
        <span>아이템 획득 시 누적</span>
    </div>
    <div class="description-minibox">
        <h3>기본 라이프</h3><p style="font-size:28px;">💖</p>
        <span>아이템 획득 시 누적</span>
    </div>
    <div class="description-minibox">
        <h3>블랙아웃</h3><p style="font-size:24px;">${mode2_settings.blackOutInterval}초에 한번</p>
        <span>1초간 검은 화면</span>
    </div>
</div>
<div class="description-item">
    <p>드랍되는 아이템</p>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">💖</span>라이프<br></div>
        <span>라이프 1 증가</span>
    </div>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">🕐</span>시계<br></div>
        <span>제한시간 ${item_settings.plus_time}초 증가</span>
    </div>
</div>
<button class="game__start start-mode2">게임시작</button>
<button style="margin-top: 15px;" class='game__how-to-play-btn'>게임방법</button>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
</div>
`;

export const mode3_description = `
<span class="description-mode-title"><b>Dark Sniper Mode</b></span>는<br>
기본적으로 STRICT TIME MODE 방식으로 진행되지만,<br>
타겟의 스코프가 제한되어 난이도가 높을 수 있습니다.<br>
시간이 지날수록 스코프의 크기가 작아져 당신을 힘들게 할 것입니다.<br>
대신 기본 제공 라이프, 시간, 블랙아웃 타임 주기가 더 널널할 것입니다.<br>
<div class="description-box" style="margin-top:10px">
    <div class="description-minibox">
        <h3 style="font-size:30px">제한시간</h3><p style="">${mode3_settings.gameDuration}</p>
        <span style="letter-spacing:-1px;">아이템이 드랍되지 않음</span>
    </div>
    <div class="description-minibox">
        <h3>기본 라이프</h3><p style="font-size:28px;">💖 X ${mode3_settings.lifeCount}</p>
        <span style="letter-spacing:-1px;">아이템이 드랍되지 않음</span>
    </div>
    <div class="description-minibox">
        <h3>블랙아웃</h3><p style="font-size:24px;">${mode3_settings.blackOutInterval}초에 한번</p>
        <span>1초간 검은 화면</span>
    </div>
</div>
<div class="description-item" style="margin-top:55px">
    <p>드랍되는 아이템</p>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">🔩</span>나사<br></div>
        <span style="font-size: 14px">스코프 축소 ${item_settings.nasa_duration}초간 방지(중첩X)</span>
    </div>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">👁‍🗨</span>눈<br></div>
        <span>스코프 범위 ${item_settings.scope_range} 증가</span>
    </div>
</div>
<button style="margin-top: 15px;"class="game__start start-mode3">게임시작</button>
<button style="margin-top: 15px;" class='game__how-to-play-btn'>게임방법</button>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
</div>
`;

export const mode4_description = `
<span class="description-mode-title"><b>Infinite Zombie Mode</b></span>는<br>
화면에 무한히 나타나는 좀비들을 처치하면 됩니다!<br>
<b>${mode4_settings.gameDuration}초</b>동안 나타나는 좀비를 많이 잡는 모드입니다.<br>
좀비, 호박, 아이템은 모두 랜덤하게 나타나고 사라지므로,<br></b></span>
필요한 아이템은 즉시 잡아야 할 것입니다!<br>
<div class="description-box" style="margin-top:10px">
    <div class="description-minibox">
        <h3 style="font-size:30px">제한시간</h3><p style="">${mode4_settings.gameDuration}</p>
        <span style="letter-spacing:-1px;">아이템이 드랍되지 않음</span>
    </div>
    <div class="description-minibox">
        <h3>기본 라이프</h3><p style="font-size:28px;">💖 X ${mode4_settings.lifeCount}</p>
        <span style="letter-spacing:-1px;">아이템이 드랍되지 않음</span>
    </div>
    <div class="description-minibox">
        <h3>블랙아웃</h3><p style="font-size:24px;">${mode4_settings.blackOutInterval}초에 한번</p>
        <span>1초간 검은 화면</span>
    </div>
</div>
<div class="description-item" style="margin-top:55px">
    <p>드랍되는 아이템</p>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">💣</span>폭탄<br></div>
        <span>필드 클리어</span>
    </div>
    <div>
        <div><span style="font-size: 28px; margin-right:10px">☀️</span>태양<br></div>
        <span style="font-size: 14px">${item_settings.sun_duration}초간 블랙아웃 정지(중첩X)<br></span>
    </div>
</div>
<button style="margin-top: 15px;" class="game__start start-mode4">게임시작</button>
<button style="margin-top: 15px;" class='game__how-to-play-btn'>게임방법</button>
<button class="game__prev-btn"><i class="fas fa-angle-double-left"></i></button>
</div>


`;
