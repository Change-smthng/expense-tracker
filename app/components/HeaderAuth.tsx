"use client"
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs'

export default function HeaderAuth() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex items-center gap-4">
      {!isSignedIn && (
        <>
          <SignInButton mode="redirect">
            <button className="text-sm font-medium hover:text-splitwise-green transition-colors cursor-pointer">Log in</button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <button className="bg-splitwise-green hover:bg-[#4ab092] transition-colors text-white rounded-full font-medium text-sm h-10 px-6 cursor-pointer shadow-[0_0_15px_rgba(91,197,167,0.3)]">
              Sign Up
            </button>
          </SignUpButton>
        </>
      )}

      {isSignedIn && (
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-10 h-10 ring-2 ring-splitwise-green/50',
            }
          }}
        />
      )}
    </div>
  )
}
