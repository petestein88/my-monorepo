import UserPreview from './UserPreview'
import { IUserExtracted } from '../../hooks/useUser'

type ICommonUserDetailsProps = {
    user: IUserExtracted
    title?: string
}

const CommonUserDetails = (props: ICommonUserDetailsProps) => {
    return (
        <div title={props.title ?? 'User Details'}>
            <UserPreview user={props.user} />
        </div>
    )
}

export default CommonUserDetails
