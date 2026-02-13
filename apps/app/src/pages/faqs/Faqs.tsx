import FaqItem from './FAQItem'
import faqData from './data.json'

const Faqs = () => {
    return (
        <div className='w-full mx-auto shadow-md rounded-lg bg-white'>
            <div className='flex w-full flex-wrap py-[30px] max-sm:mb-0 md:py-[50px] lg:mb-0 lg:py-[70px]'>
                <div className='min-h-screen mx-auto w-full max-w-[1100px] bg-white px-5'>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-center text-[16px] text-[#111827] font-semibold lg:text-[22px]'>
                            Frequently Asked Questions
                        </h1>
                    </div>

                    {/* Render FAQs dynamically */}
                    {faqData.map((item, index) => (
                        <FaqItem key={item.id} item={item} index={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Faqs
