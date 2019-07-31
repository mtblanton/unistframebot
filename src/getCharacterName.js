const getCharacterName = character => {
    const lowerCaseCharacterName = character.toLowerCase();
    switch(lowerCaseCharacterName) {
        case 'aka':
        case 'ak':
            return 'akatsuki';

        case 'by':
            return 'byakuya';

        case 'cr':
            return 'carmine';

        case 'ch':
            return 'chaos';

        case 'el':
        case 'elt': 
            return 'eltnum';

        case 'en':
            return 'enkidu';

        case 'gd':
        case 'gord':
            return 'gordeau';

        case 'hl':
            return 'hilda';

        case 'ln':
            return 'linne';

        case 'mr':
        case 'merk':
            return 'merkava';

        case 'mi': 
            return 'mika';

        case 'na':
            return 'nanase';

        case 'or':
            return 'orie';

        case 'ph':
            return 'phonon';

        case 'se':
            return 'seth';

        case 'va':
        case 'vat':
            return 'vatista';

        case 'wg':
            return 'wagner';

        case 'wd':
        case 'wald':
            return 'waldstein';

        case 'yuzu':
        case 'yz':
            return 'yuzuriha';

        default:
            return lowerCaseCharacterName;
    }
}

module.exports = getCharacterName;