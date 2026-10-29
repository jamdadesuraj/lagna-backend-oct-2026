'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner } from 'react-bootstrap'
import {
  useClearAllNotificationsMutation,
  useGetAdminNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  type AdminNotification,
  type AdminNotificationType,
} from '../../../../../store/adminNotificationApi'

// ==================================================
// HELPERS
// ==================================================
const TYPE_COLOR: Record<AdminNotificationType, string> = {
  PROFILE_VERIFICATION: 'info',
  PAYMENT_RECEIVED: 'success',
  REPORT_PROFILE: 'danger',
}

// Where each notification takes the admin when clicked
const getNotificationRoute = (notification: AdminNotification): string => {
  switch (notification.type) {
    case 'PROFILE_VERIFICATION':
      return '/profile-verification'

    case 'REPORT_PROFILE':
      return '/report-profile'

    case 'PAYMENT_RECEIVED': {
      const paymentType = notification.meta?.paymentType

      if (paymentType === 'BIODATA') return '/payment/biodata-payments'
      if (paymentType === 'SPOTLIGHT') return '/payment/spotlight-payments'

      return '/payment/subscribed-members'
    }

    default:
      return '/'
  }
}

const timeAgo = (value: string): string => {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000))

  if (seconds < 60) return 'Just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// ==================================================
// SINGLE ITEM
// ==================================================
const NotificationItem = ({ notification, onClick }: { notification: AdminNotification; onClick: (notification: AdminNotification) => void }) => {
  const color = TYPE_COLOR[notification.type] ?? 'info'

  return (
    <DropdownItem
      className={`py-3 border-bottom text-wrap ${notification.isRead ? '' : 'bg-light'}`}
      onClick={(e) => {
        e.preventDefault()
        onClick(notification)
      }}>
      <div className="d-flex">
        <div className="flex-shrink-0">
          <div className="avatar-sm me-2">
            <span className={`avatar-title bg-soft-${color} text-${color} fs-20 rounded-circle`}>{notification.title.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-grow-1">
          <p className="mb-0 fw-semibold">
            {notification.title}
            {!notification.isRead && <span className="badge bg-danger rounded-pill ms-2 p-1" style={{ width: 8, height: 8 }} />}
          </p>
          <p className="mb-0 text-wrap">{notification.message}</p>
          <small className="text-muted">{timeAgo(notification.createdAt)}</small>
        </div>
      </div>
    </DropdownItem>
  )
}

// ==================================================
// BELL DROPDOWN
// ==================================================
const Notifications = () => {
  const router = useRouter()

  // Poll every 30s (pauses automatically while the tab is not focused)
  const { data, isLoading, isError } = useGetAdminNotificationsQuery({ limit: 10 }, { pollingInterval: 30000, skipPollingIfUnfocused: true })

  const [markNotificationRead] = useMarkNotificationReadMutation()
  const [markAllNotificationsRead, { isLoading: isMarkingAll }] = useMarkAllNotificationsReadMutation()
  const [clearAllNotifications, { isLoading: isClearing }] = useClearAllNotificationsMutation()

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  const handleItemClick = async (notification: AdminNotification) => {
    if (!notification.isRead) {
      try {
        await markNotificationRead(notification._id).unwrap()
      } catch {
        // navigation should still work even if marking as read fails
      }
    }

    router.push(getNotificationRoute(notification))
  }

  return (
    <Dropdown className="topbar-item ">
      <DropdownToggle
        as={'a'}
        type="button"
        className="topbar-button position-relative content-none"
        id="page-header-notifications-dropdown"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        <IconifyIcon icon="solar:bell-bing-bold-duotone" className="fs-24 align-middle " />
        {unreadCount > 0 && (
          <span className="position-absolute topbar-badge fs-10 translate-middle badge bg-danger rounded-pill">
            {unreadCount > 99 ? '99+' : unreadCount}
            <span className="visually-hidden">unread notifications</span>
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu className="py-0 dropdown-lg dropdown-menu-end" aria-labelledby="page-header-notifications-dropdown">
        <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
          <Row className="align-items-center">
            <div className="col">
              <h6 className="m-0 fs-16 fw-semibold"> Notifications</h6>
            </div>
            <div className="col-auto">
              <a
                href="#"
                className="text-dark text-decoration-underline"
                aria-disabled={isClearing || notifications.length === 0}
                onClick={(e) => {
                  e.preventDefault()
                  if (isClearing || notifications.length === 0) return
                  clearAllNotifications()
                }}>
                <small>Clear All</small>
              </a>
            </div>
          </Row>
        </div>
        <SimplebarReactClient style={{ maxHeight: 280 }}>
          {isLoading && (
            <div className="text-center py-4">
              <Spinner animation="border" size="sm" />
            </div>
          )}

          {!isLoading && isError && <div className="text-center text-danger py-4">Failed to load notifications.</div>}

          {!isLoading && !isError && notifications.length === 0 && <div className="text-center text-muted py-4">No notifications yet.</div>}

          {!isLoading &&
            !isError &&
            notifications.map((notification) => <NotificationItem key={notification._id} notification={notification} onClick={handleItemClick} />)}
        </SimplebarReactClient>
        <div className="text-center py-3">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            disabled={unreadCount === 0 || isMarkingAll}
            onClick={() => markAllNotificationsRead()}>
            Mark All As Read <i className="bx bx-check-double ms-1" />
          </button>
        </div>
      </DropdownMenu>
    </Dropdown>
  )
}

export default Notifications
