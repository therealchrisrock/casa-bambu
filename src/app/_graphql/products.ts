import { ARCHIVE_BLOCK, CALL_TO_ACTION, CONTENT, MEDIA_BLOCK } from './blocks'
import { CATEGORIES } from './categories'
import { META } from './meta'
import { MEDIA } from '@/_graphql/media'

export const PRODUCTS = `
  query Products {
    Products(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PRODUCT = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        id
        slug
        title
        productDescription
        maxGuestQuantity
        baseGuestQuantity
        stripeGuestFeeID
        guestFeePriceJSON
        bathQuantity
        bedroomQuantity
        gallery {
          id
          ${MEDIA}
        }
        stripeProductID
        ${CATEGORIES}
        layout {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
        priceJSON
        coupons {
          nickname
          nights
          stripeCoupon
          stripeCouponJSON
        }
        variants {
          priceID
          seasonStart
          seasonEnd
        }
        features {
          title
          id
          ${MEDIA}
        }
        enablePaywall
        relatedProducts {
          id
          slug
          title
          ${META}
        }
     
        ${META}
      }
    }
  }
`

export const PRODUCT_PAYWALL = `
  query Product($slug: String, $draft: Boolean) {
    Products(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
      docs {
        paywall {
          ${CALL_TO_ACTION}
          ${CONTENT}
          ${MEDIA_BLOCK}
          ${ARCHIVE_BLOCK}
        }
      }
    }
  }
`
