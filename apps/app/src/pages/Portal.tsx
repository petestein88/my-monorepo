import { useState } from 'react'
import Button from '../common/Button'
import { supabase } from '../config/supabase'
import { useAuthProviderContext } from '../providers/AuthProvider'
import { utils } from '../utils'

const Portal = () => {
  const { user } = useAuthProviderContext()
  const [loading, setLoading] = useState(false)

  const onSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      utils.toast.success({ message: 'Signed out' })
      window.location.href = '/auth/signin'
    } catch (error: any) {
      const message = error?.message ?? 'Sign out failed'
      utils.toast.error({ message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-2'>Portal</h1>
      <p className='text-sm text-gray-600 mb-6'>
        You’re logged in as <span className='font-medium'>{user?.email ?? 'unknown'}</span>
      </p>

      <div className='max-w-sm'>
        <Button label='Sign out' loading={loading} sizeVariant='md' className='w-full' onClick={onSignOut as any} />
      </div>

      <p className='text-xs text-gray-500 mt-6'>
        Next step: wire dashboard data to Supabase tables once auth is stable.
      </p>
    </div>
  )
}

export default Portal
