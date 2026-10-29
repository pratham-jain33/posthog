import type { TopicCoverageApi } from '../generated/api.schemas'

// The order and colors pass the color-blind checks as a set, so change them together.
export const TOPIC_COVERAGE_PARTS: { key: keyof TopicCoverageApi; label: string; colorVar: string }[] = [
    { key: 'canonical', label: 'Ran a metric', colorVar: 'data-color-1' },
    { key: 'adapted', label: 'Adapted', colorVar: 'data-color-4' },
    { key: 'silent', label: 'Re-derived', colorVar: 'data-color-7' },
    { key: 'raw_sql_only', label: 'Other SQL', colorVar: 'data-color-14' },
    { key: 'no_sql', label: 'Query tool', colorVar: 'data-color-12' },
]
