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

module.exports = getMessageToSend;