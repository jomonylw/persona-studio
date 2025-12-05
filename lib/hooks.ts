'use client'

import { useState, useEffect, Dispatch, SetStateAction } from 'react'

type SetValue<T> = Dispatch<SetStateAction<T>>

function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(defaultValue)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setValue(JSON.parse(item) as T)
        }
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    }
  }, [key, value])

  return [value, setValue]
}

export default useLocalStorageState
