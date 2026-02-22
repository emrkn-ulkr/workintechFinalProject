import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { defaultLanguage, translations } from '../i18n/translations';

const getNestedValue = (object, path) =>
  path.split('.').reduce((value, key) => {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value[key];
  }, object);

const interpolate = (template, values) =>
  Object.entries(values).reduce(
    (result, [key, value]) => result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), String(value)),
    template,
  );

export const useTranslation = () => {
  const language = useSelector((state) => state.client.language) || defaultLanguage;

  const dictionary = useMemo(
    () => translations[language] || translations[defaultLanguage] || {},
    [language],
  );

  const fallbackDictionary = translations.en;

  const t = useCallback(
    (key, values = {}) => {
      const rawValue =
        getNestedValue(dictionary, key) ??
        getNestedValue(fallbackDictionary, key) ??
        getNestedValue(translations[defaultLanguage], key) ??
        key;

      if (typeof rawValue === 'string') {
        return interpolate(rawValue, values);
      }

      return rawValue;
    },
    [dictionary, fallbackDictionary],
  );

  return { t, language };
};
