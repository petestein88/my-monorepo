import { PropsWithChildren } from 'react'
import { CONST } from '../constants/index.const'

import Logo from '../images/logo.jpg'

type AuthLayoutProps = PropsWithChildren & {
    title: string
}

const AuthLayout = (props: AuthLayoutProps) => {
    return (
        <div className='rounded-sm bg-white shadow-default'>
            <div className='flex flex-wrap items-center min-h-[100dvh]'>
                <div className='hidden w-full xl:block xl:w-1/2'>
                    <div className='py-17.5 px-26 text-center'>
                        <div className='mb-5.5 inline-block'>
                            <img className='hidden dark:block' src={Logo} alt='Logo' width={600} />
                            <img className='dark:hidden' src={Logo} alt='Logo' />
                        </div>
                        <span className='mt-15 inline-block'></span>
                    </div>
                </div>

                <div className='w-full border-stroke xl:w-1/2 '>
                    <div className='w-full p-4 sm:p-12.5 xl:p-17.5 md:max-w-[600px] mx-auto'>
                        <h2 className='mb-9 text-2xl font-bold text-black sm:text-title-xl2'>
                            {`${props.title} ${CONST.APP_CONST.NAME}`}
                        </h2>

                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthLayout
