export type RatingStats = {
  tongBinhLuan: number;
  diemTrungBinh: number | null;
};

export function formatRatingStats(stats: {
  _avg: { sao_binh_luan: number | null };
  _count: { id: number };
}): RatingStats {
  return {
    tongBinhLuan: stats._count.id,
    diemTrungBinh:
      stats._avg.sao_binh_luan !== null
        ? Math.round(stats._avg.sao_binh_luan * 10) / 10
        : null,
  };
}

export function ratingStatsMap(
  rows: Array<{
    ma_phong: number;
    _avg: { sao_binh_luan: number | null };
    _count: { id: number };
  }>,
): Map<number, RatingStats> {
  return new Map(
    rows.map((row) => [row.ma_phong, formatRatingStats({ _avg: row._avg, _count: row._count })]),
  );
}

export function addRating<T extends { id: number }>(
  room: T,
  statsMap: Map<number, RatingStats>,
): T & { thongKeBinhLuan: RatingStats } {
  return {
    ...room,
    thongKeBinhLuan: statsMap.get(room.id) ?? { tongBinhLuan: 0, diemTrungBinh: null },
  };
}
