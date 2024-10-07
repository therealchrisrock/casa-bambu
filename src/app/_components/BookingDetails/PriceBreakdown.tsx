import React, { Fragment } from 'react'
import { Copy, CreditCard, MoreVertical, Truck } from 'lucide-react'

import { formattedPrice } from '@/_components/Price'
import { Button } from '@/_components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card'

import { Separator } from '@/_components/ui/separator'
import { BookingDetails } from '@/_utilities/bookingCalculations'

export function PriceBreakdown({ booking }: { booking: BookingDetails }) {
  return (
    <div className={'divide-y space-y-5'}>
      <div className={'space-y-3 text-sm'}>
        <div className={'text-foreground/50 justify-between flex'}>
          <span className={''}>
            {formattedPrice(booking.averageRate)} x {booking.duration}
          </span>
          <span>{formattedPrice(booking.basePrice)}</span>
        </div>
        {booking.coupons.map(c => (
          <div
            key={c.couponID + '—' + c.label}
            className={'text-primary font-semibold justify-between flex'}
          >
            <span className={''}>{c.label}</span>
            <span>- {formattedPrice(c.total)}</span>
          </div>
        ))}

        {booking.additionalFees.map(
          fee =>
            fee.total != 0 && (
              <div
                key={fee.priceID + '—' + fee.label}
                className={'text-foreground/50 justify-between flex'}
              >
                <span className={''}>{fee.label}</span>
                <span>{formattedPrice(fee.total)}</span>
              </div>
            ),
        )}
        <div className={'text-foreground/50 justify-between flex'}>
          <span className={''}>Tax</span>
          <span>Tax Included</span>
        </div>
      </div>
      <div className={'font-semibold justify-between flex pt-5'}>
        <span className={''}>Total</span>
        <span>{formattedPrice(booking.total)}</span>
      </div>
    </div>
  )
}

export default function CartLines({ cart }: { cart: any }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="group flex items-center gap-2 text-lg">
            {cart.listing}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Order ID</span>
            </Button>
          </CardTitle>
          {cart.from && cart.to && (
            <CardDescription>
              {new Date(cart.from).toDateString()} - {new Date(cart.to).toDateString()}
            </CardDescription>
          )}
        </div>
        {/*<div className="ml-auto flex items-center gap-1">*/}
        {/*  <Button size="sm" variant="outline" className="h-8 gap-1">*/}
        {/*    <Truck className="h-3.5 w-3.5" />*/}
        {/*    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">Track Order</span>*/}
        {/*  </Button>*/}
        {/*  <DropdownMenu>*/}
        {/*    <DropdownMenuTrigger asChild>*/}
        {/*      <Button size="icon" variant="outline" className="h-8 w-8">*/}
        {/*        <MoreVertical className="h-3.5 w-3.5" />*/}
        {/*        <span className="sr-only">More</span>*/}
        {/*      </Button>*/}
        {/*    </DropdownMenuTrigger>*/}
        {/*    <DropdownMenuContent align="end">*/}
        {/*      <DropdownMenuItem>Edit</DropdownMenuItem>*/}
        {/*      <DropdownMenuItem>Export</DropdownMenuItem>*/}
        {/*      <DropdownMenuSeparator />*/}
        {/*      <DropdownMenuItem>Trash</DropdownMenuItem>*/}
        {/*    </DropdownMenuContent>*/}
        {/*  </DropdownMenu>*/}
        {/*</div>*/}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Reservation Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {cart.listing} x {cart.duration} nights
              </span>
              <span>{formattedPrice(cart.basePrice)}</span>
            </li>
            <li className="flex items-center justify-between">
              {(cart.fees ?? []).map(f => (
                <Fragment key={f.priceID}>
                  <span className="text-muted-foreground">
                    <span>{f.label}</span>
                  </span>
                  <span>{formattedPrice(f.total)}</span>
                </Fragment>
              ))}
            </li>
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formattedPrice(cart.subtotal)}</span>
            </li>
            {(cart.coupons ?? []).map(f => (
              <Fragment key={f.couponID}>
                <span className="text-primary">
                  <span>{f.label}</span>
                </span>
                <span className="text-primary">{formattedPrice(f.amount)}</span>
              </Fragment>
            ))}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>Tax Included</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>{formattedPrice(cart.total)}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
