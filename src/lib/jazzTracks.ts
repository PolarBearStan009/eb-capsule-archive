// Genuine public-domain 78rpm jazz recordings from Wikimedia Commons --
// free to stream, no license fees, no hosting cost (Wikimedia serves the
// files). Deliberately low-fi vintage transfers, not studio masters.
export interface JazzTrack {
  title: string;
  artist: string;
  src: string;
}

export const jazzTracks: JazzTrack[] = [
  {
    title: "Jazz Me Blues",
    artist: "Original Dixieland Jass Band, 1921",
    src: "https://upload.wikimedia.org/wikipedia/commons/6/62/OriginalDixielandJassBand-JazzMeBlues.ogg",
  },
  {
    title: "Livery Stable Blues",
    artist: "Original Dixieland Jass Band, 1917",
    src: "https://upload.wikimedia.org/wikipedia/commons/1/19/Original_Dixieland_Jass_Band_-_Livery_Stable_Blues_%281917%29_with_hiss_reduction.ogg",
  },
  {
    title: "Copenhagen",
    artist: "Bix Beiderbecke",
    src: "https://upload.wikimedia.org/wikipedia/commons/d/d1/BixBeiderbecke-Copenhagen.ogg",
  },
];
