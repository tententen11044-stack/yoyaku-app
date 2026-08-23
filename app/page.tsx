"use client";

import { useEffect, useState } from "react";

import { fetchReservations, addReservation } from "@/lib/reservations";
import type { ReservationRow } from "@/lib/supabase";

const LOCATION = "大洲平野運動公園";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("ja-JP", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(d);
}

function formatTime(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function RunnerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <circle cx="15.5" cy="4" r="2.1" fill="currentColor" />
      <path
        d="M13.6 8.1 10 10.2l1.9 2.9-1.6 5.2M13.6 8.1l3.6 1.4 1.2 3.4M13.6 8.1 8.4 9.6 7 12.7M11.9 13.1l3.5 1.5 1.1 4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8h4M1 12h3.5M3 16h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function PinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={className}>
      <path
        d="M12 21s7-5.7 7-10.5A7 7 0 0 0 5 10.5C5 15.3 12 21 12 21Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.3" r="2.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

/** 陸上トラックのレーンを模した背景装飾 */
function TrackLines() {
  const lanes = [0, 1, 2, 3, 4];
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="none"
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full opacity-20"
    >
      {lanes.map((i) => (
        <path
          key={i}
          d={
            "M-20 " +
            (190 - i * 34) +
            " C 90 " +
            (150 - i * 34) +
            ", 230 " +
            (120 - i * 30) +
            ", 420 " +
            (40 - i * 26)
          }
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray={i % 2 === 0 ? "0" : "10 9"}
        />
      ))}
    </svg>
  );
}

export default function Home() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 最初に一度、保存済みの予約をデータベースから読み込む
  useEffect(() => {
    fetchReservations()
      .then(setReservations)
      .catch(() => setError("予約一覧を読み込めませんでした。通信環境をご確認ください。"))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !datetime) {
      setError("お名前と日時の両方を入力してください。");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const saved = await addReservation(name.trim(), datetime);
      setReservations((prev) =>
        [...prev, saved].sort((a, b) => a.starts_at.localeCompare(b.starts_at)),
      );
      setName("");
      setDatetime("");
    } catch {
      setError("保存できませんでした。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-line bg-background px-4 py-3 text-base outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25";

  return (
    <main className="mx-auto w-full max-w-2xl px-5 pb-20 pt-10 sm:px-6">
      {/* ヒーロー：トラックのレーンを背景にした見出し */}
      <header className="relative overflow-hidden rounded-3xl bg-[#14181f] px-7 py-10 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/35 via-transparent to-transparent" />
        <div className="text-accent">
          <TrackLines />
        </div>

        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
            <RunnerIcon className="h-5 w-5" />
            Running Club
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            ランニング練習
            <br />
            <span className="text-accent">予約</span>
          </h1>

          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            お名前と希望日時を入力するだけ。今日も一歩、前へ。
          </p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <PinIcon className="h-4 w-4 text-accent" />
            <span className="font-semibold">{LOCATION}</span>
          </p>
        </div>
      </header>

      {/* 予約フォーム */}
      <form
        onSubmit={handleSubmit}
        className="relative -mt-6 rounded-2xl border border-line bg-surface p-6 shadow-lg sm:p-7"
      >
        <div className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">
              お名前
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="山田 太郎"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">
              練習日時
            </span>
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className={inputClass}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="group flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3.5 text-base font-bold text-white shadow-md transition-all hover:bg-accent-strong hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RunnerIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            {saving ? "送信中..." : "予約する"}
          </button>
        </div>
      </form>

      {/* 予約一覧 */}
      <section className="mt-10">
        <div className="mb-5 flex items-baseline justify-between border-b-2 border-line pb-3">
          <h2 className="text-lg font-black tracking-tight">エントリー一覧</h2>
          <span className="text-sm font-bold text-accent">
            {reservations.length}
            <span className="ml-0.5 text-muted">名</span>
          </span>
        </div>

        {loading ? (
          <p className="rounded-2xl border-2 border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            読み込み中...
          </p>
        ) : reservations.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            まだエントリーはありません。
            <br />
            最初のランナーになりましょう。
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {reservations.map((r, i) => (
              <li
                key={r.id}
                className="flex items-center gap-4 overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* ゼッケン番号ふうの通し番号 */}
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-base font-bold text-accent">
                  {i + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-bold">{r.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
                    <PinIcon className="h-3.5 w-3.5 shrink-0" />
                    {r.location}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-medium text-muted">
                    {formatDate(r.starts_at)}
                  </p>
                  <p className="font-mono text-lg font-bold leading-tight">
                    {formatTime(r.starts_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
