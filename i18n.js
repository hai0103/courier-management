import i18n from 'i18next';
import english from 'public/static/locales/en/common.json';
import vietnamese from 'public/static/locales/vi/common.json';

i18n.init({
    interpolation: {escapeValue: false},
    lng: 'vi',
    resources: {
        en: {
            common: english
        },
        vi: {
            common: vietnamese
        },
    },
}).catch(e => {
    console.log(e);
});

export default i18n;