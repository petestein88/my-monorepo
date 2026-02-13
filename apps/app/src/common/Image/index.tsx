import React, { useState } from 'react'
import clsx from 'clsx'

export interface IProps {
    src: string
    alt?: string
    onClick?: () => void
    width?: number
    height?: number
    className?: string
    crossOrigin?: string
    do_load?: boolean
    fill?: boolean
    priority?: boolean
    showLoader?: boolean
    hoverEffect?: boolean
}

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <div
            role='status'
            className={clsx(
                'h-full w-full animate-pulse flex items-center justify-center bg-gray-300 dark:bg-gray-700 overflow-hidden',
                className
            )}
        />
    )
}

const CommanImage: React.FC<IProps> = props => {
    const [isLoaded, setIsLoaded] = useState(false)

    const showLoader = props.do_load || props.showLoader

    const handleOnLoad = () => {
        setIsLoaded(true)
    }

    return (
        <div className='relative'>
            {/* Show Skeleton Loader until image loads */}
            {!isLoaded && showLoader && <SkeletonLoader className={props.className} />}

            {!props.showLoader && (
                <img
                    src={props.src}
                    alt={props.alt || 'demo_alt'}
                    onLoad={handleOnLoad}
                    onClick={props.onClick}
                    width={props.width}
                    height={props.height}
                    crossOrigin={props.crossOrigin as 'anonymous' | 'use-credentials'}
                    className={clsx(
                        !isLoaded && showLoader ? 'hidden' : props.className,
                        props.hoverEffect ? 'transition-transform duration-500 ease-linear hover:scale-110' : ''
                    )}
                    onError={e => {
                        ;(e.target as HTMLImageElement).src = '/png/default.webp'
                    }}
                />
            )}
        </div>
    )
}

export default CommanImage
