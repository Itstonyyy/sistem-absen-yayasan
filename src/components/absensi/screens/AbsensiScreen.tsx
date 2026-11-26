"use client";

import * as React from "react";
import {
  User,
  Briefcase,
  Clock,
  CalendarCheck,
  FileText,
  CheckCircle2,
  MapPin,
  X,
  PartyPopper,
  Info,
  LocateFixed,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  PrimaryButton,
  InfoRow,
} from "../shared/ui";
import { Field, TextArea, MapPlaceholder } from "../shared/form";
import { KUIS_LIST } from "../shared/data";
import { cn } from "@/lib/utils";

type AbsensiJenis = "masuk" | "pulang" | "masuk-lembur" | "pulang-lembur";

interface AbsensiScreenProps {
  jenis: AbsensiJenis;
}

const JENIS_META: Record<
  AbsensiJenis,
  { label: string; ctaLabel: string; showQuiz: boolean }
> = {
  masuk: { label: "Masuk", ctaLabel: "Kirim Absensi Masuk", showQuiz: false },
  pulang: { label: "Pulang", ctaLabel: "Kirim Absensi Pulang", showQuiz: true },
  "masuk-lembur": {
    label: "Masuk Lembur",
    ctaLabel: "Kirim Absensi Masuk Lembur",
    showQuiz: false,
  },
  "pulang-lembur": {
    label: "Pulang Lembur",
    ctaLabel: "Kirim Absensi Pulang Lembur",
    showQuiz: true,
  },
};

export function AbsensiScreen({ jenis }: AbsensiScreenProps) {
  const meta = JENIS_META[jenis];
  const [catatan, setCatatan] = React.useState("");
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [showQuizModal, setShowQuizModal] = React.useState(false);
  const [quizAnswer, setQuizAnswer] = React.useState<string | null>(null);
  const [quizResult, setQuizResult] = React.useState<{
    correct: boolean; 
    chosenLabel: string;
    correctLabel: string;
    pembahasan: string;
  } | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const [detectStatus, setDetectStatus] = React.useState<
    "idle" | "loading" | "success"
  >("idle");
  const [detectInfo, setDetectInfo] = React.useState<{
    lat: string;
    lng: string;
    akurasi: number;
    waktu: string;
  } | null>(null);
  const detectTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDeteksiLokasi = () => {
    if (detectStatus === "loading") return;
    setDetectStatus("loading");
    if (detectTimer.current) clearTimeout(detectTimer.current);
    detectTimer.current = setTimeout(() => {
      const now = new Date();
      const waktu = now
        .toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(/\./g, ":");
      setDetectInfo({
        lat: "-6.8925",
        lng: "107.6097",
        akurasi: 5,
        waktu,
      });
      setDetectStatus("success");
    }, 1200);
  };

  React.useEffect(() => {
    return () => {
      if (detectTimer.current) clearTimeout(detectTimer.current);
    };
  }, []);

  const quiz = React.useMemo(() => {
    const active = KUIS_LIST.filter((q) => q.status === "aktif");
    if (active.length === 0) return null;
    return active[Math.floor(Math.random() * active.length)];
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meta.showQuiz && quiz) {
      setShowQuizModal(true);
      return;
    }
    finalizeSubmit();
  };

  const finalizeSubmit = () => {
    setShowQuizModal(false);
    setSubmitted(true);
    setShowResultModal(true);
  };

  const submitQuiz = () => {
    if (!quiz || !quizAnswer) return;
    const options = [
      { key: "A", label: quiz.opsiA },
      { key: "B", label: quiz.opsiB },
      { key: "C", label: quiz.opsiC },
      { key: "D", label: quiz.opsiD },
    ];
    const chosen = options.find((o) => o.key === quizAnswer)!;
    const correct = options.find((o) => o.key === quiz.kunci)!;
    setQuizResult({
      correct: quizAnswer === quiz.kunci,
      chosenLabel: chosen.label,
      correctLabel: correct.label,
      pembahasan: quiz.pembahasan,
    });
  };

  return (
    <div className="space-y-6">
      {/* Submit success modal */}
      {showResultModal && (
        <Modal onClose={() => setShowResultModal(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Absensi Berhasil!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Absensi {meta.label.toLowerCase()} Anda telah tercatat pada pukul{" "}
              <span className="font-bold text-emerald-700">08:38 WIB</span>.
            </p>
            <button
              onClick={() => {
                setShowResultModal(false);
                setSubmitted(false);
                setCatatan("");
              }}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      {/* Quiz modal for absen pulang */}
      {showQuizModal && quiz && !quizResult && (
        <Modal onClose={() => setShowQuizModal(false)}>
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <PartyPopper className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Kuis Sejarah Islam
                </h3>
                <p className="text-xs text-slate-500">
                  Jawab sebelum absensi pulang disimpan.
                </p>
              </div>
            </div>
            <p className="mb-4 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-800">
              {quiz.pertanyaan}
            </p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { key: "A", label: quiz.opsiA },
                { key: "B", label: quiz.opsiB },
                { key: "C", label: quiz.opsiC },
                { key: "D", label: quiz.opsiD },
              ].map((o) => (
                <button
                  key={o.key}
                  onClick={() => setQuizAnswer(o.key)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm font-semibold transition-colors",
                    quizAnswer === o.key
                      ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      quizAnswer === o.key
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-600",
                    )}
                  >
                    {o.key}
                  </span>
                  {o.label}
                </button>
              ))}
            </div>
            <button
              disabled={!quizAnswer}
              onClick={submitQuiz}
              className={cn(
                "mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
                quizAnswer
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "cursor-not-allowed bg-slate-200 text-slate-400",
              )}
            >
              Kirim Jawaban
            </button>
          </div>
        </Modal>
      )}

      {/* Quiz result modal */}
      {showQuizModal && quiz && quizResult && (
        <Modal onClose={finalizeSubmit}>
          <div className="text-center">
            <div
              className={cn(
                "mx-auto flex h-16 w-16 items-center justify-center rounded-full",
                quizResult.correct ? "bg-emerald-100" : "bg-amber-100",
              )}
            >
              {quizResult.correct ? (
                <CheckCircle2 className="h-9 w-9 text-emerald-600" />
              ) : (
                <Info className="h-9 w-9 text-amber-600" />
              )}
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              {quizResult.correct ? "Jawaban Benar!" : "Jawaban Kurang Tepat"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {quizResult.correct
                ? "Kerja bagus! Terus tingkatkan wawasan."
                : "Tidak apa-apa, yang penting Anda tetap belajar."}
            </p>
            {!quizResult.correct && (
              <div className="mt-3 rounded-xl bg-emerald-50 p-3 text-left text-xs">
                <p className="font-bold text-emerald-800">
                  Jawaban benar: {quizResult.correctLabel}
                </p>
              </div>
            )}
            <div className="mt-3 rounded-xl bg-slate-50 p-3 text-left text-xs text-slate-600">
              <p className="font-bold text-slate-700">Pembahasan:</p>
              <p className="mt-1">{quizResult.pembahasan}</p>
            </div>
            <button
              onClick={finalizeSubmit}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Lanjut Simpan Absensi
            </button>
          </div>
        </Modal>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Data Karyawan card */}
        <Card>
          <CardHeader title="Data Karyawan" icon={User} iconColor="blue" />
          <CardBody className="space-y-5">
            <div className="rounded-xl bg-slate-50 p-4">
              <InfoRow label="Nama" value="Arif Fatoni" icon={User} />
              <div className="border-t border-slate-200" />
              <InfoRow label="Jabatan" value="Staf Program" icon={Briefcase} />
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="h-4 w-4 text-blue-600" />
              Informasi Absensi
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <InfoRow
                label="Jenis Absensi"
                value={
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                    {meta.label}
                  </span>
                }
                icon={Clock}
              />
              <div className="border-t border-slate-200" />
              <InfoRow
                label="Tanggal"
                value="Senin, 09 Nov 2026"
                icon={CalendarCheck}
              />
              <div className="border-t border-slate-200" />
              <InfoRow
                label="Waktu Sekarang"
                value={
                  <span className="font-extrabold text-emerald-700">
                    08:38:11 WIB
                  </span>
                }
                icon={Clock}
              />
            </div>
          </CardBody>
        </Card>

        {/* GPS Location card */}
        <Card>
          <CardHeader
            title="Lokasi Absensi (GPS)"
            icon={MapPin}
            iconColor="green"
          />
          <CardBody className="space-y-4">
            <button
              type="button"
              onClick={handleDeteksiLokasi}
              disabled={detectStatus === "loading"}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors",
                detectStatus === "loading"
                  ? "cursor-wait border-blue-200 bg-blue-50 text-blue-500"
                  : "border-blue-200 bg-white text-blue-700 hover:bg-blue-50",
              )}
            >
              {detectStatus === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LocateFixed className="h-4 w-4" />
              )}
              {detectStatus === "loading"
                ? "Mendeteksi Lokasi..."
                : "Deteksi Lokasi"}
            </button>
            <MapPlaceholder inRadius distance={35} />
            {detectStatus === "success" && detectInfo && (
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-blue-900">
                    Lokasi terkini terdeteksi
                  </p>
                  <p className="mt-0.5 text-xs text-blue-700">
                    {detectInfo.lat}, {detectInfo.lng} &middot; Akurasi:
                    &plusmn;
                    {detectInfo.akurasi} m &middot; {detectInfo.waktu} WIB
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-900">
                  Anda berada di dalam area absensi
                </p>
                <p className="text-xs text-emerald-700">
                  Jarak: 35 meter (Radius: 100 meter) &middot; Titik: Kantor
                  Pusat
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Catatan + submit */}
      <Card>
        <CardHeader
          title="Catatan (Opsional)"
          icon={FileText}
          iconColor="blue"
        />
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Catatan Absensi">
              <TextArea
                placeholder="Tambahkan catatan jika diperlukan..."
                rows={3}
              />
            </Field>
            <div className="flex justify-end">
              <span className="text-xs text-slate-400">0 / 200</span>
            </div>
            <PrimaryButton icon={CheckCircle2} type="submit">
              {meta.ctaLabel}
            </PrimaryButton>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
