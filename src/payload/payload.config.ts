import { webpackBundler } from '@payloadcms/bundler-webpack'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloud } from '@payloadcms/plugin-cloud'
import formBuilder from '@payloadcms/plugin-form-builder'
import nestedDocs from '@payloadcms/plugin-nested-docs'
import redirects from '@payloadcms/plugin-redirects'
import seo from '@payloadcms/plugin-seo'
import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import stripePlugin from '@payloadcms/plugin-stripe'
import { slateEditor } from '@payloadcms/richtext-slate'
import dotenv from 'dotenv'
import { GraphQLFloat, GraphQLNonNull, GraphQLString } from 'graphql/type'
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import path from 'path'
import { buildConfig } from 'payload/config'
import cloudinaryPlugin from 'payload-cloudinary-plugin/dist/plugins/cloudinaryPlugin'

// import email from '../email/transport'
import { Amenities } from './collections/Amenities'
import { Bookings } from './collections/Bookings'
import Categories from './collections/Categories'
import { FAQs } from './collections/FAQs'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { Pages } from './collections/Pages'
import { Policies } from './collections/Policies'
import Products from './collections/Products'
import { Reviews } from './collections/Reviews'
import Users from './collections/Users'
import BeforeDashboard from './components/BeforeDashboard'
import BeforeLogin from './components/BeforeLogin'
import BeforeNavLinks from './components/BeforeNavLinks'
import { Calendar } from './components/Calendar'
import { Icon } from './components/Icon'
import { Logo } from './components/Logo'
import { couponsProxy } from './endpoints/coupons'
import { createInvoice } from './endpoints/create-invoice'
import { createPaymentIntent } from './endpoints/create-payment-intent'
import { customersProxy } from './endpoints/customers'
import { getAvailability } from './endpoints/get-availability'
import { invoicesProxy } from './endpoints/invoices'
import { pricesProxy } from './endpoints/prices'
import { productsProxy } from './endpoints/products'
import { seed } from './endpoints/seed'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Settings } from './globals/Settings'
import { priceUpdated } from './stripe/webhooks/priceUpdated'
import { productUpdated } from './stripe/webhooks/productUpdated'

const generateTitle: GenerateTitle = () => {
  return 'My Store'
}

const mockModulePath = path.resolve(__dirname, './emptyModuleMock.js')

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
})

export default buildConfig({
  // email,
  localization: {
    locales: ['en'], // required
    defaultLocale: 'en', // required
    fallback: true,
  },
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Casa Bambu',
      favicon: '/media/favicon.svg',
      ogImage: '/media/large-logo.png',
    },
    components: {
      graphics: {
        Logo,
        Icon,
      },
      beforeNavLinks: [BeforeNavLinks],
      views: {
        Calendar: {
          Component: Calendar,
          path: '/calendar',
        },
      },
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: [BeforeLogin],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: [BeforeDashboard],
    },
    webpack: config => {
      return {
        ...config,
        // plugins: [new NodePolyfillPlugin()],
        resolve: {
          fallback: {
            assert: require.resolve('assert/'),
            url: require.resolve('url/'),
            os: false,
            fs: false,
            // { "assert": require.resolve("assert/") }
          },
          // fallback: {
          //   tls: false,
          //   net: false,
          //   child_process: false,
          //   dns: false,
          //   // fs: false,
          //   // path: false,
          //   // zlib: false,
          //   // http: false,
          //   // https: false,
          //   // crypto: false,
          //   // stream: require.resolve('stream-browserify'),
          // },
          ...config.resolve,
          alias: {
            fs: mockModulePath,
            'inline-css': mockModulePath,
            ...config.resolve?.alias,
            dotenv: path.resolve(__dirname, './dotenv.js'),
            [path.resolve(__dirname, 'collections/Products/hooks/beforeChange')]: mockModulePath,
            [path.resolve(__dirname, 'collections/Users/hooks/createStripeCustomer')]:
              mockModulePath,
            [path.resolve(__dirname, 'collections/Users/endpoints/customer')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/create-payment-intent')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/create-invoice')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/invoices')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/customers')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/products')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/coupons')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/prices')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/get-availability')]: mockModulePath,
            [path.resolve(__dirname, 'endpoints/seed')]: mockModulePath,
            stripe: mockModulePath,
            express: mockModulePath,
          },
        },
      }
    },
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL,
  collections: [
    Pages,
    Products,
    Policies,
    Orders,
    Media,
    Categories,
    Users,
    Reviews,
    Bookings,
    Amenities,
    FAQs,
  ],
  // upload: {
  //   limits: {
  //     fileSize: 10 * 1000000, // 10MB
  //   },
  // },
  upload: {
    limits: {
      fileSize: 20000000, // 5MB, written in bytes
    },
  },

  globals: [Settings, Header, Footer],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    mutations: (GraphQL, payload) => {
      return {
        calculateAverageRating: {
          type: GraphQLFloat, // The mutation returns a float (average rating)
          args: {
            relatedListing: {
              type: new GraphQLNonNull(GraphQLString), // Argument: the ID of the related listing
            },
          },
          resolve: async (_, args) => {
            const { relatedListing } = args

            // Fetch reviews associated with the listing
            const reviews = await payload.find({
              collection: 'reviews',
              where: {
                relatedListing: {
                  equals: relatedListing, // Match reviews by related listing ID
                },
              },
            })

            // Ensure reviews exist
            if (!reviews.docs.length) {
              return 0 // No reviews found, return 0
            }

            // Calculate the average rating
            const totalRating = reviews.docs.reduce((sum, review) => sum + review.rating, 0)
            const averageRating = totalRating / reviews.docs.length

            return averageRating
          },
        },
      }
    },
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  cors: [
    'https://*.casabambuwestbay.com',
    'https://checkout.stripe.com',
    'https://bambu.tilde.technology',
    'http://localhost:3000',
    process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
  ].filter(Boolean),
  csrf: ['https://checkout.stripe.com', process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(
    Boolean,
  ),
  endpoints: [
    {
      path: '/create-payment-intent',
      method: 'post',
      handler: createPaymentIntent,
    },
    {
      path: '/create-invoice',
      method: 'post',
      handler: createInvoice,
    },
    {
      path: '/get-availability',
      method: 'get',
      handler: getAvailability,
    },
    {
      path: '/stripe/customers',
      method: 'get',
      handler: customersProxy,
    },
    {
      path: '/stripe/prices/:pid',
      method: 'get',
      handler: pricesProxy,
    },
    {
      path: '/stripe/coupons',
      method: 'get',
      handler: couponsProxy,
    },
    {
      path: '/stripe/invoices/:uid',
      method: 'get',
      handler: invoicesProxy,
    },
    {
      path: '/stripe/products',
      method: 'get',
      handler: productsProxy,
    },
    // The seed endpoint is used to populate the database with some example data
    // You should delete this endpoint before deploying your site to production
    {
      path: '/seed',
      method: 'get',
      handler: seed,
    },
  ],
  plugins: [
    // @ts-expect-error
    cloudinaryPlugin(),
    formBuilder({
      formSubmissionOverrides: {
        admin: {
          group: 'Business Data',
        },
      },
      formOverrides: {
        admin: {
          group: 'Website Content',
        },
      },
      // ...
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        state: true,
        country: true,
        checkbox: true,
        number: true,
        message: true,
        payment: false,
      },
    }),
    stripePlugin({
      stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
      isTestKey: Boolean(process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY),
      stripeWebhooksEndpointSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET,
      rest: false,
      webhooks: {
        'product.created': productUpdated,
        'product.updated': productUpdated,
        'price.updated': priceUpdated,
      },
    }),
    redirects({
      overrides: {
        admin: {
          group: 'Website Content',
        },
      },
      collections: ['pages', 'products'],
    }),
    nestedDocs({
      collections: ['categories'],
    }),
    seo({
      collections: ['pages', 'products'],
      generateTitle,
      uploadsCollection: 'media',
    }),
    payloadCloud(),
  ],
})
