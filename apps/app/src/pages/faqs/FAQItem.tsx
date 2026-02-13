import CommanImage from '../../common/Image'

export default function FaqItem({
    item,
    index
}: {
    item: {
        id: number
        label: string
        description: string
    }
    index: number
}) {
    return (
        <div
            key={`${index}`}
            className='mt-4 grid w-full divide-y divide-neutral-200 rounded-[10px] bg-white px-[15px] sm:px-[25px] lg:mt-8'
            style={{
                // filter: 'drop-shadow(rgba(0, 0, 0, 0.15) 0px 10px 10px)',
                WebkitBoxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 10px',
                borderTop: '1px solid lightgray'
            }}
        >
            <div className='py-[15px] sm:py-[20px]'>
                <details className='group'>
                    <summary className='flex cursor-pointer list-none items-center justify-between font-[400]'>
                        <span className=' mr-2 w-[calc(100%-30px)] font-[500] text-[#111827] lg:text-[16px]'>
                            {item?.label}
                        </span>
                        <span className='h-[25px] w-[25px] transition group-open:rotate-180'>
                            <CommanImage
                                src='./svg/Add_faq3.svg'
                                className='block h-full w-full group-open:hidden'
                                width={20}
                                height={20}
                                alt='add_faq'
                            />

                            <CommanImage
                                src='./svg/sub_faq3.svg'
                                className='hidden h-full w-full group-open:block'
                                width={20}
                                height={20}
                                alt='add_faq'
                            />
                        </span>
                    </summary>
                    <div
                        className='group-open:animate-fadeIn font-roboto mt-3 text-[12px] text-neutral-600 lg:text-[14px]'
                        dangerouslySetInnerHTML={{ __html: item?.description }}
                    ></div>
                </details>
            </div>
        </div>
    )
}
