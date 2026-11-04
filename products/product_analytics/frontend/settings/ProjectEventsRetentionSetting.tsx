import { useActions, useValues } from 'kea'

import { Link } from '@posthog/lemon-ui'

import { useRestrictedArea } from 'lib/components/RestrictedArea'
import { OrganizationMembershipLevel } from 'lib/constants'
import { urls } from 'scenes/urls'

import { eventsRetentionSettingsLogic } from './eventsRetentionSettingsLogic'
import { EventsRetentionWindowForm, formatRetentionMonths } from './EventsRetentionWindowForm'

export function ProjectEventsRetentionSetting(): JSX.Element | null {
    const { projectRetention, projectRetentionLoading } = useValues(eventsRetentionSettingsLogic)
    const { updateProjectRetention } = useActions(eventsRetentionSettingsLogic)
    const restrictionReason = useRestrictedArea({ minimumAccessLevel: OrganizationMembershipLevel.Admin })

    if (!projectRetention) {
        return null
    }

    const organizationMonths = projectRetention.organization_retention_months
    const planMonths = projectRetention.plan_retention_months
    const fallback =
        organizationMonths !== null
            ? `the organization's retention period of ${formatRetentionMonths(organizationMonths)}`
            : `your plan's retention period of ${formatRetentionMonths(planMonths)}`

    return (
        <div>
            <p className="max-w-160 text-sm text-secondary mb-4">
                Choose how long this project keeps events. This replaces the retention period set in{' '}
                <Link to={urls.settings('organization-details', 'organization-events-retention')}>
                    organization settings
                </Link>
                . {projectRetention.project_retention_months === null && `This project uses ${fallback}. `}
                <Link to={projectRetention.docs_url} target="_blank">
                    Learn more
                </Link>
            </p>
            <EventsRetentionWindowForm
                retentionMonths={projectRetention.project_retention_months}
                choiceMonths={projectRetention.retention_months_choices}
                maxMonths={projectRetention.max_retention_months}
                planMonths={planMonths}
                keptBy="This project"
                removedDescription={`This project will use ${fallback}.`}
                saving={projectRetentionLoading}
                restrictionReason={restrictionReason}
                onSave={updateProjectRetention}
                dataAttr="project-events-retention"
            />
        </div>
    )
}
