import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import common from './locales/zh-CN/common.json';
import admin from './locales/zh-CN/admin.json';

const resources = {
  'zh-CN': {
    common,
    admin,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    defaultNS: 'admin',
    ns: ['common', 'admin'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
