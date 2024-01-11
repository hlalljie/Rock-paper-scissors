import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  // Connect to backend server
let playerConnected = false;
let game = "TestGame1"

const Game = () => {
    const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));  // Generate a random username
    const [playerChoice, setChoice] = useState('');
    
    useEffect(() => {
        if (playerConnected === false) {
            socket.emit('playerConnect', { username });  // Use the random username
            playerConnected = true;
        }
    }, [username]);
    const submitChoice = (choice) => {
        socket.emit('rps', { username: username, choice: choice});  // Use the random username
        setChoice(choice);
    };

    return (
        <>
            <h1>Fight!</h1>
            <h3>{username}</h3>
            <button onClick={() => submitChoice('rock')}>Rock</button>
            <button onClick={() => submitChoice('paper')}>Paper</button>
            <button onClick={() => submitChoice('scissors')}>Scissors</button>
        </>
    )
}

export default Game;