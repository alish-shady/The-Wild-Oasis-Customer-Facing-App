export interface Booking {
  id: number;
  guestId: number;
  startDate: string;
  endDate: string;
  numNights: number;
  totalPrice: number;
  numGuests: number;
  status: 1 | 0;
  created_at: string;
  cabins: { name: string; image: string };
}
export type bookingId = Booking["id"];
export type startDate = Booking["startDate"];
