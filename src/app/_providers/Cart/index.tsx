'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'

import { Product, User } from '../../../payload/payload-types'
import { useAuth } from '../Auth'
import { CartItem, cartReducer, CouponItem } from './reducer'

import { formattedPrice } from '@/_components/Price'
import { BookingDetails } from '@/_utilities/bookingCalculations'

export type CartContext = {
  cart: User['cart']
  addItemToCart: (item: CartItem) => void
  addCouponToCart: (payload: CouponItem) => void
  deleteItemFromCart: (product: Product) => void
  addBookingDetails: (payload: BookingDetails) => void
  cartIsEmpty: boolean | undefined
  clearCart: () => void
  isProductInCart: (product: Product) => boolean
  cartTotal: {
    formatted: string
    raw: number
  }
  hasInitializedCart: boolean
}

const Context = createContext({} as CartContext)

export const useCart = () => useContext(Context)

const arrayHasItems = array => Array.isArray(array) && array.length > 0

/**
 * ensure that cart items are fully populated, filter out any items that are not
 * this will prevent discontinued products from appearing in the cart
 */
const flattenCart = (cart: User['cart']): User['cart'] => {
  return {
    ...cart,
    items: cart.items
      .map(item => {
        if (!item?.product) {
          return null
        }
        return {
          ...item,
          // flatten relationship to product
          product: typeof item?.product === 'object' ? item.product.id : item.product,
          quantity: typeof item?.quantity === 'number' ? item?.quantity : 0,
        }
      })
      .filter(Boolean) as CartItem[],
  }
}

// Step 1: Check local storage for a cart
// Step 2: If there is a cart, fetch the products and hydrate the cart
// Step 3: Authenticate the user
// Step 4: If the user is authenticated, merge the user's cart with the local cart
// Step 4B: Sync the cart to Payload and clear local storage
// Step 5: If the user is logged out, sync the cart to local storage only

export const CartProvider = props => {
  // const { setTimedNotification } = useNotifications();
  const { children } = props
  const { user, status: authStatus } = useAuth()

  const [cart, dispatchCart] = useReducer(cartReducer, {})

  const [total, setTotal] = useState<{
    formatted: string
    raw: number
  }>({
    formatted: '0.00',
    raw: 0,
  })

  const hasInitialized = useRef(false)
  const [hasInitializedCart, setHasInitialized] = useState(false)

  // Check local storage for a cart
  // If there is a cart, fetch the products and hydrate the cart
  useEffect(() => {
    // wait for the user to be defined before initializing the cart
    if (user === undefined) return
    if (!hasInitialized.current) {
      hasInitialized.current = true

      const syncCartFromLocalStorage = async () => {
        const localCart = localStorage.getItem('cart')

        const parsedCart = JSON.parse(localCart || '{}')

        if (parsedCart?.items && parsedCart?.items?.length > 0) {
          // const initialCart = await Promise.all(
          //   parsedCart.items.map(async ({ product, ...args }) => {
          //     const res = await fetch(
          //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${product.id}`,
          //     )
          //     const data = await res.json()
          //     return {
          //       product: data,
          //       ...args,
          //     }
          //   }),
          // )

          dispatchCart({
            type: 'SET_CART',
            payload: {
              ...parsedCart,
            },
          })
        } else {
          dispatchCart({
            type: 'SET_CART',
            payload: {
              items: [],
            },
          })
        }
      }

      syncCartFromLocalStorage()
    }
  }, [user])

  // authenticate the user and if logged in, merge the user's cart with local state
  // only do this after we have initialized the cart to ensure we don't lose any items
  useEffect(() => {
    if (!hasInitialized.current) return

    if (authStatus === 'loggedIn') {
      // merge the user's cart with the local state upon logging in
      dispatchCart({
        type: 'MERGE_CART',
        payload: user?.cart,
      })
    }

    if (authStatus === 'loggedOut') {
      // clear the cart from local state after logging out
      dispatchCart({
        type: 'CLEAR_CART',
      })
    }
  }, [user, authStatus])

  // every time the cart changes, determine whether to save to local storage or Payload based on authentication status
  // upon logging in, merge and sync the existing local cart to Payload
  useEffect(() => {
    // wait until we have attempted authentication (the user is either an object or `null`)
    if (!hasInitialized.current || user === undefined || !cart.items) return
    const flattenedCart = flattenCart(cart)
    if (user) {
      // prevent updating the cart when the cart hasn't changed
      if (JSON.stringify(flattenCart(user.cart)) === JSON.stringify(flattenedCart)) {
        setHasInitialized(true)
        return
      }

      try {
        const syncCartToPayload = async () => {
          const req = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${user.id}`, {
            // Make sure to include cookies with fetch
            credentials: 'include',
            method: 'PATCH',
            body: JSON.stringify({
              cart: flattenedCart,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          if (req.ok) {
            localStorage.setItem('cart', '[]')
          }
        }

        syncCartToPayload()
      } catch (e) {
        console.error('Error while syncing cart to Payload.') // eslint-disable-line no-console
      }
    } else {
      localStorage.setItem('cart', JSON.stringify(flattenedCart))
    }

    setHasInitialized(true)
  }, [user, cart])

  const isProductInCart = useCallback(
    (incomingProduct: Product): boolean => {
      let isInCart = false
      const { items: itemsInCart } = cart || {}
      if (Array.isArray(itemsInCart) && itemsInCart.length > 0) {
        isInCart = Boolean(
          itemsInCart.find(({ product }) =>
            typeof product === 'string'
              ? product === incomingProduct.id
              : product?.id === incomingProduct.id,
          ), // eslint-disable-line function-paren-newline
        )
      }
      return isInCart
    },
    [cart],
  )

  const addCouponToCart = useCallback(incomingItem => {
  }, [])
  const addBookingDetails = useCallback(details => {
    dispatchCart({
      type: 'ADD_BOOKING',
      payload: details,
    })
  }, [])
  // this method can be used to add new items AND update existing ones
  const addItemToCart = useCallback(incomingItem => {
    dispatchCart({
      type: 'ADD_ITEM',
      payload: incomingItem,
    })
  }, [])

  const deleteItemFromCart = useCallback((incomingProduct: Product) => {
    dispatchCart({
      type: 'DELETE_ITEM',
      payload: incomingProduct,
    })
  }, [])

  const clearCart = useCallback(() => {
    dispatchCart({
      type: 'CLEAR_CART',
    })
  }, [])

  // calculate the new cart total whenever the cart changes
  useEffect(() => {
    if (!hasInitialized) return

    // const subtotal =
    //   cart?.items?.reduce((acc, item) => {
    //     let p = 0
    //     console.log(item)
    //     if (typeof item.product === 'object') {
    //       const variants = item.product.variants
    //       const prices = JSON.parse(item?.product?.priceJSON || '{}')?.data
    //       const vp = prices.find(price => price?.id === item.priceID)
    //       p = vp.unit_amount * item.quantity || 0
    //       console.log('prices', p)
    //     }
    //     return acc + p
    //   }, 0) || 0
    //
    // setTotal({
    //   formatted: formattedPrice(subtotal / 100),
    //   raw: subtotal,
    // })
  }, [cart, hasInitialized])

  return (
    <Context.Provider
      value={{
        cart,
        addCouponToCart,
        addItemToCart,
        deleteItemFromCart,
        addBookingDetails,
        cartIsEmpty: hasInitializedCart && !arrayHasItems(cart?.items),
        clearCart,
        isProductInCart,
        cartTotal: total,
        hasInitializedCart,
      }}
    >
      {children && children}
    </Context.Provider>
  )
}
