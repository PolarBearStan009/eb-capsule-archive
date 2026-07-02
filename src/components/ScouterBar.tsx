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
    <div className="glass-panel flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex flex-1 items-center gap-3">
        <span className="scouter-readout text-xs tracking-[0.3em] text-[color:var(--text-accent-blue)]">
          pwr
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchQueryChange(event.target.value)}
          placeholder="Search the archive..."
          className="w-full rounded-xl border border-[color:var(--input-border)] bg-[color:var(--input-bg)] px-4 py-2.5 text-base text-[color:var(--text-heading)] outline-none placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--input-focus-border)] sm:text-sm"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedGenre}
          onChange={(event) => onSelectedGenreChange(event.target.value)}
          className="flex-1 rounded-xl border border-[color:var(--input-border)] bg-[color:var(--input-bg)] px-3 py-2.5 text-base text-[color:var(--text-heading)] outline-none focus:border-[color:var(--input-focus-border)] sm:flex-none sm:text-sm"
        >
          <option value="all">All genres</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <span className="whitespace-nowrap rounded-xl border border-[color:var(--input-border)] bg-[color:var(--input-bg)] px-3 py-2.5 text-xs font-medium text-[color:var(--text-body)]">
          {resultCount} detected
        </span>
      </div>
    </div>
  );
}
