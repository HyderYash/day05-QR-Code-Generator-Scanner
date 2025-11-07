import { useState, useEffect, useCallback } from 'react'
import { QRHistoryItem, QRSettings } from './types'

const DEFAULT_SETTINGS: QRSettings = {
  maxHistoryItems: 50,
  enableGeolocation: false,
  defaultSize: 256,
  defaultErrorCorrection: 'M',
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return [storedValue, setValue] as const
}

export function useQRHistory() {
  const [history, setHistory] = useLocalStorage<QRHistoryItem[]>('qr-history', [])
  const [settings, setSettings] = useLocalStorage<QRSettings>('qr-settings', DEFAULT_SETTINGS)

  const addHistoryItem = useCallback(
    (item: Omit<QRHistoryItem, 'id' | 'timestamp'>) => {
      const newItem: QRHistoryItem = {
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
      }

      setHistory((prev) => {
        const updated = [newItem, ...prev]
        return updated.slice(0, settings.maxHistoryItems)
      })
    },
    [setHistory, settings.maxHistoryItems]
  )

  const removeHistoryItem = useCallback(
    (id: string) => {
      setHistory((prev) => prev.filter((item) => item.id !== id))
    },
    [setHistory]
  )

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [setHistory])

  const updateSettings = useCallback(
    (newSettings: Partial<QRSettings>) => {
      setSettings((prev) => ({ ...prev, ...newSettings }))
    },
    [setSettings]
  )

  return {
    history,
    settings,
    addHistoryItem,
    removeHistoryItem,
    clearHistory,
    updateSettings,
  }
}

