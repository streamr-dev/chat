import { useState, useEffect } from 'react'

function getStorageValue(key: string, defaultValue: string) {
    try {
        const item = localStorage.getItem(key)
        if (!item) {
            return defaultValue
        }
        return JSON.parse(item)
    } catch (e) {
        return defaultValue
    }
}

export const useLocalStorage = (key: string, defaultValue = '') => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue)
    })

    useEffect(() => {
        // storing input name
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value])

    return [value, setValue]
}
