import React, {SyntheticEvent, useState} from 'react';
import {useCopyToClipboard} from "@/lib/hooks/use-copy-to-clipboard";

interface EmailComposeProps {
  to: string;
    subject: string;
    body: string;

}

export default function EmailCompose({ to, subject, body }: EmailComposeProps) {
  const [displayedTo, setDisplayedTo] = useState(to);
  const [displayedSubject, setDisplayedSubject] = useState(subject);
  const [displayedBody, setDisplayedBody] = useState(body);
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const handleSend = (e: SyntheticEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:${displayedTo}?body=${encodeURIComponent(displayedBody)}&subject=${encodeURIComponent(displayedSubject)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 rounded-lg">
        <div className="my-4">
          <label htmlFor="to" className="block text-sm font-medium text-gray-900 dark:text-zinc-50">To:</label>
          <input
            type="email"
            id="to"
            value={to}
            onChange={(e) => setDisplayedTo(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="my-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-900 dark:text-zinc-50">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setDisplayedSubject(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="my-4">
          <label htmlFor="body" className="block text-sm font-medium text-gray-900 dark:text-zinc-50">Message:</label>
          <textarea
            id="body"
            value={body}
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

