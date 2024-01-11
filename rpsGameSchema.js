const mongoose = require('mongoose');


const rpsGameSchema = new mongoose.Schema({
	lobbyName: String,
	player1: {
		name: String,
        currentChoice: String,
		currentRecord: {
			wins: Number,
			losses: Number,
			ties: Number
		}
	},
	player2: {
		name: String,
        currentChoice: String,
		currentRecord: {
			wins: Number,
			losses: Number,
			ties: Number
		}
	},
	// Optional settings (for if I have time to impliment)
	// turnTimer: Number, // in seconds, -1 for unlimited
	// ai: Boolean,
	// lobbyPassword: String, //blank if no password
	// privateLobby: Boolean,
	// // Optional to keep stats for entire server
	// players: [
	// 	{
	// 		name: String,
	// 		record: {
	// 			wins: Number,
	// 			losses: Number,
	// 			ties: Number
	// 		}
	// 	}
	// ]
})

module.exports = mongoose.model('rpsGame', rpsGameSchema);