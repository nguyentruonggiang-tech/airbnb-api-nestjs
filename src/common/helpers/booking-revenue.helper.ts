const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calcSoDem(ngayDen: Date, ngayDi: Date): number {
  return Math.ceil((ngayDi.getTime() - ngayDen.getTime()) / MS_PER_DAY);
}

export function calcBookingRevenue(
  ngayDen: Date,
  ngayDi: Date,
  giaTien: number | { toString(): string },
): number {
  return calcSoDem(ngayDen, ngayDi) * Number(giaTien);
}

export function calcTotalRevenue(
  bookings: Array<{
    ngay_den: Date;
    ngay_di: Date;
    phong: { gia_tien: number | { toString(): string } };
  }>,
): number {
  return bookings.reduce(
    (sum, booking) =>
      sum + calcBookingRevenue(booking.ngay_den, booking.ngay_di, booking.phong.gia_tien),
    0,
  );
}
