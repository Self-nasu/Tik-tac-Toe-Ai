const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const restartButton = document.getElementById('restartButton');
let currentTurn = X_CLASS;


startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    currentTurn = X_CLASS;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.innerText = '';
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    winningMessageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    placeMark(cell, currentTurn);
    if (checkWin(currentTurn)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        if (currentTurn === O_CLASS) {
            const bestMove = minimax([...cellElements], 0, true).index;
            placeMark(cellElements[bestMove], O_CLASS);
            if (checkWin(O_CLASS)) {
                endGame(false);
            } else if (isDraw()) {
                endGame(true);
            }
            swapTurns();
        }
    }
}

function endGame(draw) {
    if (draw) {
        winningMessageTextElement.innerText = "It's a Draw!";
    } else {
        winningMessageTextElement.innerText = `Hey ${currentTurn === X_CLASS ? "X" : "AI"} Wins!`;
    }
    winningMessageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.innerText = currentClass.toUpperCase();
}

function swapTurns() {
    currentTurn = currentTurn === X_CLASS ? O_CLASS : X_CLASS;
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}

function minimax(board, depth, isMaximizing) {
    const availableSpots = getAvailableSpots(board);

    if (checkWin(O_CLASS)) {
        return { score: 10 - depth };
    } else if (checkWin(X_CLASS)) {
        return { score: depth - 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = board.indexOf(availableSpots[i]);
        board[move.index].classList.add(isMaximizing ? O_CLASS : X_CLASS);

        const result = minimax(board, depth + 1, !isMaximizing);
        move.score = result.score;

        board[move.index].classList.remove(isMaximizing ? O_CLASS : X_CLASS);
        moves.push(move);
    }

    let bestMove;
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

function getAvailableSpots(board) {
    return board.filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS);
    });
}
