
export const FAQS = `
  query Faqs {
    Faqs(limit: 50) {
      docs {
        id
        title
        richText
      }
    }
  }
`
