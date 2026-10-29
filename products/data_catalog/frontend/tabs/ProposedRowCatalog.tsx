import { LemonTag } from '@posthog/lemon-ui'

import { Link } from 'lib/lemon-ui/Link'
import { urls } from 'scenes/urls'

import type { DataCatalogMetricApi } from '../generated/api.schemas'
import type { ProposedRow } from '../proposedRows'

export function ProposedRowCatalog({
    row,
    metric,
}: {
    row: ProposedRow
    metric: DataCatalogMetricApi | undefined
}): JSX.Element {
    if (row.outcome !== 'slice') {
        return <LemonTag type="warning">Not covered</LemonTag>
    }
    if (!metric) {
        return <span className="text-xs">Derived from a catalog metric</span>
    }
    return (
        <span className="text-xs">
            Derived from{' '}
            <Link to={urls.dataCatalogMetric(metric.name)} data-attr="data-catalog-usage-derived-from-link">
                {metric.display_name || metric.name}
            </Link>
        </span>
    )
}
