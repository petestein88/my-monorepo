import clsx from 'clsx'
import React, { InputHTMLAttributes, ReactNode } from 'react'

type IInputProps = InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string
    icons?: ReactNode | null
    icon?: ReactNode | null
    iconPosition?: 'start' | 'end'
    iconPositions?: 'start' | 'end'
    label?: string
    error?: string
    variant?: 'small'
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
    const {
        icon = null,
        icons = null,
        iconPosition = 'start',
        iconPositions = 'start',
        error,
        label,
        wrapperClassName,
        variant,
        ...restInputProps
    } = props

    return (
        <div className={clsx('w-full', wrapperClassName)}>
            {label ? (
                <label className='mb-2 block text-sm text-grayLight' htmlFor='fullName'>
                    {label}
                </label>
            ) : null}

            <div className='relative'>
                {/* Start icon */}
                {icon && iconPosition === 'start' && <span className='absolute left-3.5 top-3.5'>{icon}</span>}
                {icons && iconPositions === 'start' && <span className='absolute left-3.5 top-3.5'>{icons}</span>}

                <input
                    ref={ref}
                    {...restInputProps}
                    className={clsx(
                        'w-full rounded-md border border-stroke bg-transparent text-black outline-none focus:border-primary focus-visible:shadow-none',
                        icon || icons
                            ? iconPosition === 'start'
                                ? 'pl-12 pr-4' // Adjust padding for start icon
                                : 'pl-4 pr-12' // Adjust padding for end icon
                            : 'px-4',
                        variant === 'small' ? 'py-2 text-[15px]' : 'py-3'
                    )}
                />

                {/* End icon */}
                {icon && iconPosition === 'end' && <span className='absolute right-4 top-4'>{icon}</span>}
                {icons && iconPositions === 'end' && <span className='absolute right-4 top-4'>{icons}</span>}
            </div>

            {error ? <div className='text-red-500 text-xs font-[500] mt-1'>{error}</div> : null}
        </div>
    )
})
Input.displayName = 'Input'

export default Input
