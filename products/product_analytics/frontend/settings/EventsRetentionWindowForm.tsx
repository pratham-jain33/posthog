import { useEffect, useState } from 'react'

import { LemonButton, LemonDialog, LemonSelect, Link } from '@posthog/lemon-ui'

import { urls } from 'scenes/urls'

import { LONGEST_PLAN_RETENTION_MONTHS } from 'products/product_analytics/frontend/insights/dataRetention/dataRetentionBannerLogic'

const RETENTION_DAYS_LABELS: Record<number, string> = { 1: '30 days', 3: '90 days' }

export function formatRetentionMonths(months: number): string {
    if (RETENTION_DAYS_LABELS[months]) {
        return RETENTION_DAYS_LABELS[months]
    }
    if (months % 12 === 0) {
        const years = months / 12
        return years === 1 ? '1 year' : `${years} years`
    }
    return `${months} months`
}

export interface EventsRetentionWindowFormProps {
    retentionMonths: number | null
    choiceMonths: readonly number[]
    maxMonths: number
    planMonths: number
    /** Who keeps events for the chosen window, as the start of a sentence, e.g. "This project". */
    keptBy: string
    /** What happens when the window is removed. */
    removedDescription: string
    saving: boolean
    restrictionReason: string | null
    onSave: (retentionMonths: number | null) => void
    dataAttr: string
}

export function EventsRetentionWindowForm({
    retentionMonths,
    choiceMonths,
    maxMonths,
    planMonths,
    keptBy,
    removedDescription,
    saving,
    restrictionReason,
    onSave,
    dataAttr,
}: EventsRetentionWindowFormProps): JSX.Element {
    const [draftMonths, setDraftMonths] = useState<number | null>(retentionMonths)

    useEffect(() => {
        setDraftMonths(retentionMonths)
    }, [retentionMonths])

    // Staff can set a window outside the choices, so show it to keep the current value visible.
    const optionMonths =
        retentionMonths === null || choiceMonths.includes(retentionMonths)
            ? choiceMonths
            : [...choiceMonths, retentionMonths].sort((a, b) => a - b)

    const saveDisabledReason =
        restrictionReason ??
        (draftMonths === null ? 'Choose a retention period' : null) ??
        (draftMonths === retentionMonths ? 'No changes to save' : null)

    const confirmSave = (): void => {
        if (draftMonths === null) {
            return
        }
        const label = formatRetentionMonths(draftMonths)
        LemonDialog.open({
            title: `Keep events for ${label}?`,
            description: `${keptBy} will keep events for ${label}. Deletion of older events is not instant. It happens once a month.`,
            primaryButton: {
                children: 'Save',
                onClick: () => onSave(draftMonths),
                'data-attr': `${dataAttr}-confirm`,
            },
            secondaryButton: { children: 'Cancel' },
        })
    }

    const confirmRemove = (): void => {
        LemonDialog.open({
            title: 'Remove this retention period?',
            description: removedDescription,
            primaryButton: {
                children: 'Remove',
                onClick: () => onSave(null),
                'data-attr': `${dataAttr}-remove-confirm`,
            },
            secondaryButton: { children: 'Cancel' },
        })
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <LemonSelect<number>
                    value={draftMonths ?? undefined}
                    onChange={setDraftMonths}
                    options={optionMonths.map((months) => ({ value: months, label: formatRetentionMonths(months) }))}
                    placeholder="Not set"
                    disabledReason={restrictionReason ?? (saving ? 'Saving...' : null)}
                    className="w-40"
                    data-attr={`${dataAttr}-select`}
                />
                <LemonButton
                    type="primary"
                    onClick={confirmSave}
                    loading={saving}
                    disabledReason={saveDisabledReason}
                    data-attr={`${dataAttr}-save`}
                >
                    Save
                </LemonButton>
                {retentionMonths !== null && (
                    <LemonButton
                        type="secondary"
                        onClick={confirmRemove}
                        disabledReason={restrictionReason ?? (saving ? 'Saving...' : null)}
                        data-attr={`${dataAttr}-remove`}
                    >
                        Remove
                    </LemonButton>
                )}
            </div>
            <p className="mt-2 mb-0 text-sm text-secondary">
                Deletion of older events is not instant. It happens once a month.
                {maxMonths === planMonths && planMonths < LONGEST_PLAN_RETENTION_MONTHS && (
                    <>
                        {' '}
                        Need a longer period? <Link to={urls.organizationBilling()}>Upgrade your plan</Link>.
                    </>
                )}
            </p>
        </div>
    )
}
