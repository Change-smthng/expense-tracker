type UserAvatarProps = {
  name: string
  avatarUrl?: string | null
  size?: number
  className?: string
}

export default function UserAvatar({ name, avatarUrl, size = 40, className = '' }: UserAvatarProps) {
  const fallback = `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(name)}`
  const imageUrl = avatarUrl || fallback

  return (
    <div
      role="img"
      aria-label={name}
      className={`shrink-0 rounded-full border border-white/10 bg-center bg-cover bg-no-repeat ${className}`}
      style={{ width: size, height: size, backgroundImage: `url(${imageUrl})` }}
    />
  )
}
