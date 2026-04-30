import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function SignUpPage() {
    return (
        <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4">
            {/* Background effects */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(91,197,167,0.15),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_40%)]" />
            <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-splitwise-green shadow-[0_0_30px_rgba(91,197,167,0.4)]">
                        <span className="text-2xl font-black text-white">S</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Create your account</h1>
                    <p className="text-zinc-400">Get started with SplitEase for free</p>
                </div>

                {/* Clerk SignUp component */}
                <div className="flex justify-center [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-card]:border-none [&_.cl-cardBox]:bg-transparent [&_.cl-cardBox]:shadow-none [&_.cl-footer]:bg-transparent">
                    <SignUp
                        appearance={{
                            baseTheme: dark,
                            variables: {
                                colorText: '#ededed',
                                colorTextSecondary: '#a1a1aa',
                                colorBackground: 'transparent',
                                colorInputText: '#ededed',
                                colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                            },
                            elements: {
                                rootBox: 'w-full',
                                card: 'bg-transparent shadow-none border-none p-0 w-full',
                                cardBox: 'bg-transparent shadow-none w-full',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtonsBlockButton: '!bg-white/5 !border !border-white/10 !text-white hover:!bg-white/10 transition-colors rounded-xl h-11',
                                socialButtonsBlockButtonText: '!text-white font-medium',
                                socialButtonsProviderIcon: 'w-5 h-5',
                                dividerLine: '!bg-white/20',
                                dividerText: '!text-zinc-300',
                                formFieldLabel: '!text-zinc-200 text-sm font-medium',
                                formFieldInput: '!bg-white/5 !border-white/20 !text-white rounded-xl h-11 focus:!ring-2 focus:!ring-splitwise-green focus:!border-splitwise-green placeholder:!text-zinc-500',
                                formButtonPrimary: '!bg-splitwise-green hover:!bg-[#4ab092] !text-white rounded-xl h-11 font-semibold shadow-[0_8px_30px_rgba(91,197,167,0.25)] transition-all hover:-translate-y-0.5',
                                footerAction: '!text-zinc-300',
                                footerActionLink: '!text-splitwise-green hover:!text-[#4ab092] font-semibold',
                                identityPreview: '!bg-white/5 !border-white/10 rounded-xl',
                                identityPreviewText: '!text-zinc-200',
                                identityPreviewEditButton: '!text-splitwise-green hover:!text-[#4ab092]',
                                formFieldAction: '!text-splitwise-green hover:!text-[#4ab092]',
                                otpCodeFieldInput: '!bg-white/5 !border-white/10 !text-white rounded-lg',
                                alert: '!bg-red-500/10 !border !border-red-500/30 !text-red-300 rounded-xl',
                                alertText: '!text-red-300',
                                footer: 'bg-transparent',
                            },
                            layout: {
                                socialButtonsPlacement: 'top',
                                socialButtonsVariant: 'blockButton',
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
