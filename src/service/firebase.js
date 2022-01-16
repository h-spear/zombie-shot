import { db } from './init-firebase.js';

const emojis = ['🤴🏻', '🤩', '😍', '🤗', '😎', '😆', '😀', '😏', '😳', '🙂'];

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
            <button class="ranking-emoji">${emojis[rank - 1]}</button>
            <div class="ranking-comment hidden">
                <div class="comment-rank">${rank}위</div>
                <div class="comment-name">${name}</div>
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
        const gameRankingEmojis = document.querySelectorAll('.ranking-emoji');
        const gameRankingComments =
            document.querySelectorAll('.ranking-comment');
        gameRankingEmojis.forEach((emoji, index) => {
            emoji.addEventListener('click', () => {
                if (gameRankingComments[index].childNodes[5].textContent === '')
                    return;
                if (!gameRankingComments[index].classList.contains('hidden')) {
                    gameRankingComments[index].classList.add('hidden');
                    return;
                }
                gameRankingComments.forEach((comment) => {
                    comment.classList.add('hidden');
                });
                gameRankingComments[index].classList.remove('hidden');
            });
        });
        gameRankingComments.forEach((comment) => {
            comment.addEventListener('click', () => {
                comment.classList.add('hidden');
            });
        });
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

    saveRankingData(mode, name, comment, score) {
        db.collection(`mode${mode}`).add({
            no: Date.now(),
            name,
            comment,
            score,
            date: getToday(),
        });
    }
}

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return year + '-' + month + '-' + day;
}
