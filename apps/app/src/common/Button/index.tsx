import clsx from 'clsx'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

import Loader from '../Loader'

type IButtonProps = {
    label?: string
    loading?: boolean
    variant?: 'outlined'
    sizeVariant?: 'sm' | 'md'
} & PropsWithChildren &
    ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: IButtonProps) => {
    const { children, label, loading, className, variant, sizeVariant, ...rest } = props
    const isOutlined = variant === 'outlined'
    const disabled = loading || props.disabled

    return (
        <button
            {...rest}
            disabled={disabled}
            className={clsx(
                className,
                'inline-flex items-center justify-center rounded-md py-2 px-10 text-center lg:px-8 xl:px-4 font-[500] transition-colors min-w-[144px]',
                (sizeVariant === 'sm' || !sizeVariant) && 'min-h-[40px]',
                sizeVariant === 'md' && 'min-h-[46px]',
                disabled && '!bg-opacity-70',
                isOutlined
                    ? clsx('text-primary', !disabled && 'hover:text-primaryDark')
                    : clsx('bg-primary text-white', !disabled && 'hover:bg-primaryDark')
            )}
        >
            {loading ? <Loader size='sm' /> : (children ?? label)}
        </button>
    )
}

export default Button
