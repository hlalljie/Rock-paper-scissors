import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');  // Connect to backend server
let playerConnected = false;
let lobbyName = "TestGame7";

const Game = () => {
    const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));  // Generate a random username
    const [playerChoice, setChoice] = useState('');
    const [resultStatus, setResult] = useState('Fight!');
    
    useEffect(() => {
        if (playerConnected === false) {
            socket.emit('playerConnect', { username, lobbyName });  // Use the random username
            playerConnected = true;
        }
        socket.on('result', (data) => {
            console.log(data);
            if (data.winner == username){
                setResult('Winner winner chicken dinner!');
            }
            else if (data.winner == 'Tie'){
                setResult('Tie game');
            }
            else{
                setResult("You lost this time, but you'll get em next time!");
            }
        });
    }, [username]);
    const submitChoice = (choice) => {
        socket.emit('rps', { username: username, choice: choice, lobbyName: lobbyName});  // Use the random username
        setChoice(choice);
    };

    return (
        <>
            <h1>{resultStatus}</h1>
            <h3>{username}</h3>
            <button onClick={() => submitChoice('rock')}>Rock</button>
            <button onClick={() => submitChoice('paper')}>Paper</button>
            <button onClick={() => submitChoice('scissors')}>Scissors</button>
        </>
    )
}

export default Game;