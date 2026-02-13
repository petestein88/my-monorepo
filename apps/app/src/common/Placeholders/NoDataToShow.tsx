import clsx from 'clsx'

type NoDataToShowProps = {
    text: string
    className?: string
    center?: boolean
}

const NoDataToShow = (props: NoDataToShowProps) => {
    return (
        <div className={clsx('text-grayLight text-sm', props.center && 'text-center', props.className)}>
            {props.text}
        </div>
    )
}

export default NoDataToShow
