"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                const translationModule = await import(`../translations/${language}.json`);
                setTranslations(translationModule.default);
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        };

        loadTranslations();
    }, [language]);

    const t = (key) => {
        return translations[key] || key;
    };

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    return (
        <TranslationContext.Provider value={{ t, language, changeLanguage }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    return useContext(TranslationContext);
} 