import resources from '../resources'
import getValuesMap from './getValuesMap';
import getMessageToSend from './getMessageToSend';
import getCharacterName from './getCharacterName';

// !uf <character> <move>
/**
 * @param {import('discord.js').Message} msg
 */
const handleMessage = msg => {
    if (msg.content.toLowerCase().startsWith('!uf')) {
        try {
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
        const messageToSend = getMessageToSend(character, move, Array.from(valuesMap), moveData['Invincibility'], moveData['Attribute']);

        console.log(`Sending:\n${messageToSend}`);
        msg.channel.send(messageToSend);
        } catch(e) {
            console.error(`Something went wrong!\nMessage:\n${msg.content}\n\nError:\n${e}`)
            msg.channel.send('Something went wrong!');
        }
    }
}

export default handleMessage;