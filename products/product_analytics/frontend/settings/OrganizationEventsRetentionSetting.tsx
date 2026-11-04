import { useActions, useValues } from 'kea'

import { Link } from '@posthog/lemon-ui'

import { useRestrictedArea } from 'lib/components/RestrictedArea'
import { OrganizationMembershipLevel } from 'lib/constants'

import { eventsRetentionSettingsLogic } from './eventsRetentionSettingsLogic'
import { EventsRetentionWindowForm, formatRetentionMonths } from './EventsRetentionWindowForm'

export function OrganizationEventsRetentionSetting(): JSX.Element | null {
    const { projectRetention, organizationRetention, organizationRetentionLoading } =
        useValues(eventsRetentionSettingsLogic)
    const { updateOrganizationRetention } = useActions(eventsRetentionSettingsLogic)
    const restrictionReason = useRestrictedArea({ minimumAccessLevel: OrganizationMembershipLevel.Admin })

    if (!projectRetention || !organizationRetention) {
        return null
    }

    const planMonths = organizationRetention.plan_retention_months
    const planLabel = formatRetentionMonths(planMonths)

    return (
        <div>
            <p className="max-w-160 text-sm text-secondary mb-4">
                Choose how long projects in this organization keep events. A project can set its own retention period
                instead.{' '}
                {organizationRetention.organization_retention_months === null &&
                    `No retention period is set, so projects keep events for your plan's retention period of ${planLabel}. `}
                <Link to={projectRetention.docs_url} target="_blank">
                    Learn more
                </Link>
            </p>
            <EventsRetentionWindowForm
                retentionMonths={organizationRetention.organization_retention_months}
                choiceMonths={organizationRetention.retention_months_choices}
                maxMonths={organizationRetention.max_retention_months}
                planMonths={planMonths}
                keptBy="Every project without its own retention period"
                removedDescription={`Projects without their own retention period will keep events for your plan's retention period of ${planLabel}.`}
                saving={organizationRetentionLoading}
                restrictionReason={restrictionReason}
                onSave={updateOrganizationRetention}
                dataAttr="organization-events-retention"
            />
        </div>
    )
}
