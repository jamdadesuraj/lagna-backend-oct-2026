'use client'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import Image from 'next/image'
import React, { useState } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Modal, Button, Spinner, Form } from 'react-bootstrap'
import { useGetBlogsQuery, useCreateBlogMutation, useUpdateBlogMutation, useDeleteBlogMutation } from '../../../../../store/blogApi'

const AddBlogModal = ({ onClose }: { onClose: () => void }) => {
  const [createBlog, { isLoading }] = useCreateBlogMutation()

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [desc, setDesc] = useState('')
  const [isActive, setIsActive] = useState(true)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async () => {
    if (!image) {
      alert('Image is required')
      return
    }
    if (!title.trim() || !subtitle.trim() || !desc.trim()) {
      alert('Title, sub-title and description are required')
      return
    }
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('title', title)
      formData.append('subtitle', subtitle)
      formData.append('desc', desc)
      formData.append('isActive', String(isActive))

      await createBlog(formData).unwrap()
      onClose()
    } catch {
      alert('Failed to create. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} />}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter blog title" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sub-Title</Form.Label>
          <Form.Control type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Enter blog sub-title" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Enter blog description" />
        </Form.Group>

        <Form.Group>
          <Form.Check type="switch" id="blog-active-add" label="Active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ==================================================
// EDIT BLOG MODAL
// ==================================================
const EditBlogModal = ({ blog, onClose }: { blog: any; onClose: () => void }) => {
  const [updateBlog, { isLoading }] = useUpdateBlogMutation()

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(blog.image)
  const [title, setTitle] = useState(blog.title)
  const [subtitle, setSubtitle] = useState(blog.subtitle)
  const [desc, setDesc] = useState(blog.desc)
  const [isActive, setIsActive] = useState(blog.isActive)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImage(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !subtitle.trim() || !desc.trim()) {
      alert('Title, sub-title and description are required')
      return
    }
    try {
      const formData = new FormData()
      // only send a new image if the user picked one; otherwise the existing one is kept
      if (image) formData.append('image', image)
      formData.append('title', title)
      formData.append('subtitle', subtitle)
      formData.append('desc', desc)
      formData.append('isActive', String(isActive))

      await updateBlog({ id: blog._id, formData }).unwrap()
      onClose()
    } catch {
      alert('Failed to update. Please try again.')
    }
  }

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="img-fluid rounded mt-2" style={{ maxHeight: 150 }} />}
          <Form.Text muted>Leave empty to keep the current image.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sub-Title</Form.Label>
          <Form.Control type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
        </Form.Group>

        <Form.Group>
          <Form.Check type="switch" id="blog-active-edit" label="Active" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// ==================================================
// BLOG LIST (main component)
// ==================================================
const Blog = () => {
  const { data: blogRes, isLoading, isError } = useGetBlogsQuery()
  const [deleteBlog] = useDeleteBlogMutation()

  const [isAdding, setIsAdding] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const blogs = blogRes?.data ?? []

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`.toUpperCase()
  }

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? blogs.map((b) => b._id) : [])
  }

  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    try {
      setDeletingId(id)
      await deleteBlog(id).unwrap()
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id))
    } catch {
      alert('Failed to delete. Please try again.')
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
            Blogs List
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
                    <input
                      type="checkbox"
                      className="form-check-input"
                      aria-label="Select all members"
                      checked={blogs.length > 0 && selectedIds.length === blogs.length}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                    />
                  </th>

                  <th className="text-nowrap">SR.No</th>
                  <th className="text-nowrap">Image</th>
                  <th className="text-nowrap">Title</th>
                  <th className="text-nowrap">Sub-Title</th>
                  <th className="text-nowrap">Desc</th>
                  <th className="text-nowrap"> Status</th>
                  <th className="text-nowrap">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </td>
                  </tr>
                )}

                {isError && (
                  <tr>
                    <td colSpan={8} className="text-center text-danger py-3">
                      Failed to load blogs.
                    </td>
                  </tr>
                )}

                {!isLoading && !isError && blogs.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-3">
                      No blogs found.
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isError &&
                  blogs.map((blog, index) => (
                    <tr key={blog._id}>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedIds.includes(blog._id)}
                          onChange={(e) => toggleSelectOne(blog._id, e.target.checked)}
                        />
                      </td>

                      <td className="text-nowrap">{index + 1}</td>

                      <td className="text-nowrap">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          width={40}
                          height={40}
                          unoptimized
                          className="rounded-circle"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>{blog.title}</td>
                      <td>{blog.subtitle}</td>
                      <td className="text-truncate" style={{ maxWidth: 260 }} title={blog.desc}>
                        {blog.desc}
                      </td>

                      <td className="text-nowrap">
                        <span className={`badge ${blog.isActive ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}`}>
                          {blog.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td>
                        <div className="d-flex gap-2">
                          {/* Edit */}
                          <button type="button" className="btn btn-soft-primary btn-sm" title="Edit" onClick={() => setEditingBlog(blog)}>
                            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            className="btn btn-soft-danger btn-sm"
                            title="Delete"
                            disabled={deletingId === blog._id}
                            onClick={() => handleDelete(blog._id)}>
                            {deletingId === blog._id ? (
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

      {isAdding && <AddBlogModal onClose={() => setIsAdding(false)} />}
      {editingBlog && <EditBlogModal blog={editingBlog} onClose={() => setEditingBlog(null)} />}
    </>
  )
}

export default Blog
