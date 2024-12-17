import { create } from 'zustand'
import { useEffect } from 'react'
import useWebSocket from 'react-use-websocket'

export interface Order {
  id: string
  type: 'buy' | 'sell'
  asset: string
  quantity: number
  price: number
  expiration: Date
  status: 'active' | 'filled' | 'cancelled' | 'expired'
}

interface TradingState {
  orders: Order[]
  lastPrice?: number
  addOrder: (order: Order) => void
  updateOrder: (id: string, updates: Partial<Order>) => void
  removeOrder: (id: string) => void
}

export const useTradingStore = create<TradingState>((set) => ({
  orders: [],
  lastPrice: undefined,
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === id ? { ...order, ...updates } : order
      ),
    })),
  removeOrder: (id) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== id),
    })),
}))

export function useTrading() {
  const store = useTradingStore()

  const { lastJsonMessage } = useWebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade', {
    onError: (event) => console.error('WebSocket error:', event),
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  })

  useEffect(() => {
    if (lastJsonMessage) {
      const { p: price } = lastJsonMessage
      useTradingStore.setState({ lastPrice: parseFloat(price) })
    }
  }, [lastJsonMessage])

  useEffect(() => {
    const interval = setInterval(() => {
      const randomOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        asset: 'BTC-USDT',
        quantity: parseFloat((Math.random() * 2).toFixed(8)),
        price: parseFloat((Math.random() * 2000 + 29000).toFixed(2)),
        expiration: new Date(Date.now() + Math.random() * 86400000),
        status: 'active',
      }
      store.addOrder(randomOrder)

      store.orders.forEach((order) => {
        if (Math.random() > 0.8) {
          const newStatus = Math.random() > 0.5 ? 'filled' : 'cancelled'
          store.updateOrder(order.id, { status: newStatus })
        }
      })

      const now = new Date()
      store.orders.forEach((order) => {
        if (order.expiration < now) {
          store.removeOrder(order.id)
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return store
}

