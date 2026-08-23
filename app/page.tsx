"use client";

import { useState } from "react";

const LOCATION = "大洲平野運動公園";

type Reservation = {
  id: number;
  name: string;
  datetime: string;
  location: string;
};

function formatDatetime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function Home() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !datetime) {
      setError("お名前と日時の両方を入力してください。");
      return;
    }

    setReservations((prev) => [
      ...prev,
      { id: Date.now(), name: name.trim(), datetime, location: LOCATION },
    ]);
    setName("");
    setDatetime("");
    setError("");
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          ランニング練習 予約
        </h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          お名前と希望日時を入力して予約してください。
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-1.5 text-sm dark:border-white/15">
          <span className="text-black/50 dark:text-white/50">練習場所</span>
          <span className="font-medium">{LOCATION}</span>
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-black/10 p-6 dark:border-white/15"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">お名前</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-black/50 dark:border-white/20 dark:focus:border-white/60"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">練習日時</span>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-2 outline-none focus:border-black/50 dark:border-white/20 dark:focus:border-white/60"
            />
          </label>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="rounded-lg bg-foreground px-4 py-2.5 font-medium text-background transition-opacity hover:opacity-85"
          >
            予約する
          </button>
        </div>
      </form>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">
          予約一覧
          <span className="ml-2 text-sm font-normal text-black/50 dark:text-white/50">
            {reservations.length}件
          </span>
        </h2>

        {reservations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/15 px-6 py-10 text-center text-sm text-black/50 dark:border-white/20 dark:text-white/50">
            まだ予約はありません。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {reservations.map((r) => (
              <li
                key={r.id}
                className="rounded-xl border border-black/10 px-5 py-4 dark:border-white/15"
              >
                <p className="font-medium">{r.name}</p>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">
                  {formatDatetime(r.datetime)}
                </p>
                <p className="mt-0.5 text-sm text-black/50 dark:text-white/50">
                  {r.location}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
