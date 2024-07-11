import React, { useState } from 'react';

interface EmailComposerProps {
    email: string
  content?: string;
}

export default function EmailComposer({email,content}: EmailComposerProps) {
  const [emailContent, setEmailContent] = useState<string>(
    content ?? "Dear recipient,\n\nI hope this email finds you well.\n\nBest regards,\nYour Name"
  );

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmailContent(e.target.value);
  };

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${email}?body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <textarea
        className="w-full h-64 p-2 mb-4 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={emailContent}
        onChange={handleContentChange}
      />
      <button
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        onClick={handleSendEmail}
      >
        Send Email
      </button>
    </div>
  );
};

