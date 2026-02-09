import clsx from 'clsx'
import { forwardRef, InputHTMLAttributes, useRef } from 'react'

import './index.css'

type IInputProps = InputHTMLAttributes<HTMLInputElement> & {
    wrapperClassName?: string
    label?: string
    labelClassName?: string
    error?: string
}

const Radio = forwardRef<HTMLInputElement, IInputProps>((props, ref) => {
    const { label, id: id_, wrapperClassName, labelClassName, error, ...restInputProps } = props

    const id = useRef(`cbx${id_ ?? new Date().getTime()}`)

    return (
        <div className={clsx('checkbox-wrapper-51 mb-3', wrapperClassName, label && 'flex items-center')}>
            {label ? (
                <label className={clsx('mr-3 block text-sm font-medium text-black', labelClassName)} htmlFor='fullName'>
                    {label}
                </label>
            ) : null}
            <input id={id.current} type='checkbox' ref={ref} {...restInputProps} />
            <label className='toggle' htmlFor={id.current}>
                <span>
                    <svg viewBox='0 0 10 10' height='10px' width='10px'>
                        <path d='M5,1 L5,1 C2.790861,1 1,2.790861 1,5 L1,5 C1,7.209139 2.790861,9 5,9 L5,9 C7.209139,9 9,7.209139 9,5 L9,5 C9,2.790861 7.209139,1 5,1 L5,9 L5,1 Z'></path>
                    </svg>
                </span>
            </label>
            {error ? <div className='text-danger text-sm font-[500]'>{error}</div> : null}
        </div>
    )
})
Radio.displayName = 'Radio'

export default Radio
