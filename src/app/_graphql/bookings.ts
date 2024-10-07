export const BOOKINGS = `
query GetBookings($where: Booking_where) {
  Bookings(limit: 100, where: $where){
    docs {
      id
      startDate
      endDate
    }
  }
}
`
