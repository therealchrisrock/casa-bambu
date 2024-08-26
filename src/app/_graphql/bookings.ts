export const BOOKINGS = `
query GetBookings($where: Booking_where) {
  Bookings(where: $where){
    docs {
      id
      startDate
      endDate
    }
  }
}
`
