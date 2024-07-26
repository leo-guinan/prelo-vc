'use client'

import * as React from 'react'

import {cn} from '@/lib/utils'
import {Button, type ButtonProps} from '@/components/ui/button'
import {IconGitHub, IconSpinner, IconGoogle} from '@/components/ui/icons'
import {signIn} from "next-auth/react";
import {useSearchParams} from "next/navigation";
interface LoginButtonProps extends ButtonProps {
    provider: "google"
    showProviderIcon?: boolean
    text?: string
}

export function LoginButton({
                                text = 'Login',
                                provider,
                                showProviderIcon,

                                className,
                                ...props
                            }: LoginButtonProps) {
    const searchParams = useSearchParams()

    const icons = {
        google: <IconGoogle className="mr-2" />,
    }
    const [isLoading, setIsLoading] = React.useState(false)
    return (
        <Button
            variant="outline"
            onClick={() => {
                setIsLoading(true)

                signIn(provider, {callbackUrl: searchParams.get('redirect') || '/'})
            }}
            disabled={isLoading}
            className={cn(className)}
            {...props}
        >
            {isLoading ? (
                <IconSpinner className="mr-2 animate-spin"/>
            ) : showProviderIcon ? (
                icons[provider]
            ) : null}
            {text}
        </Button>
    )
}
