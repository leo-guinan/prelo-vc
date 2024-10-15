import { UserWithMemberships } from '@/lib/types';
import Image from 'next/image';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button, buttonVariants } from '../ui/button';
import { useState } from 'react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IconCheck, IconCopy } from '../ui/icons';

export default function ShareProfile({ user }: { user: UserWithMemberships }) {
    const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
    const copyShareLink = async () => {
        if (isCopied) return
        copyToClipboard(`https://investor.pitchin.bio/${user.slug}`)
    }
    return (
        <div className="text-white p-6 rounded-lg mx-auto size-full">
            <div className="flex flex-col items-center mb-6">
                <Image
                    src={user.shareProfile?.avatarUrl ?? user.image ?? ""}
                    alt={`${user.shareProfile?.name}'s avatar`}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-gray-400">Investor at {user.shareProfile?.company}</p>
            </div>

            <div className="space-y-4">
                <Section emoji="💛" title="Passion">
                    {user.shareProfile?.passion}
                </Section>

                <Section emoji="💡" title="Thesis">
                    {user.shareProfile?.thesis}
                </Section>

                <Section emoji="🏭" title="Industries">
                    {user.shareProfile?.industries}
                </Section>

                <Section emoji="💵" title="Check Size">
                    {user.shareProfile?.checkSize}
                </Section>
            </div>
            <div className="flex justify-center">
                <Dialog>
                    <DialogTrigger>
                        <button className="bg-blue-600 text-white p-4 rounded-lg mt-6 mx-auto">
                            Share {user.shareProfile?.name}&apos;s Submind
                        </button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Share This Submind</DialogTitle>
                            <DialogDescription>

                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4">
                            <input
                                type="text"
                                value={`https://investor.pitchin.bio/${user.slug}`}
                                disabled
                                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                            />
                        </div>
                        <DialogFooter className="sm:justify-start">

                            <DialogClose asChild>
                                <Button type="button" variant="secondary" className="p-4 h-10">
                                    Close
                                </Button>
                            </DialogClose>
                            <Link
                                onClick={copyShareLink}
                                href="#"
                                className={cn(
                                    buttonVariants({ variant: 'outline' }),
                                    'h-10 text-zinc-50 dark:text-gray-900 justify-start bg-standard dark:bg-gray-100 p-4 shadow-none transition-colors hover:bg-gray-100 hover:text-gray-900  dark:hover:bg-standard dark:hover:text-zinc-50'
                                )}
                            >
                                {isCopied ? <IconCheck /> : <IconCopy />}
                                Copy Share Link
                            </Link>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
    return (
        <div className="mb-2 flex flex-col items-start">
            <h3 className="font-bold text-center">
                {title} {emoji}
            </h3>
            <p className="text-sm text-gray-300">{children}</p>

        </div>
    );
}