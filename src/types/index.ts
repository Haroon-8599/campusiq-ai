export interface CollegeBasic {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  collegeType: string;
  ownership: string;
  establishedYear: number;
  campusSizeAcres: number;
  hostelAvailable: boolean;
  nirfRank: number | null;
  naacRating: string | null;
  overallRating: number;
  reviewCount: number;
  feesMin: number;
  feesMax: number;
  avgPackageLpa: number;
  highestPackageLpa: number;
  placementRate: number;
  address: string;
  website: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  overview: string;
  isFeatured: boolean;
  state: { id: string; name: string; code: string };
  city: { id: string; name: string };
  courses?: CourseItem[];
  matchScore?: number;
}

export interface CourseItem {
  id: string;
  name: string;
  degree: string;
  branch: string;
  durationYears: number;
  annualTuition: number;
  seats: number;
  cutoffGeneral: number | null;
  cutoffObc: number | null;
  cutoffSc: number | null;
  cutoffSt: number | null;
  entranceExam: string;
}

export interface PlacementItem {
  id: string;
  year: number;
  avgPackage: number;
  medianPackage: number;
  highestPackage: number;
  placementPercentage: number;
  totalOffers: number;
  topSectors: string[];
}

export interface RecruiterItem {
  id: string;
  name: string;
  logo: string | null;
  tier: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  user: { name: string; avatar: string | null };
  rating: number;
  academicRating: number;
  infrastructureRating: number;
  campusLifeRating: number;
  placementRating: number;
  title: string;
  pros: string;
  cons: string;
  verified: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  amount: string;
  eligibilityCriteria: string;
  deadline: string | null;
}

export interface CollegeDetail extends CollegeBasic {
  courses: CourseItem[];
  placements: PlacementItem[];
  recruiters: { recruiter: RecruiterItem }[];
  reviews: ReviewItem[];
  scholarships: ScholarshipItem[];
  similarColleges?: CollegeBasic[];
}

export interface PredictorInput {
  exam: string;
  rank: number;
  category: string;
  homeState: string;
  gender: string;
  budget?: number;
  preferredBranch?: string;
}

export interface PredictorResult {
  college: CollegeBasic;
  course: CourseItem;
  probability: number; // 0 to 100
  tier: "Safe" | "Target" | "Dream";
  confidenceScore: number;
  matchReasons: string[];
  decisionSummary: string;
}

export interface SearchFilterState {
  query: string;
  state: string;
  city: string;
  course: string;
  collegeType: string;
  ownership: string;
  minRating: number;
  maxFees: number;
  minAvgPackage: number;
  exam: string;
  nirfTier: string;
  hostelOnly: boolean;
  sortBy: "match" | "nirf" | "package" | "fees" | "rating";
  page: number;
  limit: number;
}
