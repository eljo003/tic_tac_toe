import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Square from './Square';

const INITIAL_GAME = Array(9).fill("");

const Game = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const player1 = location.state?.player1 || 'Player 1';
    const player2 = location.state?.player2 || 'Player 2';

    const INITIAL_SCORES = { [player1]: 0, [player2]: 0, Draw: 0 };
    const newInputs = { player1name: player1, player2name: player2, session: "CONTINUE" };
    const WINNING_PATTERN = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    const [gameStatus, setGameStatus] = useState(INITIAL_GAME);
    const [currPlayer, setCurrPlayer] = useState(player2);
    const [score, setScore] = useState(INITIAL_SCORES);

    useEffect(() => {
        const storedScores = localStorage.getItem("scores");
        if (storedScores) {
            setScore(JSON.parse(storedScores));
        }
    }, []);

    useEffect(() => {
        checkForWinner();
    }, [gameStatus]);

    const winAlert = async () => {
        const result = `${currPlayer} Wins`;
        const continuePlaying = window.confirm(`Congrats Player ${currPlayer}! You are the winner! Do you want to play again?`);

        if (continuePlaying) {
            const updatedScore = { ...score, [currPlayer]: score[currPlayer] + 1 };
            setScore(updatedScore);
            localStorage.setItem("scores", JSON.stringify(updatedScore));
            await axios.post("http://localhost:8080/api/games/update/", { result });
            await axios.post("http://localhost:8080/api/games/create/", { newInputs });
            resetBoard();
        } else {
            localStorage.removeItem("scores");
            await axios.post("http://localhost:8080/api/games/update/", { result });
            navigate('/');
        }
    };

    const drawAlert = async () => {
        const result = 'draw';
        const continuePlaying = window.confirm("It's a draw! Do you want to play again?");

        if (continuePlaying) {
            const updatedScore = { ...score, Draw: score.Draw + 1 };
            setScore(updatedScore);
            localStorage.setItem("scores", JSON.stringify(updatedScore));
            await axios.post("http://localhost:8080/api/games/update/", { result });
            await axios.post("http://localhost:8080/api/games/create/", { newInputs });
            resetBoard();
        } else {
            localStorage.removeItem("scores");
            await axios.post("http://localhost:8080/api/games/update/", { result });
            navigate('/');
        }
    };

    const resetBoard = () => setGameStatus(INITIAL_GAME);

    const checkForWinner = () => {
        for (const pattern of WINNING_PATTERN) {
            const [a, b, c] = pattern.map(index => gameStatus[index]);

            if (a && a === b && b === c) {
                setTimeout(winAlert, 500);
                return;
            }
        }

        if (!gameStatus.includes("")) {
            setTimeout(drawAlert, 500);
            return;
        }

        changePlayer();
    };

    const changePlayer = () => {
        setCurrPlayer(currPlayer === player1 ? player2 : player1);
    };

    const boxClick = (event) => {
        const cellIndex = Number(event.target.getAttribute("data-cell-index"));
        if (gameStatus[cellIndex]) return;

        const newValue = [...gameStatus];
        newValue[cellIndex] = currPlayer === player1 ? "X" : "O";
        setGameStatus(newValue);
    };

    return (
        <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-gray-500 to-dark-500">
            <h1 className="text-center text-5xl mb-4 font-display">Tic Tac Toe Board</h1>
            <div className="grid grid-cols-3 gap-3 mx-auto w-96">
                {gameStatus.map((player, index) => (
                    <Square
                        key={index}
                        index={index}
                        player={player}
                        onClick={boxClick}
                    >
                        {player}
                    </Square>
                ))}
            </div>
            <div>
                <p className="text-center text-2xl text-red-500 uppercase">{currPlayer} Turns</p>
                <p className="text-center">{player1} Score: <span>{score[player1]}</span></p>
                <p className="text-center">{player2} Score: <span>{score[player2]}</span></p>
                <p className="text-center">Number of Draws: <span>{score.Draw}</span></p>
            </div>
        </div>
    );
};

export default Game;
