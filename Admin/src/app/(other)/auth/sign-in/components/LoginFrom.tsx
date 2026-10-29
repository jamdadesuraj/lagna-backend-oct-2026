'use client'
import TextFormInput from '@/components/form/TextFormInput'
import Link from 'next/link'
import { Button, FormCheck } from 'react-bootstrap'
import useSignIn from './useSignIn'
import PasswordFormInput from '@/components/form/PasswordFormInput'
import { useLoginMutation } from '../../../../../../store/authApi'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
interface SignInFormData {
  email: string
  password: string
}

const LoginFrom = () => {
  const { control, handleSubmit } = useForm<SignInFormData>({
    defaultValues: { email: '', password: '' },
  })
  const [loginMutation, { isLoading, error }] = useLoginMutation()
  const router = useRouter()
  const login = handleSubmit(async (data: SignInFormData) => {
    try {
      await loginMutation(data).unwrap()
      toast.success('login successful')
      router.push('/dashboard')
    } catch (err) {
      toast.error('invalid email or password')
    }
  })
  return (
    <form className="authentication-form" onSubmit={login}>
      <TextFormInput control={control} name="email" containerClassName="mb-3" label="Email" id="email-id" placeholder="Enter your email" />

      <PasswordFormInput
        control={control}
        name="password"
        containerClassName="mb-3"
        placeholder="Enter your password"
        id="password-id"
        label={
          <>
            <Link href="/auth/reset-pass" className="float-end text-muted text-unline-dashed ms-1">
              Reset password
            </Link>
            <label className="form-label" htmlFor="example-password">
              Password
            </label>
          </>
        }
      />
      <div className="mb-3">
        <FormCheck label="Remember me" id="sign-in" />
      </div>
      <div className="mb-1 text-center d-grid">
        <Button variant="primary" type="submit" disabled={isLoading}>
          Sign In
        </Button>
      </div>
    </form>
  )
}

export default LoginFrom
