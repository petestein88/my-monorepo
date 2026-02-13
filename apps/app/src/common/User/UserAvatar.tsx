import clsx from 'clsx'

import Avatar from '../Avatar'

type IUserAvatarProps = {
    variant?: 'small'
    picture?: string | null
    name: string
}

const UserAvatar = (props: IUserAvatarProps) => {
    const { picture, ...rest } = props

    const userName = rest.name

    const initials = userName
        .split(' ')
        .splice(0, 2)
        .map(name => name[0]?.toUpperCase())
        .join('')

    return (
        <Avatar
            alt={userName}
            initials={initials}
            src={picture ?? ''}
            className={clsx(
                'cursor-pointer max-lg:hidden lg:bs-[40px] lg:is-[40px]',
                props.variant === 'small' && 'text-sm'
            )}
        />
    )
}

export default UserAvatar
