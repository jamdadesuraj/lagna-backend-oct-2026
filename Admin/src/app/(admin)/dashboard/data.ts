import { currency } from '@/context/constants'
import { PageType, StatType } from './types'
import type { DashboardStats } from '../../../../store/dashboardApi'

// Static defaults. Also the source of icons, colors and order for every card,
// and the fallback value for cards that have no backend data (Kundali Revenue).
export const stateData: StatType[] = [
  {
    icon: 'solar:users-group-rounded-bold-duotone',
    name: 'Total Users',
    amount: '13,647',
    bg: '#e4f0ed',
    change: '2.3',
  },
  {
    icon: 'solar:wallet-money-bold-duotone',
    name: 'Total Revenue',
    amount: `₹ 123.6k`,
    bg: '#ECFDF3',
    change: '10.6',
  },
  {
    icon: 'solar:wad-of-money-bold-duotone',
    name: "Today's Revenue",
    amount: `₹ 18.5k`,
    bg: '#FFF8E6',
    change: '6.4',
  },
  {
    icon: 'solar:document-text-bold-duotone',
    name: 'Bio Data Revenue',
    amount: `₹ 42.8k`,
    bg: '#EAFBFF',
    change: '4.8',
  },
  {
    icon: 'solar:star-bold-duotone',
    name: 'Spotlight Revenue',
    amount: `₹ 26.4k`,
    bg: '#FFF0F3',
    change: '7.2',
  },
  {
    icon: 'solar:crown-bold-duotone',
    name: 'Kundali Revenue',
    amount: `₹ 26.4k`,
    bg: '#F2F0F3',
    change: '7.2',
  },
  {
    icon: 'solar:verified-check-bold-duotone',
    name: 'Verified Users',
    amount: '8,924',
    bg: '#F0FDF4',
    change: '5.1',
  },
  {
    icon: 'solar:crown-star-bold-duotone',
    name: 'Subscribed Users',
    amount: '4,286',
    bg: '#FFF9E8',
    change: '8.7',
  },
  {
    icon: 'solar:user-block-bold-duotone',
    name: 'Blocked Users',
    amount: '126',
    bg: '#FFF1F2',
    change: '1.2',
  },
]

// ==================================================
// DYNAMIC DASHBOARD CARDS
// ==================================================
const formatCount = (value: number) => value.toLocaleString('en-IN')

const formatMoney = (value: number) => `₹ ${value.toLocaleString('en-IN')}`

/**
 * Returns the same cards as `stateData` (same icons, colors and order) with the
 * amounts replaced by live values. Cards with no backend data (Kundali Revenue)
 * keep their static value.
 *
 * `placeholder` is shown while the stats are loading or if the request fails.
 */
export const buildStateData = (stats: DashboardStats | undefined, placeholder: string): StatType[] => {
  const count = (value?: number) => (stats && typeof value === 'number' ? formatCount(value) : placeholder)
  const money = (value?: number) => (stats && typeof value === 'number' ? formatMoney(value) : placeholder)

  const liveAmounts: Record<string, string> = {
    'Total Users': count(stats?.totalUsers),
    'Total Revenue': money(stats?.totalRevenue),
    "Today's Revenue": money(stats?.todayRevenue),
    'Bio Data Revenue': money(stats?.biodataRevenue),
    'Spotlight Revenue': money(stats?.spotlightRevenue),
    'Verified Users': count(stats?.verifiedUsers),
    'Subscribed Users': count(stats?.subscribedUsers),
    'Blocked Users': count(stats?.blockedUsers),
  }

  return stateData.map((item) => ({
    ...item,
    amount: item.name in liveAmounts ? liveAmounts[item.name] : item.amount,
  }))
}

export const pagesList: PageType[] = [
  {
    path: 'larkon/ecommerce.html',
    views: 465,
    rate: '4.4',
    variant: 'success',
  },
  {
    path: 'larkon/dashboard.html',
    views: 426,
    rate: '20.4',
    variant: 'danger',
  },
  {
    path: 'larkon/chat.html',
    views: 254,
    rate: '12.25',
    variant: 'warning',
  },
  {
    path: 'larkon/auth-login.html',
    views: 3369,
    rate: '5.2',
    variant: 'success',
  },
  {
    path: 'larkon/email.html',
    views: 985,
    rate: '64.2',
    variant: 'danger',
  },
  {
    path: 'larkon/social.html',
    views: 653,
    rate: '2.4',
    variant: 'success',
  },
  {
    path: 'larkon/blog.html',
    views: 478,
    rate: '1.4',
    variant: 'danger',
  },
]
