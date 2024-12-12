export const REVIEWS = `
  query Reviews($where: Review_where) {
    Reviews(where: $where, limit: 100) {
     docs {
        id
        name
        rating
        statement
        publishedOn
      }
    }
  }
`

export const RATING = `
mutation AvgRating($slug: String!) {
  calculateAverageRating(relatedListing: $slug)
}
`