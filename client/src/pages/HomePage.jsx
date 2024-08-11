import React, { useState, useEffect } from 'react';
import InputPlayerNames from './InputPlayerNames';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const itemsPerPage = 5;

const HomePage = () => {
    const [isInputPlayerNames, setIsInputPlayerNames] = useState(false);
    const [gameHistory, setGameHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGameHistory = async () => {
            try {
                const { data } = await axios.post("http://localhost:8080/api/games/get/", []);
                setGameHistory(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchGameHistory();
    }, []);

    const handleStartGame = async (name1, name2) => {
        const newInputs = {
            player1name: name1,
            player2name: name2,
            session: 'NEW'
        };

        setIsInputPlayerNames(false);
        await axios.post("http://localhost:8080/api/games/create/", { newInputs });
        navigate('/game', { state: { player1: name1, player2: name2 } });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = gameHistory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(gameHistory.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="h-full p-8 text-slate-800 bg-gradient-to-r from-gray-500 to-dark-500">
            <h1 className="text-center text-5xl mb-4 font-display">Tic Tac Toe Game</h1>

            <div className="flex justify-center mb-8">
                <button 
                    className="bg-blue-500 text-white py-2 px-4 rounded" 
                    onClick={() => setIsInputPlayerNames(true)}
                >
                    Start New Game
                </button>
            </div>

            <div className="flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold mb-4">Game History</h1>

                {gameHistory.length === 0 ? (
                    <p className="text-center text-lg text-gray-600">No game history available.</p>
                ) : (
                    <>
                        <table className="min-w-max bg-white border border-white-300 shadow-md rounded-lg">
                            <thead className="text-black-600 text-center">
                                <tr>
                                    <th className="py-2 px-4 border-b">Date</th>
                                    <th className="py-2 px-4 border-b">Game</th>
                                    <th className="py-2 px-4 border-b">Round</th>
                                    <th className="py-2 px-4 border-b">Player 1</th>
                                    <th className="py-2 px-4 border-b">Player 2</th>
                                    <th className="py-2 px-4 border-b">Result</th>
                                </tr>
                            </thead>
                            <tbody className="text-black-600 text-center">
                                {currentItems.map((game, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{game.date}</td>
                                        <td className="py-2 px-4 border-b">{game.gameid}</td>
                                        <td className="py-2 px-4 border-b">{game.gameseqid}</td>
                                        <td className="py-2 px-4 border-b">{game.player1name}</td>
                                        <td className="py-2 px-4 border-b">{game.player2name}</td>
                                        <td className="py-2 px-4 border-b">{game.result}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {totalPages > 1 && (
                            <div className="mt-4">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <InputPlayerNames
                isOpen={isInputPlayerNames}
                onClose={() => setIsInputPlayerNames(false)}
                onStart={handleStartGame}
            />
        </div>
    );
};

export default HomePage;
