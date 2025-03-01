/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CouponItems".
 */
export type CouponItems =
  | {
      label?: string | null;
      couponID: string;
      amount?: number | null;
      id?: string | null;
    }[]
  | null;
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CartItems".
 */
export type CartItems =
  | {
      product?: (string | null) | Product;
      stripeProductID?: string | null;
      priceID: string;
      quantity?: number | null;
      id?: string | null;
    }[]
  | null;

export interface Config {
  collections: {
    pages: Page;
    products: Product;
    policies: Policy;
    orders: Order;
    media: Media;
    categories: Category;
    users: User;
    reviews: Review;
    bookings: Booking;
    amenities: Amenity;
    faqs: Faq;
    forms: Form;
    'form-submissions': FormSubmission;
    redirects: Redirect;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    settings: Settings;
    header: Header;
    footer: Footer;
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "pages".
 */
export interface Page {
  id: string;
  title: string;
  publishedOn?: string | null;
  hero: {
    type: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact';
    richText?:
      | {
          [k: string]: unknown;
        }[]
      | null;
    links?:
      | {
          link: {
            type?: ('reference' | 'custom') | null;
            newTab?: boolean | null;
            reference?:
              | ({
                  relationTo: 'pages';
                  value: string | Page;
                } | null)
              | ({
                  relationTo: 'policies';
                  value: string | Policy;
                } | null);
            url?: string | null;
            label: string;
            appearance?: ('default' | 'primary' | 'secondary' | 'link') | null;
          };
          id?: string | null;
        }[]
      | null;
    media?: string | Media | null;
  };
  layout?:
    | (
        | {
            invertBackground?: boolean | null;
            richText: {
              [k: string]: unknown;
            }[];
            links?:
              | {
                  link: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('primary' | 'secondary') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta';
          }
        | {
            invertBackground?: boolean | null;
            columns?:
              | {
                  size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                  media?: string | Media | null;
                  richText?:
                    | {
                        [k: string]: unknown;
                      }[]
                    | null;
                  enableLink?: boolean | null;
                  link?: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('default' | 'primary' | 'secondary' | 'link') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'content';
          }
        | {
            invertBackground?: boolean | null;
            position?: ('default' | 'fullscreen') | null;
            media: string | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'mediaBlock';
          }
        | {
            introContent: {
              [k: string]: unknown;
            }[];
            populateBy?: ('collection' | 'selection') | null;
            relationTo?: 'products' | null;
            appearance?: ('card' | 'wide') | null;
            categories?: (string | Category)[] | null;
            limit?: number | null;
            selectedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocsTotal?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'archive';
          }
        | {
            review: string | Review;
            media: string | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'reviewBlock';
          }
        | {
            form: string | Form;
            enableIntro?: boolean | null;
            introContent: {
              [k: string]: unknown;
            }[];
            id?: string | null;
            blockName?: string | null;
            blockType: 'formBlock';
          }
      )[]
    | null;
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: string | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "policies".
 */
export interface Policy {
  id: string;
  title: string;
  attachment?: (string | null) | Media;
  slug?: string | null;
  body?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt?: string | null;
  caption?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  cloudinary?: {
    public_id?: string | null;
    original_filename?: string | null;
    format?: string | null;
    secure_url?: string | null;
    resource_type?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "categories".
 */
export interface Category {
  id: string;
  title?: string | null;
  parent?: (string | null) | Category;
  breadcrumbs?:
    | {
        doc?: (string | null) | Category;
        url?: string | null;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  title: string;
  publishedOn?: string | null;
  available?: boolean | null;
  gallery?:
    | {
        media: string | Media;
        id?: string | null;
      }[]
    | null;
  productDescription: {
    [k: string]: unknown;
  }[];
  layout?:
    | (
        | {
            invertBackground?: boolean | null;
            richText: {
              [k: string]: unknown;
            }[];
            links?:
              | {
                  link: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('primary' | 'secondary') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta';
          }
        | {
            invertBackground?: boolean | null;
            columns?:
              | {
                  size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                  media?: string | Media | null;
                  richText?:
                    | {
                        [k: string]: unknown;
                      }[]
                    | null;
                  enableLink?: boolean | null;
                  link?: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('default' | 'primary' | 'secondary' | 'link') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'content';
          }
        | {
            invertBackground?: boolean | null;
            position?: ('default' | 'fullscreen') | null;
            media: string | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'mediaBlock';
          }
        | {
            introContent: {
              [k: string]: unknown;
            }[];
            populateBy?: ('collection' | 'selection') | null;
            relationTo?: 'products' | null;
            appearance?: ('card' | 'wide') | null;
            categories?: (string | Category)[] | null;
            limit?: number | null;
            selectedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocsTotal?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'archive';
          }
      )[]
    | null;
  bedroomQuantity: number;
  bathQuantity: number;
  maxGuestQuantity: number;
  baseGuestQuantity: number;
  priceJSON?: string | null;
  features?: (string | Amenity)[] | null;
  enablePaywall?: boolean | null;
  paywall?:
    | (
        | {
            invertBackground?: boolean | null;
            richText: {
              [k: string]: unknown;
            }[];
            links?:
              | {
                  link: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('primary' | 'secondary') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'cta';
          }
        | {
            invertBackground?: boolean | null;
            columns?:
              | {
                  size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
                  media?: string | Media | null;
                  richText?:
                    | {
                        [k: string]: unknown;
                      }[]
                    | null;
                  enableLink?: boolean | null;
                  link?: {
                    type?: ('reference' | 'custom') | null;
                    newTab?: boolean | null;
                    reference?:
                      | ({
                          relationTo: 'pages';
                          value: string | Page;
                        } | null)
                      | ({
                          relationTo: 'policies';
                          value: string | Policy;
                        } | null);
                    url?: string | null;
                    label: string;
                    appearance?: ('default' | 'primary' | 'secondary' | 'link') | null;
                  };
                  id?: string | null;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'content';
          }
        | {
            invertBackground?: boolean | null;
            position?: ('default' | 'fullscreen') | null;
            media: string | Media;
            id?: string | null;
            blockName?: string | null;
            blockType: 'mediaBlock';
          }
        | {
            introContent: {
              [k: string]: unknown;
            }[];
            populateBy?: ('collection' | 'selection') | null;
            relationTo?: 'products' | null;
            appearance?: ('card' | 'wide') | null;
            categories?: (string | Category)[] | null;
            limit?: number | null;
            selectedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocs?:
              | {
                  relationTo: 'products';
                  value: string | Product;
                }[]
              | null;
            populatedDocsTotal?: number | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'archive';
          }
      )[]
    | null;
  stripeProductID?: string | null;
  stripeGuestFeeID?: string | null;
  guestFeePriceJSON?: string | null;
  coupons?:
    | {
        nickname?: string | null;
        nights: number;
        stripeCoupon: string;
        stripeCouponJSON?: string | null;
        id?: string | null;
      }[]
    | null;
  variants?:
    | {
        priceID: string;
        seasonStart: string;
        seasonEnd: string;
        id?: string | null;
      }[]
    | null;
  categories?: (string | Category)[] | null;
  relatedProducts?: (string | Product)[] | null;
  slug?: string | null;
  skipSync?: boolean | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: string | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "amenities".
 */
export interface Amenity {
  id: string;
  title: string;
  description?: string | null;
  media: string | Media;
  category?: (string | Category)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "reviews".
 */
export interface Review {
  id: string;
  name: string;
  relatedListing?: (string | null) | Product;
  publishedOn?: string | null;
  rating: number;
  statement: string;
  user?: (string | null) | User;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "users".
 */
export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  roles?: ('admin' | 'customer')[] | null;
  purchases?: (string | Product)[] | null;
  stripeCustomerID?: string | null;
  cart?: {
    coupons?: CouponItems;
    from?: string | null;
    to?: string | null;
    basePrice?: number | null;
    duration?: number | null;
    product?: (string | null) | Product;
    listing?: string | null;
    guestsQuantity?: number | null;
    subtotal?: number | null;
    total?: number | null;
    fees?:
      | {
          label?: string | null;
          priceID?: string | null;
          total?: number | null;
          id?: string | null;
        }[]
      | null;
    items?: CartItems;
  };
  skipSync?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "forms".
 */
export interface Form {
  id: string;
  title: string;
  fields?:
    | (
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            defaultValue?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'checkbox';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'country';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'email';
          }
        | {
            message?:
              | {
                  [k: string]: unknown;
                }[]
              | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'message';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'number';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            options?:
              | {
                  label: string;
                  value: string;
                  id?: string | null;
                }[]
              | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'select';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'state';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'text';
          }
        | {
            name: string;
            label?: string | null;
            width?: number | null;
            defaultValue?: string | null;
            required?: boolean | null;
            id?: string | null;
            blockName?: string | null;
            blockType: 'textarea';
          }
      )[]
    | null;
  submitButtonLabel?: string | null;
  confirmationType?: ('message' | 'redirect') | null;
  confirmationMessage?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  redirect?: {
    url: string;
  };
  emails?:
    | {
        emailTo?: string | null;
        cc?: string | null;
        bcc?: string | null;
        replyTo?: string | null;
        emailFrom?: string | null;
        subject: string;
        message?:
          | {
              [k: string]: unknown;
            }[]
          | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: string;
  orderedBy?: (string | null) | User;
  stripePaymentIntentID?: string | null;
  total: number;
  items?:
    | {
        product: string | Product;
        price?: number | null;
        quantity?: number | null;
        startDate?: string | null;
        endDate?: string | null;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "bookings".
 */
export interface Booking {
  id: string;
  type: 'blockout' | 'reservation';
  bookingStatus?:
    | ('pending' | 'initConfirmed' | 'partiallyPaid' | 'paid' | 'cancelled' | 'inProgress' | 'complete')
    | null;
  introduction?: string | null;
  startDate: string;
  endDate: string;
  product: string | Product;
  invoice?: string | null;
  user?: (string | null) | User;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "faqs".
 */
export interface Faq {
  id: string;
  title: string;
  richText: {
    [k: string]: unknown;
  }[];
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "form-submissions".
 */
export interface FormSubmission {
  id: string;
  form: string | Form;
  submissionData?:
    | {
        field: string;
        value: string;
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "redirects".
 */
export interface Redirect {
  id: string;
  from: string;
  to?: {
    type?: ('reference' | 'custom') | null;
    reference?:
      | ({
          relationTo: 'pages';
          value: string | Page;
        } | null)
      | ({
          relationTo: 'products';
          value: string | Product;
        } | null);
    url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "settings".
 */
export interface Settings {
  id: string;
  productsPage?: (string | null) | Page;
  minBooking?: number | null;
  maxBooking?: number | null;
  advancedBookingLimit?: number | null;
  stripeCleaningFee?: string | null;
  stripeCleaningFeeJSON?: string | null;
  skipSync?: boolean | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "header".
 */
export interface Header {
  id: string;
  navItems?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?:
            | ({
                relationTo: 'pages';
                value: string | Page;
              } | null)
            | ({
                relationTo: 'policies';
                value: string | Policy;
              } | null);
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "footer".
 */
export interface Footer {
  id: string;
  navItems?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?:
            | ({
                relationTo: 'pages';
                value: string | Page;
              } | null)
            | ({
                relationTo: 'policies';
                value: string | Policy;
              } | null);
          url?: string | null;
          label: string;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}