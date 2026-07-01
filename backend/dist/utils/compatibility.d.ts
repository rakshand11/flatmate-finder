export interface ProfileForCompatibility {
    age?: number | null;
    city?: string | null;
    locality?: string | null;
    budget_min: number;
    budget_max: number;
    occupation?: string | null;
    lifestyle_tags?: string[] | null;
}
export interface CompatibilityResult {
    score: number;
    mutual_lifestyle_tags: string[];
    conflicting_tags: string[];
}
export declare function computeCompatibility(viewer: ProfileForCompatibility, candidate: ProfileForCompatibility): CompatibilityResult;
//# sourceMappingURL=compatibility.d.ts.map