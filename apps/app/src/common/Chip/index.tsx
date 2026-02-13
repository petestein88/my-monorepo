import clsx from 'clsx'

export type IChipProps = {
    label: string
    variant: 'error' | 'success' | 'primary'
    size?: 'small' | 'medium' | 'large'
    onClick?: () => void
}

const getVariantClasses = (variant: string) => {
    switch (variant) {
        case 'error':
            return 'bg-red-200 text-red-600'
        case 'success':
            return 'bg-green-200 text-green-600'
        case 'primary':
            return 'bg-blue-100 text-blue-600'

        default:
            return ''
    }
}

const getSizeClasses = (size: string) => {
    switch (size) {
        case 'small':
            return 'text-xs px-4 py-1'
        case 'medium':
            return 'text-sm px-4 py-2'
        case 'large':
            return 'text-base px-4 py-2.5'
        default:
            return 'text-sm px-3 py-1.5'
    }
}

const Chip = ({ label, variant, size = 'small', onClick }: IChipProps) => {
    const variantClasses = getVariantClasses(variant)
    const sizeClasses = getSizeClasses(size)

    return (
        <span
            className={clsx(
                'inline-flex items-center rounded-md font-medium text-sm',
                typeof onClick === 'function' ? 'cursor-pointer' : '',
                sizeClasses,
                variantClasses
            )}
            onClick={onClick}
        >
            {label}
        </span>
    )
}

export default Chip
