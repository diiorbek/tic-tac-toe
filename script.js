document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.querySelector('.close');
    const restartButton = document.getElementById('restartButton');
    const twoPlayersButton = document.getElementById('twoPlayers');
    const withBotButton = document.getElementById('withBot');

    let isBotMode = false;
    let currentPlayer = 'x';
    let boardState = Array(9).fill(null);
    let isPlayerTurn = true; // Флаг, который контролирует, чья очередь

    const initializeBoard = () => {
        board.innerHTML = '';
        boardState = Array(9).fill(null);
        currentPlayer = 'x';
        isPlayerTurn = true; // Начало игры — это ход игрока

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => handleClick(i));
            board.appendChild(cell);
        }
    };

    const handleClick = (index) => {
        if (!isPlayerTurn || boardState[index] || checkWinner()) return;

        boardState[index] = currentPlayer;
        updateBoard();

        if (checkWinner()) {
            showModal(`${currentPlayer} won! 🥳`);
        } else if (boardState.every(cell => cell)) {
            showModal('Ничья');
        } else {
            if (isBotMode && currentPlayer === 'x') {
                currentPlayer = 'o';
                isPlayerTurn = false; // Отключаем возможность хода игрока до хода бота
                setTimeout(botMove, 500);
            } else {
                currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
                isPlayerTurn = true; // Включаем возможность следующего игрока
            }
        }
    };

    const updateBoard = () => {
        const cells = board.querySelectorAll('.cell');
        cells.forEach((cell, index) => {
            cell.textContent = boardState[index];
            cell.classList.toggle('x', boardState[index] === 'x');
            cell.classList.toggle('o', boardState[index] === 'o');
        });
    };

    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c];
        });
    };

    const showModal = (message) => {
        modalMessage.textContent = message;
        modal.style.display = 'flex';
    };

    const closeModalHandler = () => {
        modal.style.display = 'none';
        initializeBoard();
    };

    const botMove = () => {
        const emptyIndices = boardState.map((val, index) => val === null ? index : null).filter(val => val !== null);
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        boardState[randomIndex] = 'o'; // Бот всегда ходит как 'o'
        updateBoard();

        if (checkWinner()) {
            showModal('o won! 🥳');
        } else if (boardState.every(cell => cell)) {
            showModal('Tie!');
        } else {
            isPlayerTurn = true; // Включаем возможность игрока после хода бота
            currentPlayer = 'x'; // Возвращаем текущего игрока к 'x'
        }
    };

    const restartGame = () => {
        initializeBoard();
        if (isBotMode && currentPlayer === 'o') {
            setTimeout(botMove, 500);
        }
    };

    const switchMode = (mode) => {
        isBotMode = mode === 'bot';
        twoPlayersButton.classList.toggle('active', !isBotMode);
        withBotButton.classList.toggle('active', isBotMode);
        restartGame();
    };

    restartButton.addEventListener('click', restartGame);
    closeModal.addEventListener('click', closeModalHandler);

    twoPlayersButton.addEventListener('click', () => {
        switchMode('2players');
    });

    withBotButton.addEventListener('click', () => {
        switchMode('bot');
    });

    // Инициализируем доску при загрузке страницы
    initializeBoard();
});
