// 1 = most sensitive ("do not read unless cleared"), 3 = general distribution.
export type ClassificationTier = 1 | 2 | 3;

export interface ReaderStatus {
  name: string;
  hasRead: boolean;
  respondedAt?: string;
}

// A "capsule pod" is one stored document: a model writeup, a system spec,
// a release note, etc. This is the shape the frontend renders -- the API
// route maps the database's snake_case columns into this.
export interface DocumentPod {
  id: string;
  title: string;
  genre: string;
  model: string;
  system: string;
  useCase: string;
  version: string;
  // 1-100, drives the badge color on the card. Purely cosmetic
  // "importance" score, not a real metric.
  filePath: string;
  powerLevel: number;
  publishedAt: string;
  classificationTier: ClassificationTier;
  // The one question every reader must answer yes to before they're
  // marked as having read this specific document.
  acknowledgmentQuestion: string;
  readers: ReaderStatus[];
}
