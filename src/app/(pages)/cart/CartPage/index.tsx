'use client'

import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Page, Settings } from '../../../../payload/payload-types'
import { Button } from '../../../_components/Button'
import { HR } from '../../../_components/HR'
import { LoadingShimmer } from '../../../_components/LoadingShimmer'
import { useAuth } from '../../../_providers/Auth'
import { useCart } from '../../../_providers/Cart'

import CartLines from '@/_components/BookingDetails/PriceBreakdown'
import CreateAccountForm from '@/(pages)/create-account/CreateAccountForm'
import LoginForm from '@/(pages)/login/LoginForm'

import classes from './index.module.scss'

export const CartPage: React.FC<{
  settings: Settings
  page: Page
}> = props => {
  const { settings } = props
  const { productsPage } = settings || {}

  const { user } = useAuth()
  const { cart, cartIsEmpty, addItemToCart, cartTotal, hasInitializedCart } = useCart()
  // const pid = useMemo()
  const [showSignupForm, setShowSignupForm] = useState(false)
  useEffect(() => {
    if (user?.id && !cartIsEmpty) redirect('/checkout')
  }, [user])
  return (
    <Fragment>
      <br />
      {!hasInitializedCart ? (
        <div className={classes.loading}>
          <LoadingShimmer />
        </div>
      ) : (
        <Fragment>
          {cartIsEmpty ? (
            <div className={classes.empty}>
              Your cart is empty.
              {typeof productsPage === 'object' && productsPage?.slug && (
                <Fragment>
                  {' '}
                  <Link href={`/${productsPage.slug}`}>Click here</Link>
                  {` to shop.`}
                </Fragment>
              )}
              {!user && (
                <Fragment>
                  {' '}
                  <Link href={`/login?redirect=%2Fcart`}>Log in</Link>
                  {` to view a saved cart.`}
                </Fragment>
              )}
            </div>
          ) : (
            <div className={'max-w-screen-xl'}>
              <div className={'grid grid-cols-1 lg:grid-cols-2 gap-2'}>
                {showSignupForm ? (
                  <CreateAccountForm></CreateAccountForm>
                ) : (
                  <LoginForm>
                    To complete your reservation, log in below or{' '}
                    <Link
                      href={'/create-account?redirect=%2Fcheckout'}
                      className={'underline underline-offset-4'}
                    >
                      create an account
                    </Link>{' '}
                    to get started.
                  </LoginForm>
                )}
                {cart.from && cart.to && <CartLines cart={cart} />}
              </div>
              {/*{cart?.items?.map((item, index) => {*/}
              {/*  if (typeof item.product === 'object') {*/}
              {/*    const {*/}
              {/*      quantity,*/}
              {/*      product,*/}
              {/*      product: { id, title, meta, stripeProductID },*/}
              {/*    } = item*/}
              {/*    const isLast = index === (cart?.items?.length || 0) - 1*/}

              {/*    const metaImage = meta?.image*/}

              {/*    return (*/}
              {/*      <Fragment key={index}>*/}
              {/*        <div className={classes.row}>*/}
              {/*          <Link href={`/products/${product.slug}`} className={classes.mediaWrapper}>*/}
              {/*            {!metaImage && <span className={classes.placeholder}>No image</span>}*/}
              {/*            {metaImage && typeof metaImage !== 'string' && (*/}
              {/*              <Media*/}
              {/*                className={classes.media}*/}
              {/*                imgClassName={classes.image}*/}
              {/*                resource={metaImage}*/}
              {/*                fill*/}
              {/*              />*/}
              {/*            )}*/}
              {/*          </Link>*/}
              {/*          <div className={classes.rowContent}>*/}
              {/*            {!stripeProductID && (*/}
              {/*              <p className={classes.warning}>*/}
              {/*                {*/}
              {/*                  'This product is not yet connected to Stripe. To link this product, '*/}
              {/*                }*/}
              {/*                <Link*/}
              {/*                  href={`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/products/${id}`}*/}
              {/*                >*/}
              {/*                  edit this product in the admin panel*/}
              {/*                </Link>*/}
              {/*                {'.'}*/}
              {/*              </p>*/}
              {/*            )}*/}
              {/*            <h5 className={classes.title}>*/}
              {/*              <Link href={`/products/${product.slug}`} className={classes.titleLink}>*/}
              {/*                {title}*/}
              {/*              </Link>*/}
              {/*            </h5>*/}
              {/*            <div className={classes.actions}>*/}
              {/*              <label>*/}
              {/*                Quantity &nbsp;*/}
              {/*                <input*/}
              {/*                  type="number"*/}
              {/*                  className={classes.quantity}*/}
              {/*                  // fallback to empty string to avoid uncontrolled input error*/}
              {/*                  // this allows the user to user their backspace key to clear the input*/}
              {/*                  value={typeof quantity === 'number' ? quantity : ''}*/}
              {/*                  onChange={e => {*/}
              {/*                    addItemToCart({*/}
              {/*                      priceID: item.priceID,*/}
              {/*                      from: item.from,*/}
              {/*                      to: item.to,*/}
              {/*                      guestsQuantity: item.guestsQuantity,*/}
              {/*                      product,*/}
              {/*                      quantity: Number(e.target.value),*/}
              {/*                    })*/}
              {/*                  }}*/}
              {/*                />*/}
              {/*              </label>*/}
              {/*              <RemoveFromCartButton product={product} />*/}
              {/*            </div>*/}
              {/*          </div>*/}
              {/*        </div>*/}
              {/*        {!isLast && <HR />}*/}
              {/*      </Fragment>*/}
              {/*    )*/}
              {/*  }*/}
              {/*  return null*/}
              {/*})}*/}
              {/*<ProductForm product={prod} />*/}
              <Button
                className={classes.checkoutButton}
                href={user ? '/checkout' : '/login?redirect=%2Fcheckout'}
                label={user ? 'Checkout' : 'Login to checkout'}
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  )
}
