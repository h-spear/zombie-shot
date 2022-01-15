import { db } from './init-firebase.js';

const emojis = ['🤴🏻', '🤩', '🤗', '😎', '😆', '😀', '😀', '🙂', '🙂', '🙂'];
export class DatabaseService {
    constructor() {
        this.rankingModeTitle = document.querySelector('.mode-title');
        this.rankingScoreName = document.querySelector('.ranking-score');
        this.rankingContents = document.querySelector(
            '.game__ranking-contents'
        );
        this.generateRankingContents;
    }

    pushRankingTag(rank, name, date, score, comment) {
        this.rankingContents.innerHTML += `
        <div class="game__ranking-content">
            <div class="ranking-no">${rank}</div>
            <div class="ranking-name">${name}</div>
            <div class="ranking-date">${date}</div>
            <div class="ranking-score">${score}</div>
            <div class="ranking-emoji">${emojis[rank - 1]}</div>
            <div class="ranking-comment">
                <div class="comment-info">${rank}위<br/>${name}</div>
                <div class="comment-content">${comment}</div>
            </div>
        </div>`;
    }

    generateRankingContents(rankingData) {
        this.rankingContents.innerHTML = '';
        let i = 1;
        rankingData.forEach((data, idx) => {
            const rank = idx + 1;
            const { no, name, date, score, comment } = data;
            this.pushRankingTag(rank, name, date, score, comment);
            i++;
        });
        while (i <= 10) this.pushRankingTag(i++, '', '', '', '');
    }

    loadRankingData(selectMode) {
        if (selectMode === 4) {
            this.rankingScoreName.innerText = 'Catched!';
        } else this.rankingScoreName.innerText = 'Level';

        db.collection(`mode${selectMode}`)
            .get()
            .then((res) => {
                const data = [];
                res.forEach((doc) => {
                    data.push(doc.data());
                });
                data.sort(function (a, b) {
                    return b.score - a.score;
                });
                this.generateRankingContents(data);
            });
    }
}
