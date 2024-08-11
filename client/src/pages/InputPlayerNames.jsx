import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  position: relative;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const ModalInput = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
`;

const ModalButton = styled.button`
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;

const InputPlayerNames = ({ isOpen, onClose, onStart }) => {
    if (!isOpen) return null;

    const handleSubmit = (event) => {
        event.preventDefault();
        const player1 = event.target.player1.value;
        const player2 = event.target.player2.value;
        onStart(player1, player2);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <ModalClose onClick={onClose}>&times;</ModalClose>
                <h2>Enter Player Names</h2>
                <form onSubmit={handleSubmit}>
                <ModalInput>
                    <label>
                    Player 1:
                    <input type="text" name="player1" placeholder="Enter Player 1 Name" required />
                    </label>
                </ModalInput>
                <ModalInput>
                    <label>
                    Player 2:
                    <input type="text" name="player2" placeholder="Enter Player 2 Name" required />
                    </label>
                </ModalInput>
                <ModalButton type="submit">Start Game</ModalButton>
                </form>
            </ModalContent>
        </ModalOverlay>
    );
}

export default InputPlayerNames;