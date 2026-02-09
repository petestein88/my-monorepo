import clsx from 'clsx'
import { HTMLAttributes } from 'react'

import UserAvatar from './UserAvatar'
import { IUserExtracted } from '../../hooks/useUser'
import { utils } from '../../utils'

type ICommonUserDetailsProps = {
    containerProps?: HTMLAttributes<HTMLDivElement>
    variant?: 'small' | 'data-grid'
    user: Partial<IUserExtracted>
}

const UserPreview = (props: ICommonUserDetailsProps) => {
    const { user, containerProps, variant } = props

    return (
        <div
            {...containerProps}
            className={clsx(
                'p-1',
                user?.email ? 'flex-start' : 'items-center',
                variant === 'data-grid' ? 'h-full inline-flex' : 'flex gap-x-2'
            )}
        >
            <UserAvatar
                variant={
                    (['data-grid', 'small'] as ICommonUserDetailsProps['variant'][]).includes(props.variant)
                        ? 'small'
                        : undefined
                }
                picture={user.profilePicture}
                name={user.displayName ?? ''}
            />

            <div className='flex flex-col max-w-[calc(100%-48px)]'>
                <div
                    className='custom-link hyperlink ellipsis text-primary flex font-[500] items-center'
                    title={utils.helpers.getValue(user.displayName)}
                >
                    {utils.helpers.getValue(user.displayName)}
                </div>
                {user?.email ? (
                    <div className='ellipsis text-primary' title={utils.helpers.getValue(user?.email)}>
                        {utils.helpers.getValue(user?.email)}
                    </div>
                ) : null}
            </div>
        </div>
    )
}

export default UserPreview
