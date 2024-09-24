import React, {SyntheticEvent, useEffect, useState} from 'react';
import {useCopyToClipboard} from "@/lib/hooks/use-copy-to-clipboard";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import { User } from '@prisma/client/edge';
import { NavigateToReport } from './panel';

interface EmailComposeProps {
    to: string;
    subject: string;
    body: string;
    user: User;
}



export default function EmailCompose({to, subject, body, user}: EmailComposeProps) {
    const [displayedTo, setDisplayedTo] = useState(to);
    const [displayedSubject, setDisplayedSubject] = useState(subject);
    const [displayedBody, setDisplayedBody] = useState(body);
    const {isCopied, copyToClipboard} = useCopyToClipboard({timeout: 2000})
    const searchParams = useSearchParams()
    const handleSend = (e: SyntheticEvent) => {
        e.preventDefault();
        const mailtoLink = `mailto:${displayedTo}?body=${encodeURIComponent(displayedBody)}&subject=${encodeURIComponent(displayedSubject)}`;
        window.location.href = mailtoLink;
    };
    const [navigateToReport, setNavigateToReport] = useState<NavigateToReport>({
        report_uuid: searchParams.get('report_uuid') ?? user.currentReportUUID ?? '',
        deck_uuid: searchParams.get('deck_uuid') ?? user.currentDeckUUID ?? ''
    });

    useEffect(() => {
        setNavigateToReport({
            report_uuid: searchParams.get('report_uuid') ?? user.currentReportUUID ?? '',
            deck_uuid: searchParams.get('deck_uuid') ?? user.currentDeckUUID ?? ''
        })
    }, [searchParams, user])


    
    useEffect(() => {
        setDisplayedTo(to)
        setDisplayedSubject(subject)
        setDisplayedBody(body)
    }, [to, subject, body])

    return (
        <div className="max-w-2xl mx-auto mt-8 p-6 rounded-lg">
            <Link
                href={`?report_uuid=${navigateToReport.report_uuid}&deck_uuid=${navigateToReport.deck_uuid}&view=report`}
                className="flex flex-row text-objections text-xl align-text-top mb-8">

                <span className=""> {'<'} Back</span>
            </Link>
            <div className="my-4">
                <label htmlFor="to" className="block text-sm font-medium text-gray-900 dark:text-zinc-50">To:</label>
                <input
                    type="email"
                    id="to"
                    value={displayedTo}
                    onChange={(e) => setDisplayedTo(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div className="my-4">
                <label htmlFor="subject"
                       className="block text-sm font-medium text-gray-900 dark:text-zinc-50">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    value={displayedSubject}
                    onChange={(e) => setDisplayedSubject(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div className="my-4">
                <label htmlFor="body"
                       className="block text-sm font-medium text-gray-900 dark:text-zinc-50">Message:</label>
                <textarea
                    id="body"
                    value={displayedBody}
                    onChange={(e) => setDisplayedBody(e.target.value)}
                    rows={10}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                ></textarea>
            </div>
            <div>
                <button
                    type="button"
                    className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => copyToClipboard(displayedBody)}
                >
                    {!isCopied && (
                        <span>Copy To Clipboard</span>
                    )}
                    {isCopied && (
                        <span>Copied!</span>
                    )}
                </button>
                <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleSend}
                >
                    Open In Email
                </button>
            </div>
        </div>
    );
};

