const CONFLICTING_PAIRS: [string, string][] = [
    ["smoker", "non-smoker"],
    ["pet-friendly", "no-pets"],
    ["vegetarian", "non-vegetarian"],
    ["early riser", "night owl"],
    ["introverted", "extroverted"],
];

const WEIGHTS = {
    budget: 30,
    location: 25,
    lifestyle: 35,
    occupation: 5,
    age: 5,
} as const;

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

function normalizeStr(value: string | null | undefined): string {
    return (value ?? "").trim().toLowerCase();
}

function normalizeTags(tags: string[] | null | undefined): string[] {
    return (tags ?? []).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
}

function budgetOverlapScore(
    viewerMin: number,
    viewerMax: number,
    candidateMin: number,
    candidateMax: number,
    maxPoints: number
): number {
    const overlap = Math.max(0, Math.min(viewerMax, candidateMax) - Math.max(viewerMin, candidateMin));

    if (overlap > 0) {
        const viewerRange = Math.max(viewerMax - viewerMin, 1);
        const candidateRange = Math.max(candidateMax - candidateMin, 1);
        const smallerRange = Math.min(viewerRange, candidateRange);
        const ratio = Math.min(1, overlap / smallerRange);
        return Math.round(ratio * maxPoints);
    }

    const gap = Math.max(viewerMin, candidateMin) - Math.min(viewerMax, candidateMax);
    if (gap <= 0) return maxPoints;

    const avgRange = (Math.max(viewerMax - viewerMin, 0) + Math.max(candidateMax - candidateMin, 0)) / 2;
    if (avgRange <= 0) return 0;

    const proximity = Math.max(0, 1 - gap / avgRange);
    return Math.round(proximity * maxPoints * 0.35);
}

function locationScore(
    viewer: ProfileForCompatibility,
    candidate: ProfileForCompatibility,
    maxPoints: number
): number {
    const viewerCity = normalizeStr(viewer.city);
    const candidateCity = normalizeStr(candidate.city);

    if (!viewerCity || !candidateCity || viewerCity !== candidateCity) {
        return 0;
    }

    let score = Math.round(maxPoints * 0.6);

    const viewerLocality = normalizeStr(viewer.locality);
    const candidateLocality = normalizeStr(candidate.locality);

    if (viewerLocality && candidateLocality && viewerLocality === candidateLocality) {
        score = maxPoints;
    }

    return score;
}

function getConflictingTags(viewerTags: string[], candidateTags: string[]): string[] {
    const conflicts: string[] = [];

    for (const [left, right] of CONFLICTING_PAIRS) {
        const viewerHasLeft = viewerTags.includes(left);
        const viewerHasRight = viewerTags.includes(right);
        const candidateHasLeft = candidateTags.includes(left);
        const candidateHasRight = candidateTags.includes(right);

        if ((viewerHasLeft && candidateHasRight) || (viewerHasRight && candidateHasLeft)) {
            conflicts.push(`${left} / ${right}`);
        }
    }

    return conflicts;
}

function lifestyleScore(
    viewer: ProfileForCompatibility,
    candidate: ProfileForCompatibility,
    maxPoints: number
): Pick<CompatibilityResult, "mutual_lifestyle_tags" | "conflicting_tags"> & { score: number } {
    const viewerTags = normalizeTags(viewer.lifestyle_tags);
    const candidateTags = normalizeTags(candidate.lifestyle_tags);
    const viewerTagSet = new Set(viewerTags);

    const mutualNormalized = candidateTags.filter((tag) => viewerTagSet.has(tag));
    const mutual_lifestyle_tags = (candidate.lifestyle_tags ?? []).filter((tag) =>
        viewerTagSet.has(tag.trim().toLowerCase())
    );

    const conflicting_tags = getConflictingTags(viewerTags, candidateTags);
    const tagDenominator = Math.max(viewerTags.length, candidateTags.length, 1);
    let score = (mutualNormalized.length / tagDenominator) * maxPoints;
    score -= conflicting_tags.length * 12;

    return {
        score: Math.max(0, Math.round(score)),
        mutual_lifestyle_tags,
        conflicting_tags,
    };
}

function ageProximityScore(
    viewerAge: number | null | undefined,
    candidateAge: number | null | undefined,
    maxPoints: number
): number {
    if (!viewerAge || !candidateAge) return 0;

    const diff = Math.abs(viewerAge - candidateAge);
    if (diff <= 3) return maxPoints;
    if (diff <= 5) return 3;
    if (diff <= 10) return 1;
    return 0;
}

function occupationScore(
    viewerOccupation: string | null | undefined,
    candidateOccupation: string | null | undefined,
    maxPoints: number
): number {
    const viewer = normalizeStr(viewerOccupation);
    const candidate = normalizeStr(candidateOccupation);

    if (!viewer || !candidate) return 0;
    return viewer === candidate ? maxPoints : 0;
}

export function computeCompatibility(
    viewer: ProfileForCompatibility,
    candidate: ProfileForCompatibility
): CompatibilityResult {
    const lifestyle = lifestyleScore(viewer, candidate, WEIGHTS.lifestyle);

    const rawScore =
        budgetOverlapScore(
            viewer.budget_min,
            viewer.budget_max,
            candidate.budget_min,
            candidate.budget_max,
            WEIGHTS.budget
        ) +
        locationScore(viewer, candidate, WEIGHTS.location) +
        lifestyle.score +
        occupationScore(viewer.occupation, candidate.occupation, WEIGHTS.occupation) +
        ageProximityScore(viewer.age, candidate.age, WEIGHTS.age);

    return {
        score: Math.min(100, Math.max(0, rawScore)),
        mutual_lifestyle_tags: lifestyle.mutual_lifestyle_tags,
        conflicting_tags: lifestyle.conflicting_tags,
    };
}
