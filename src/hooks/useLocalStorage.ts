import { useState, useEffect, useRef } from 'react'

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
    const isUpdateRef = useRef<boolean>(false)
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue)
    })

    useEffect(() => {
        if (!isUpdateRef.current) {
            isUpdateRef.current = true
            // It's a on-mount run. Ignore the rest.
            return
        }
        // storing input name
        localStorage.setItem(key, JSON.stringify(value))
    }, [key, value, isUpdateRef])

    return [value, setValue]
}
