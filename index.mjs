import discord from 'discord.js';
import resources from './resources';
import { readFileSync } from 'fs';

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

const addToTable = (entry) => (acc, current) => {
    return current.value.length > 0 
        ? acc += current[entry] + ` | ` 
        : acc;
}

/**
 * @param {string} character
 * @param {string} move
 * @param {[string, string][]} values
 */
const getMessageToSend = (character, move, values, invincibility) => {
    const INITIAL_ROW_VALUE = '| ';

    const entriesWithSpaces = values.map(getEntriesWithSpaces);
    const firstRowEntries = entriesWithSpaces.slice(0, 3);
    const secondRowEntries = entriesWithSpaces.slice(3, 6);

    const firstRowHeaders = firstRowEntries.reduce(addToTable('title'), INITIAL_ROW_VALUE).trim();
    const firstRowValues = firstRowEntries.reduce(addToTable('value'), INITIAL_ROW_VALUE).trim();

    const secondRowHeaders = secondRowEntries.reduce(addToTable('title'), INITIAL_ROW_VALUE).trim();
    const secondRowValues = secondRowEntries.reduce(addToTable('value'), INITIAL_ROW_VALUE).trim();

    const capitalizedCharacter = character.charAt(0).toUpperCase() + character.slice(1);

    const invincibilityMessage = invincibility ? `\nInvincibility:\n${invincibility}` : '';
    let message = `${capitalizedCharacter} ${move}
\`\`\`
${firstRowHeaders}
${firstRowValues}

${secondRowHeaders}
${secondRowValues}

${invincibilityMessage}
\`\`\``

    return message;
}

const getValuesMap = moveData => {
    console.log(moveData);
    const valuesMap = new Map();

    valuesMap.set('Startup', moveData['Active On']);
    valuesMap.set('Active', moveData['Active For']);
    valuesMap.set('Recovery', moveData['Recovery']);
    valuesMap.set('Advantage', moveData['Frame Advantage']);
    valuesMap.set('Damage', moveData['Damage']);
    valuesMap.set('Hit Type', moveData['Hit Type'])

    return valuesMap;
}

// !uf <character> <move>

/**
 * @param {import('discord.js').Message} msg
 */
const handleMessage = msg => {
    if (msg.content.toLowerCase().startsWith('!uf')) {
        try {

        const splitContent = msg.content.trim().split(' ');
        const character = splitContent[1].toLowerCase();
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
            msg.channel.send(`Couldn't find ${character}'s move ${move}`);
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

const client = new discord.Client();

client.on('ready', () => {
    console.log('Ready!');
});

client.on('message', handleMessage);

client.login(readFileSync('./token').toString())