
var _app_userLang = (navigator.language || navigator.userLanguage).slice(0, 2);
if (_app_userLang !== 'nl' && _app_userLang !== 'en') _app_userLang = 'en';

var _app_localization = {
    more: {
        nl: 'Meer',
        en: 'More',
    },
    cinema: {
        nl: 'Bioscoop',
        en: 'Cinema',
    },
    cinemas: {
        nl: 'Bioscopen',
        en: 'Cinema\'s',
    },
    noConnection: {
        nl: 'Je bent niet verbonden met de server. Je kunt nog steeds een offline kaart gebruiken maar deze heeft minder detail.',
        en: 'You are not connected to the server. You can still use an offline chart but it is less detailed.'
    }
}