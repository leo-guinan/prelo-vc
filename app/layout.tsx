import {Toaster} from 'react-hot-toast'
import {GeistSans} from 'geist/font/sans'
import {GeistMono} from 'geist/font/mono'

import '@/app/globals.css'
import {cn} from '@/lib/utils'
import {TailwindIndicator} from '@/components/tailwind-indicator'
import {Providers} from '@/components/providers'
import {Header} from '@/components/header'
import {Suspense} from "react";
import {NavigationEvents} from "@/components/navigation-events";
import Script from "next/script";

export const metadata = {
    metadataBase: new URL(`https://${process.env.VERCEL_URL}`),
    title: {
        default: 'PreloVC',
        template: `%s - PreloVC`
    },
    description: "Your Investor Digital Twin that thinks just like you.",
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    }
}

export const viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: 'white'},
        {media: '(prefers-color-scheme: dark)', color: 'black'}
    ]
}

interface RootLayoutProps {
    children: React.ReactNode
}

export default function RootLayout({children}: RootLayoutProps) {

    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={cn(
                'font-sans antialiased',
                GeistSans.variable,
                GeistMono.variable
            )}
        >
        <Toaster/>
        <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
                <Header/>
                <main className="flex flex-col flex-1 bg-muted/50">{children}</main>
            </div>
            <TailwindIndicator/>
        </Providers>
        <Suspense fallback={null}>
            <NavigationEvents/>
        </Suspense>
        <Script id="clarity-script" strategy="afterInteractive">
            {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID}");
          `}
        </Script>
        </body>
        </html>
    )
}
