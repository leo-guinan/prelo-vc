'use client'

import {useEffect} from 'react'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import * as Fathom from "fathom-client";

export function NavigationEvents() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        Fathom.load('NRRPPRVC', {
            includedDomains: ['app.scoremydeck.com'],
        });

        Fathom.trackPageview();
    }, [pathname, searchParams])


    return null
}