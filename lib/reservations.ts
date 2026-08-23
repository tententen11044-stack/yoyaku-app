import { supabase, type ReservationRow } from "./supabase";

/** 予約を日時の早い順に取得する */
export async function fetchReservations(): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** 予約を1件追加して、追加された行を返す */
export async function addReservation(
  name: string,
  startsAt: string,
): Promise<ReservationRow> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({ name, starts_at: new Date(startsAt).toISOString() })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}
