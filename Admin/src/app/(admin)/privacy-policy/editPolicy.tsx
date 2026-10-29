'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardHeader, CardTitle, CardBody, CardFooter, Button, Spinner, Form } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetPrivacyPolicyQuery, useCreateOrUpdatePrivacyPolicyMutation } from '../../../../store/privacy-policyApi'

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import('react-quill')
    return RQ
  },
  { ssr: false },
) as typeof import('react-quill')
import 'react-quill/dist/quill.snow.css'

const DEFAULT_TITLE = 'Privacy Policy'

const quillModules = {
  toolbar: [
    [{ header: [false, 1, 2, 3] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link'],
    ['clean'],
  ],
}

const PrivacyPolicyEditor = () => {
  const { data, isLoading, isError } = useGetPrivacyPolicyQuery()
  const [savePolicy, { isLoading: isSaving }] = useCreateOrUpdatePrivacyPolicyMutation()

  const [title, setTitle] = useState(DEFAULT_TITLE)
  const [content, setContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  // populate the editor whenever fresh data arrives
  useEffect(() => {
    if (data?.data?.content) {
      setContent(data.data.content)
    }
    if (data?.data?.title) {
      setTitle(data.data.title)
    }
  }, [data])

  const isEmpty = (html: string) => !html || html.replace(/<(.|\n)*?>/g, '').trim().length === 0

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Title is required')
      return
    }
    if (isEmpty(content)) {
      alert('Privacy policy content is required')
      return
    }
    try {
      await savePolicy({ title: title.trim(), content }).unwrap()
      setIsEditing(false)
    } catch {
      alert('Failed to save. Please try again.')
    }
  }

  const handleCancel = () => {
    // revert any unsaved edits back to the last fetched value
    setContent(data?.data?.content ?? '')
    setTitle(data?.data?.title ?? DEFAULT_TITLE)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center gap-1">
        <CardTitle as={'h4'} className="flex-grow-1">
          Privacy Policy
        </CardTitle>
        {!isEditing && !isLoading && (
          <button className="btn btn-sm btn-primary" onClick={() => setIsEditing(true)}>
            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18 me-1" />
            Edit
          </button>
        )}
      </CardHeader>

      <CardBody>
        {isLoading && (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
          </div>
        )}

        {isError && <p className="text-danger mb-0">Failed to load privacy policy.</p>}

        {!isLoading && !isError && !isEditing && (
          <>
            {isEmpty(content) ? (
              <p className="mb-0 text-muted">No privacy policy content has been set yet.</p>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </>
        )}

        {!isLoading && !isError && isEditing && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
            </Form.Group>

            <div style={{ height: 320, marginBottom: 42 }}>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={quillModules}
                style={{ height: '100%' }}
                placeholder="Enter privacy policy content..."
              />
            </div>
          </>
        )}
      </CardBody>

      {isEditing && (
        <CardFooter className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner animation="border" size="sm" /> : 'Save'}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default PrivacyPolicyEditor
