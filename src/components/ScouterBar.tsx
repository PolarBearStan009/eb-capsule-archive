"use client";

// The "scouter" is the search + filter HUD across the top of the archive.
// It's a controlled component: the parent page owns the actual state,
// this just renders the readout and reports changes upward.
interface ScouterBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedGenre: string;
  onSelectedGenreChange: (value: string) => void;
  genreOptions: string[];
  resultCount: number;
}

export default function ScouterBar({
  searchQuery,
  onSearchQueryChange,
  selectedGenre,
  onSelectedGenreChange,
  genreOptions,
  resultCount,
}: ScouterBarProps) {
  return (
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-3">
        <span className="scouter-readout text-xs tracking-[0.3em] text-[#8fb8dd]">
          pwr
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search the archive..."
          className="w-full rounded-xl border border-white/70 bg-white/50 px-4 py-2.5 text-sm text-[#4a4468] placeholder:text-[#8a85ab]/70 outline-none focus:border-[#c9b8ff]"
        />
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedGenre}
          onChange={(event) => onSelectedGenreChange(event.target.value)}
          className="rounded-xl border border-white/70 bg-white/50 px-3 py-2.5 text-sm text-[#4a4468] outline-none focus:border-[#c9b8ff]"
        >
          <option value="all">All genres</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <span className="whitespace-nowrap rounded-xl border border-white/70 bg-white/60 px-3 py-2.5 text-xs font-medium text-[#7a74a8]">
          {resultCount} detected
        </span>
      </div>
    </div>
  );
}
