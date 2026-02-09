import clsx from 'clsx'

type IBaseLoader = {
    loaderColor?: string
    bgVariant?: 'primary' | 'error'
}

type ILoaderWithPageLoader = {
    isPageLoader?: boolean
} & IBaseLoader

type ILoaderWithSize = {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
} & IBaseLoader

type ILoaderProps = ILoaderWithPageLoader | ILoaderWithSize

const Loader = (props: ILoaderProps) => {
    let Wrapper = <></>

    const Spinner = (
        <div
            style={{
                borderColor: 'white',
                borderBottomColor: props.bgVariant === 'error' ? 'red' : '#4f46e5'
            }}
            className={clsx(
                'flex-shrink-0',
                (props as ILoaderWithPageLoader).isPageLoader
                    ? '!h-12 !w-12 border-[4px]'
                    : clsx(
                          (props as ILoaderWithSize).size === 'xs' && '!h-4 !w-4 border-[3px]',
                          (props as ILoaderWithSize).size === 'sm' && '!h-4 !w-4 md:!h-5 md:!w-5 border-[3px]',
                          (props as ILoaderWithSize).size === 'md' && '!h-5 md:!h-6 !w-5 md:!w-6 border-[3px]',
                          (props as ILoaderWithSize).size === 'lg' && '!h-7 !w-7 border-[3px]',
                          (props as ILoaderWithSize).size === 'xl' && '!h-8 !w-8 border-[4px]',
                          (props as ILoaderWithSize).size === '2xl' && '!h-9 !w-9 border-[4px]'
                      ),
                props.loaderColor && props.loaderColor,
                ' border-solid rounded-full animate-spin'
            )}
        ></div>
    )

    if ((props as ILoaderWithPageLoader).isPageLoader) {
        Wrapper = (
            <main className={clsx('flex justify-center items-center h-screen w-screen')}>
                <div className='flex h-screen items-center justify-center bg-white w-full'>
                    <div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent'></div>
                </div>
            </main>
        )
    } else {
        Wrapper = Spinner
    }

    return Wrapper
}

export default Loader
