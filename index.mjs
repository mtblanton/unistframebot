import discord from 'discord.js';
import resources from './resources';
import { readFileSync } from 'fs';
import { stringify } from 'querystring';

/**
 * @param {[string, string]} titleValueArray array of titles and values
 * @returns {{title: string, value: string}} Object with title and space with matching length
 */
const getEntriesWithSpaces = ([title, value]) => {
    const titleSpaces = ' '.repeat(Math.max(0, value.length - title.length));
    const valueSpaces = ' '.repeat(Math.max(0, title.length - value.length));
    
    const titleWithSpaces = title + titleSpaces;
    const valueWithSpaces = value + valueSpaces;

    return {
        title: titleWithSpaces,
        value: valueWithSpaces
    }
};

/**
 * @param {string} character
 * @param {string} move
 * @param {[string, string][]} values
 */
const getMessageToSend = (character, move, values) => {
    const entriesWithSpaces = values.map(getEntriesWithSpaces);
    const tableHeaders = entriesWithSpaces.reduce((acc, current) => acc += current.title + ` | `, '');
    const tableValues = entriesWithSpaces.reduce((acc, current) => acc += current.value + ` | `, '');

    const capitalizedCharacter = character.charAt(0).toUpperCase() + character.slice(1);
    return `${capitalizedCharacter} ${move}
\`\`\`
| ${tableHeaders.trim()}
| ${tableValues.trim()}
\`\`\``
}

const getValuesMap = moveData => {
    console.log(moveData);
    const valuesMap = new Map();

    valuesMap.set('Startup', moveData['Active On']);
    valuesMap.set('Active', moveData['Active For']);
    valuesMap.set('Recovery', moveData['Recovery']);
    valuesMap.set('Advantage', moveData['Frame Advantage']);
    valuesMap.set('Damage', moveData['Damage']);

    return valuesMap;
}

// !uf <character> <move>

/**
 * @param {import('discord.js').Message} msg
 */
const handleMessage = msg => {
    if (msg.content.startsWith('!uf')) {
        const splitContent = msg.content.trim().split(' ');
        const character = splitContent[1].toLowerCase();
        let move = splitContent[2];

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
            msg.channel.send(`Couldn't find ${character}'s move ${move}`);
            return;
        }

        const valuesMap = getValuesMap(moveData);
        const messageToSend = getMessageToSend(character, move, Array.from(valuesMap));

        console.log(`Sending:\n${messageToSend}`);
        msg.channel.send(messageToSend);
    }
}

const client = new discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', handleMessage);

client.login(readFileSync('./token').toString())