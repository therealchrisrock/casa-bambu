import type { PayloadHandler } from 'payload/config'
import invariant from 'tiny-invariant'

export const getAvailability: PayloadHandler = async (req, res): Promise<void> => {
  const { payload } = req
  res.send('id: ' + req.query.id);
  const id = req.query.id
  invariant(id, 'A location ID must be provided to get availability')
  // const query = {
  //   'orders.items': {
  //     exists: true
  //   }
  // }
  // const orders = await fetchDoc()
  res.status(200).json({ message: 'success!' })
  return
}

