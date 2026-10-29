'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Spinner } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { useGetOnboardingQuery, useDeleteOnboardingItemMutation, type OnboardingItem } from '../../../../../store/onboardingApi'
import AddOnboardingModal from './AddOnboarding'
import EditOnboardingModal from './EditOnboarding'

const Onboarding = () => {
  const { data, isLoading, isError } = useGetOnboardingQuery()
  const [deleteOnboardingItem] = useDeleteOnboardingItemMutation()

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState<OnboardingItem | null>(null)

  const items = data?.data ?? []

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this onboarding screen?')) return
    try {
      setDeletingId(id)
      await deleteOnboardingItem(id).unwrap()
      toast.success('Onboarding item deleted successfully')
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete onboarding item. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Card className="border-0 shadow-sm">
        {/* ================= HEADER ================= */}
        <CardHeader className="bg-white d-flex flex-wrap justify-content-between align-items-center gap-3">
          <CardTitle as="h4" className="mb-0">
            Onboarding Screen
          </CardTitle>

          {/* Add */}
          <button type="button" className="btn btn-sm btn-primary text-nowrap" onClick={() => setIsAdding(true)}>
            <IconifyIcon icon="solar:add-circle-broken" className="me-1 fs-16" />
            Add
          </button>
        </CardHeader>

        {/* ================= TABLE ================= */}
        <CardBody className="">
          <div className="table-responsive">
            <table
              className="table align-middle mb-0 table-hover table-centered table-bordered"
              style={{
                minWidth: '1150px',
              }}>
              <thead className="bg-light-subtle">
                <tr>
                  <th className="text-center text-nowrap" style={{ width: '45px' }}>
                    <input type="checkbox" className="form-check-input" aria-label="Select all members" />
                  </th>

                  <th className="text-nowrap">SR.No</th>
                  <th className="text-nowrap">Image</th>
                  <th className="text-nowrap"> Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={5} className="text-center text-danger py-3">
                      Failed to load onboarding screens.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-3">
                      No onboarding screens found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  items.map((item, index) => (
                    <tr key={item._id}>
                      <td className="text-center">
                        <input type="checkbox" className="form-check-input" />
                      </td>

                      <td className="text-nowrap">{index + 1}</td>

                      <td className="text-nowrap">
                        {item.image ? (
                          <Image src={item.image} alt={item.title} width={40} height={40} className="rounded-circle" style={{ objectFit: 'cover' }} />
                        ) : (
                          '-'
                        )}
                      </td>

                      <td className="text-nowrap">
                        <span
                          className={`badge ${item.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">
                          {/* Edit */}
                          <button type="button" className="btn btn-soft-primary btn-sm" title="Edit" onClick={() => setEditingItem(item)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            title="Delete"
                            disabled={deletingId === item._id}
                            onClick={() => handleDelete(item._id)}>
                            {deletingId === item._id ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {isAdding && <AddOnboardingModal onClose={() => setIsAdding(false)} />}
      {editingItem && <EditOnboardingModal item={editingItem} onClose={() => setEditingItem(null)} />}
    </>
  )
}

export default Onboarding
