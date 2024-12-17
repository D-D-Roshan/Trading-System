'use client'

import { useTrading, Order } from '@/lib/websocket'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function SettlementInterface() {
  const { orders, updateOrder } = useTrading()

  const handleAccept = (order: Order) => {
    updateOrder(order.id, { status: 'filled' })
  }

  const handleReject = (order: Order) => {
    updateOrder(order.id, { status: 'cancelled' })
  }

  const activeOrders = orders.filter(order => order.status === 'active')
  const matchedOrders = activeOrders.filter(order => {
    const matchingOrders = activeOrders.filter(o => 
      o.type !== order.type && 
      o.asset === order.asset && 
      ((order.type === 'buy' && o.price <= order.price) || 
       (order.type === 'sell' && o.price >= order.price))
    )
    return matchingOrders.length > 0
  })

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Match Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of potential trade matches.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchedOrders.map((order) => (
                <TableRow key={order.id} className="bg-green-100">
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.asset}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>{order.expiration.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleAccept(order)} className="mr-2">Accept</Button>
                    <Button onClick={() => handleReject(order)} variant="destructive">Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all active orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.asset}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>{order.expiration.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleAccept(order)} className="mr-2">Accept</Button>
                    <Button onClick={() => handleReject(order)} variant="destructive">Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of all settled orders.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.filter(order => order.status !== 'active').map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.asset}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.price.toFixed(2)}</TableCell>
                  <TableCell>{order.expiration.toLocaleString()}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

