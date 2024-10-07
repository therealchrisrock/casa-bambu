import * as React from 'react'
import { Select, useFormFields } from 'payload/components/forms'
import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
import { TextField } from 'payload/dist/fields/config/types'

export const InvoiceSelect: React.FC<TextField> = props => {
  // @ts-ignore
  const { name, label, path } = props
  const [options, setOptions] = React.useState<
    {
      label: string
      value: string
    }[]
  >([])
  const v = useFormFields(([fields]) => fields)
  const { value: stripeProductID } = useFormFields(([fields]) => fields[path])

  React.useEffect(() => {
    const getStripeProducts = async () => {
      const invoices = await fetch(`/api/stripe/invoices/${v['user'].value}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await invoices.json()
      if (res?.data) {
        const fetchedProducts = res.data.reduce(
          (acc, item) => {
            acc.push({
              label: item.number || item.id,
              value: item.id,
            })
            return acc
          },
          [
            {
              label: 'Select an Invoice',
              value: '',
            },
          ],
        )
        setOptions(fetchedProducts)
      }
    }
    if (v['user'].value) {
      getStripeProducts()
    }
  }, [])

  const href = `https://dashboard.stripe.com/${
    process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
  }invoices/${stripeProductID}`

  if (!v['user'].value) {
    return <></>
  }
  return (
    <div style={{ paddingBottom: '30px' }}>
      <p style={{ marginBottom: '0' }}>{typeof label === 'string' ? label : 'Product'}</p>
      <p
        style={{
          marginBottom: '0.75rem',
          color: 'var(--theme-elevation-400)',
        }}
      >
        {`Select the related Stripe product or `}
        <a
          href={`https://dashboard.stripe.com/${
            process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
          }products/create`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--theme-text' }}
        >
          create a new one
        </a>
        {'.'}
      </p>
      <Select {...props} label="" options={options} />
      {Boolean(stripeProductID) && (
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
                options.find(option => option.value === stripeProductID)?.label || 'Unknown'
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
              href={`https://dashboard.stripe.com/${
                process.env.PAYLOAD_PUBLIC_STRIPE_IS_TEST_KEY ? 'test/' : ''
              }invoices/${stripeProductID}`}
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
