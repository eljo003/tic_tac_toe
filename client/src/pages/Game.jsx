import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import Square from './Squire';

import axios from "axios";

const INITIAL_GAME = ["","","","","","","","",""]

// const INITIAL_SCORES = {X: 0, O: 0, Draw:0}

// const WINNING_PATTERN = [
//     [0,1,2],
//     [3,4,5],
//     [6,7,8],
//     [0,3,6],
//     [1,4,7],
//     [2,5,8],
//     [0,4,8],
//     [2,4,6],
// ]

const Game = () => {
    // const [gameStatus,setGameStatus] = useState(INITIAL_GAME)
    // const [currPlayer,setCurrPlayer] = useState("X")
    // const [score,setScore] = useState(INITIAL_SCORES)
    const location = useLocation();
    const navigate = useNavigate();

    const player1 = location.state?.player1 || 'Player 1';
    const player2 = location.state?.player2 || 'Player 2';

    const INITIAL_SCORES = { [player1]: 0, [player2]: 0, Draw: 0 };
    const newInputs = {player1name:player1, player2name:player2, session:"CONTINUE"}
    const WINNING_PATTERN = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    const [gameStatus, setGameStatus] = useState(INITIAL_GAME);
    const [currPlayer, setCurrPlayer] = useState(player2);
    const [score, setScore] = useState(INITIAL_SCORES);

    useEffect(() => {
        const storedScores = localStorage.getItem("scores");
        if(storedScores){
            setScore(JSON.parse(storedScores))
        }
    },[]);

    useEffect(() => {
        checkForWinner();
    }, [gameStatus]);

    const winAlert = async () => {
        const continuePlaying = window.confirm(`Congrats Player ${currPlayer}! You are the winner! Do you want to play again?`);
        if(continuePlaying){
            const playerScore = score[currPlayer] + 1
            const newScore = {...score}
            newScore[currPlayer] = playerScore
            setScore(newScore)
            localStorage.setItem("scores", JSON.stringify(newScore));
            const result = currPlayer+' Wins'
            await axios.post("http://localhost:8080/api/games/update/",{result})
            await axios.post("http://localhost:8080/api/games/create/",{newInputs});
            resetBoard()
        }
        else{
            const result = currPlayer+' Wins'
            localStorage.removeItem("scores");
            await axios.post("http://localhost:8080/api/games/update/",{result})
            navigate('/');
        }
    }

    const drawAlert = async () => {
        const continuePlaying = window.confirm("It's a draw! Do you want to play again?");
        if (continuePlaying) {
            const numberOfDraws = score["Draw"] + 1
            const newScore = {...score}
            newScore["Draw"] = numberOfDraws
            setScore(newScore)
            localStorage.setItem("scores", JSON.stringify(newScore));
            await axios.post("http://localhost:8080/api/games/update/",{result:'draw'})
            await axios.post("http://localhost:8080/api/games/create/",{newInputs});
            resetBoard()
        }
        else{
            localStorage.removeItem("scores");
            await axios.post("http://localhost:8080/api/games/update/",{result:'draw'})
            navigate('/');
        }
    }

    const resetBoard = () => setGameStatus(INITIAL_GAME);

    const checkForWinner = () => {
        let roundWinner = false;

        for(let i = 0; i < WINNING_PATTERN.length; i++){
            const winPat = WINNING_PATTERN[i];

            let a = gameStatus[winPat[0]]
            let b = gameStatus[winPat[1]]
            let c = gameStatus[winPat[2]]

            if([a, b, c].includes("")){
                continue
            }

            if(a === b && b === c){
                roundWinner = true
                break;
            }
        }

        if(roundWinner){
            setTimeout(() => winAlert(), 500);
            return
        }

        if(!gameStatus.includes("")){
            setTimeout(() => drawAlert(), 500);
            return
        }

        changePlayer();
    }

    const changePlayer = () => {
        // setCurrPlayer(currPlayer === "X" ? "O" : "X");
        setCurrPlayer(currPlayer === player1 ? player2 : player1);
    }

    const boxClick = (event) => {
        const cellIndex = Number(event.target.getAttribute("data-cell-index"));
        const currValue = gameStatus[cellIndex]
        if(currValue){
            return;
        }

        const val = currPlayer == player1 ? "X" : "O"
        const newValue = [...gameStatus];
        newValue[cellIndex] = val;
        setGameStatus(newValue);
    }
    return(
        <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-gray-500 to-dark-500">
            <h1 className="text-center text-5xl mb-4 font-display">
                Tic Tac Toe Board
            </h1>
            <div>
                <div className="grid grid-cols-3 gap-3 mx-auto w-96">
                    {gameStatus.map((player,index) => (
                        <Square 
                            key={index} 
                            index={index} 
                            player={player}
                            onClick={boxClick}
                        >
                            {player}
                        </Square>
                    ))};
                </div>
            </div>
            <div>
                <p className="text-center text-2xl text-red-500 uppercase">{currPlayer} Turns</p>
                <p className="text-center">{player1} Score: <span>{score[player1]}</span></p>
                <p className="text-center">{player2} Score: <span>{score[player2]}</span></p>
                <p className="text-center">Number of Draws: <span>{score["Draw"]}</span></p>
            </div>
        </div>
    );
};

export default Game;