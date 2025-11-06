// This file defines a custom React hook. Custom hooks are a powerful way to reuse stateful logic
// between different components. This hook, `useLocalStorage`, behaves like `useState` but
// also persists the state to the browser's local storage.

import { useState, useEffect } from 'react';

// A generic function. `<T>` is a placeholder for a type that will be specified when the hook is used.
// It returns a tuple `[value, setValue]`, just like React's `useState`.
export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    
    // We initialize our state by trying to retrieve it from local storage first.
    const [storedValue, setStoredValue] = useState<T>(() => {
        // This function is only run once on the initial render.
        if (typeof window === 'undefined') {
            // If we're on a server (server-side rendering), `window` doesn't exist. Return the initial value.
            return initialValue;
        }
        try {
            // Try to get the item from local storage using the provided key.
            const item = window.localStorage.getItem(key);
            // If the item exists, parse it from its JSON string format. Otherwise, use the initial value.
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If there's an error (e.g., corrupted data), log it and return the initial value.
            console.error(error);
            return initialValue;
        }
    });

    // `useEffect` is a hook that runs side effects in function components.
    // In this case, the side effect is writing to local storage.
    useEffect(() => {
        // This function will run every time the `key` or `storedValue` changes.
        try {
            // Convert the state value to a JSON string to store it.
            const valueToStore = storedValue;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            // If there's an error (e.g., storage is full), log it.
            console.error(error);
        }
    }, [key, storedValue]); // The dependency array ensures this effect only runs when these values change.

    // Return the state value and the function to update it, mimicking the `useState` API.
    return [storedValue, setStoredValue];
}
