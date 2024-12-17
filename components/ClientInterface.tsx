'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTrading, Order } from '@/lib/websocket'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const formSchema = z.object({
  asset: z.string().min(1, { message: "Asset is required" }),
  quantity: z.number().positive({ message: "Quantity must be positive" }),
  price: z.number().positive({ message: "Price must be positive" }),
  expirationType: z.enum(["duration", "datetime"]),
  expirationValue: z.string().min(1, { message: "Expiration is required" }),
})

export default function ClientInterface() {
  const { orders, addOrder, lastPrice } = useTrading()
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      asset: "BTC-USDT",
      quantity: 0,
      price: 0,
      expirationType: "duration",
      expirationValue: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const expiration = values.expirationType === 'duration'
      ? new Date(Date.now() + parseInt(values.expirationValue) * 1000)
      : new Date(values.expirationValue)

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      type: orderType,
      asset: values.asset,
      quantity: values.quantity,
      price: values.price,
      expiration,
      status: 'active',
    }

    addOrder(newOrder)
    form.reset()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Place New Order</CardTitle>
          <CardDescription>
            Current BTC-USDT price: {lastPrice ? `$${lastPrice.toFixed(2)}` : 'Loading...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant={orderType === 'buy' ? 'default' : 'outline'}
                  onClick={() => setOrderType('buy')}
                >
                  Buy
                </Button>
                <Button
                  type="button"
                  variant={orderType === 'sell' ? 'default' : 'outline'}
                  onClick={() => setOrderType('sell')}
                >
                  Sell
                </Button>
              </div>

              <FormField
                control={form.control}
                name="asset"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an asset" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BTC-USDT">BTC-USDT</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.00000001" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select expiration type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="duration">Duration</SelectItem>
                        <SelectItem value="datetime">Date and Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration</FormLabel>
                    <FormControl>
                      {form.watch('expirationType') === 'duration' ? (
                        <Input type="number" placeholder="Duration in seconds" {...field} />
                      ) : (
                        <Input type="datetime-local" {...field} />
                      )}
                    </FormControl>
                    <FormDescription>
                      {form.watch('expirationType') === 'duration'
                        ? 'Enter duration in seconds'
                        : 'Select expiration date and time'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Place Order</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your active orders.</TableCaption>
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
              {orders.filter(order => order.status === 'active').map((order) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your order history.</TableCaption>
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

