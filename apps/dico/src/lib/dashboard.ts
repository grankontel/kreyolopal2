import { Permission } from '@kreyolopal/domain'

export interface DashboardMenuItem {
  icon?: string
  label: string
  path?: string
  items?: Array<DashboardMenuItem>
  permission?: Permission
}
