const resources = require('../resources')
const getValuesMap = require('./getValuesMap');
const getMessageToSend = require('./getMessageToSend');
const getCharacterName = require('./getCharacterName');

// !uf <character> <move>
/**
 * @param {import('discord.js').Message} msg
 */
const handleMessage = msg => {
    if (msg.content.toLowerCase().startsWith('!uf')) {
        try {
            console.log(`${new Date().toISOString()}}:\n${msg.author};\n${msg.content}`)
            const splitContent = msg.content.trim().split(' ');
            const character = getCharacterName(splitContent[1]);
            let move = splitContent[2];

            //We can't toUpperCase jump moves because they start with a lower-case j :(
            if(move.startsWith('j.')) {
                const splitMove = move.split('j.');
                move = 'j.' + splitMove[1].toUpperCase();
            } else {
                move = move.toUpperCase();
            }

            const characterData = resources[character];
            if (!characterData) {
                msg.channel.send(`Couldn't find character ${character}!`)
                return;
            }

            const moveData = characterData[move];
            if(!moveData) {
                msg.channel.send(`Couldn't find ${character}'s move ${move}!`);
                return;
            }

            const valuesMap = getValuesMap(moveData);
            const messageToSend = getMessageToSend(character, move, Array.from(valuesMap), moveData['Invincibility']);

            msg.channel.send(messageToSend);
        } catch(e) {
            console.error(`Something went wrong!\nMessage:\n${msg.content}\n\nError:\n${e}`)
            msg.channel.send('Something went wrong!');
        }
    }
}

module.exports = handleMessage;