import * as React from 'react'
import { Select, useFormFields } from 'payload/components/forms'
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
import { TextField } from 'payload/dist/fields/config/types'

export const PriceSelect: React.FC<TextField> = props => {
  // @ts-ignore
  const { name, label, path } = props
  const [options, setOptions] = React.useState<
    {
      label: string
      value: string
    }[]
  >([])
  const v = useFormFields(([fields]) => fields)
  const productID = v['stripeProductID']?.value
  const { value: price } = useFormFields(([fields]) => fields[path])

  React.useEffect(() => {
    const getProductPrices = async () => {
      const productsFetch = await fetch(`/api/stripe/prices/${productID}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await productsFetch.json()
      if (res?.data) {
        const fp = res.data.reduce(
          (acc, item) => {
            acc.push({
              label: item.nickname || item.id,
              value: item.id,
            })
            return acc
          },
          [
            {
              label: 'Select a Price',
              value: '',
            },
          ],
        )
        setOptions(fp)
      }
    }
    if (productID) getProductPrices()
  }, [v, productID])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }prices/${price}`
  if (!productID) return <div>You must Select a product above to use this feature.</div>

  return (
    <div style={{ paddingBottom: '12px' }}>
      <p style={{ marginBottom: '0' }}>{typeof label === 'string' ? label : 'Price'}</p>
      <p
        style={{
          marginBottom: '0.75rem',
          color: 'var(--theme-elevation-400)',
        }}
      >
        {`Select the related Stripe price or `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }products/${productID}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text' }}
        >
          create a new one
        </a>
        {'.'}
      </p>
      <Select {...props} label="" options={options} />
      {Boolean(price) && (
        <div
          style={{
            marginTop: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <span
              className="label"
              style={{
                color: '#9A9A9A',
                paddingTop: '12px',
              }}
            >
              {`Manage "${
                options.find(option => option.value === price)?.label || 'Unknown'
              }" in Stripe`}
            </span>
            <CopyToClipboard value={href} />
          </div>
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: '600',
            }}
          >
            <a
              href={href}
              target="_blank"
              rel="noreferrer noopener"
            >
              {href}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
