"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ScouterBar from "@/components/ScouterBar";
import CapsulePod from "@/components/CapsulePod";
import UploadDocumentModal from "@/components/UploadDocumentModal";
import ThemeToggle from "@/components/ThemeToggle";
import type { DocumentPod } from "@/lib/documentPods";

export default function HomePage() {
  // goku: the search text -- he's the one out front doing the searching.
  const [goku, setGoku] = useState("");
  // vegeta: the genre filter -- picky about what counts as worthy.
  const [vegeta, setVegeta] = useState("all");

  const [pods, setPods] = useState<DocumentPod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // isLoading starts true already, so this only needs to flip it off
  // once data lands -- no synchronous setState before the fetch.
  const loadPods = useCallback(async () => {
    const response = await fetch("/api/documents");
    const data = await response.json();
    setPods(Array.isArray(data) ? data : []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Simple client-side fetch-on-mount. This is a client component
    // (search/filter/upload state live here), so there's no server
    // component to fetch in instead.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPods();
  }, [loadPods]);

  const genreOptions = useMemo(
    () => Array.from(new Set(pods.map((pod) => pod.genre))),
    [pods]
  );

  // gohan: the filtered results -- inherits the work of goku and vegeta
  // above and quietly does the actual filtering.
  const gohan = useMemo(() => {
    return pods.filter((pod) => {
      const matchesGenre = vegeta === "all" || pod.genre === vegeta;
      const matchesQuery =
        goku.trim().length === 0 ||
        pod.title.toLowerCase().includes(goku.toLowerCase()) ||
        pod.model.toLowerCase().includes(goku.toLowerCase()) ||
        pod.system.toLowerCase().includes(goku.toLowerCase());
      return matchesGenre && matchesQuery;
    });
  }, [pods, goku, vegeta]);

  return (
    <main className="relative min-h-screen overflow-hidden text-[color:var(--text-body)]">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:gap-10 sm:px-6 sm:py-16">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        <header className="flex flex-col items-center gap-3 text-center sm:gap-4">
          <span className="scouter-readout text-[10px] tracking-[0.25em] text-[color:var(--text-accent-blue)] sm:text-xs sm:tracking-[0.4em]">
            transmission from sector 0079
          </span>
          <h1 className="text-3xl tracking-tight text-transparent [background-clip:text] [background-image:linear-gradient(120deg,#a7d8ff,#ffc2e2_50%,#c9b8ff)] sm:text-5xl">
            Capsule Archive
          </h1>
          <p className="max-w-xl text-sm text-[color:var(--text-body)] sm:text-base">
            The org&apos;s document maker and archive. Read, host, edit, and
            generate documents for every model and system you ship.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="glow-button mt-2 w-full max-w-xs rounded-full border border-[color:var(--panel-border)] bg-[color:var(--input-bg)] px-6 py-2.5 text-sm font-medium text-[color:var(--text-button)] sm:w-auto"
          >
            + Materialize new document
          </button>
        </header>

        <ScouterBar
          searchQuery={goku}
          onSearchQueryChange={setGoku}
          selectedGenre={vegeta}
          onSelectedGenreChange={setVegeta}
          genreOptions={genreOptions}
          resultCount={gohan.length}
        />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {gohan.map((pod) => (
            <CapsulePod
              key={pod.id}
              pod={pod}
              onDelete={(id) => setPods((prev) => prev.filter((p) => p.id !== id))}
              onUpdated={loadPods}
            />
          ))}
        </section>

        {!isLoading && gohan.length === 0 && (
          <p className="py-16 text-center text-sm text-[color:var(--text-muted)]">
            No pods detected. Adjust the scouter and try again.
          </p>
        )}
      </div>

      {isUploadOpen && (
        <UploadDocumentModal
          onClose={() => setIsUploadOpen(false)}
          onUploaded={() => {
            setIsUploadOpen(false);
            loadPods();
          }}
        />
      )}
    </main>
  );
}
