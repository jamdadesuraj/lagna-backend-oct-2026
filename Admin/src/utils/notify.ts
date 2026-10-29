import Swal from 'sweetalert2'

type ConfirmVariant = 'danger' | 'primary'

interface ConfirmOptions {
  title?: string
  text: string
  confirmText?: string
  cancelText?: string
  icon?: 'warning' | 'question' | 'info' | 'error' | 'success'
  variant?: ConfirmVariant
}

/**
 * Generic confirmation dialog. Resolves to true when the admin confirms.
 * Replaces the browser's native confirm().
 */
export const confirmAction = async ({
  title = 'Are you sure?',
  text,
  confirmText = 'Yes',
  cancelText = 'Cancel',
  icon = 'question',
  variant = 'primary',
}: ConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    focusCancel: variant === 'danger',
    buttonsStyling: false,
    customClass: {
      confirmButton: `btn btn-${variant} w-xs mt-2 ms-2`,
      cancelButton: 'btn btn-light w-xs mt-2',
    },
  })

  return result.isConfirmed
}

/**
 * Delete confirmation. Usage:
 *   if (!(await confirmDelete('Are you sure you want to delete this height?'))) return
 */
export const confirmDelete = (text: string, options: Partial<ConfirmOptions> = {}): Promise<boolean> =>
  confirmAction({
    title: 'Are you sure?',
    text,
    icon: 'warning',
    confirmText: 'Yes, delete it',
    variant: 'danger',
    ...options,
  })

/**
 * Pulls the best message out of an RTK Query / fetch error so toasts can show
 * the backend's message instead of a generic one.
 */
export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.'): string => {
  const err = error as
    | {
        data?: { message?: string; errors?: { message?: string }[] }
        message?: string
      }
    | undefined

  return err?.data?.errors?.[0]?.message || err?.data?.message || err?.message || fallback
}
