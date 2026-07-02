"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ScouterBar from "@/components/ScouterBar";
import CapsulePod from "@/components/CapsulePod";
import UploadDocumentModal from "@/components/UploadDocumentModal";
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
    <main className="relative min-h-screen overflow-hidden text-[#4a4468]">
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className="scouter-readout text-xs tracking-[0.4em] text-[#8aa9c9]">
            transmission from sector 0079
          </span>
          <h1 className="text-4xl tracking-tight text-transparent [background-clip:text] [background-image:linear-gradient(120deg,#a7d8ff,#ffc2e2_50%,#c9b8ff)] sm:text-5xl">
            Capsule Archive
          </h1>
          <p className="max-w-xl text-sm text-[#6b6690]/80 sm:text-base">
            The org&apos;s document maker and archive. Read, host, edit, and
            generate documents for every model and system you ship.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="glow-button mt-2 rounded-full border border-white/70 bg-white/50 px-6 py-2.5 text-sm font-medium text-[#5a5480]"
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

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gohan.map((pod) => (
            <CapsulePod key={pod.id} pod={pod} />
          ))}
        </section>

        {!isLoading && gohan.length === 0 && (
          <p className="py-16 text-center text-sm text-[#8a85ab]">
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
