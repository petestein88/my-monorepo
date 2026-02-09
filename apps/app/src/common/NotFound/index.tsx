import { useNavigate } from 'react-router-dom'

import Button from '../Button'
import { utils } from '../../utils'

const NotFound = () => {
    const navigate = useNavigate()
    const onButtonClick = () => {
        navigate(utils.helpers.getRoute('/'))
    }

    return (
        <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
            <div className='flex items-center gap-3 flex-col text-center'>
                <div className='flex flex-col gap-3 is-[90vw] sm:is-[unset] mbe-6 text-[#0E274D]'>
                    <div className='font-medium text-8xl '>404</div>
                    <h4 className='text-[24px] font-medium'>Page Not Found ⚠️</h4>
                    <div>we couldn&#39;t find the page you are looking for.</div>
                </div>
                <Button onClick={onButtonClick}>Back To Home</Button>
            </div>
        </div>
    )
}

export default NotFound
