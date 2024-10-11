
export const POLICY = `
query Policy($slug: String, $draft: Boolean) {
      Policies(where: { slug: { equals: $slug}}, limit: 1, draft: $draft) {
        docs {
          title
          attachment {
            url
          }
          body
        }
      }
}
`
