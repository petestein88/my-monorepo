import { useState } from 'react'

type AvatarProps = {
    src?: string // The URL of the image
    alt?: string // Alt text for the image
    initials?: string // Initials to display if the image fails or is not provided
    size?: number // Optional size for the avatar (width and height)
    className?: string // Optional class name for additional styling
}

const Avatar: React.FC<AvatarProps> = ({ src, alt = 'Avatar', initials = '', size = 40, className = '' }) => {
    const [imageError, setImageError] = useState(false)

    // Extract up to two initials from the provided initials string.
    const displayInitials = initials.substring(0, 2).toUpperCase()

    return (
        <div
            className={`avatar ${className}`}
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ccc',
                fontSize: size / 2.5,
                color: '#fff',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                background: '#4338CA'
            }}
        >
            {!imageError && src ? (
                <img
                    src={src}
                    alt={alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImageError(true)}
                />
            ) : (
                <span>{displayInitials}</span>
            )}
        </div>
    )
}

export default Avatar
