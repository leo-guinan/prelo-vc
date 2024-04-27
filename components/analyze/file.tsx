import React from "react";

export default function DisplayFile({name, size, type}: {name: string, size: string, type: string}) {
  return (
    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg dark:border-gray-800">
      <FileIcon className="h-8 w-8 text-gray-500 dark:text-gray-400" />
      <div className="grid gap-1">
        <div className="font-semibold">{name}</div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{size}</span>
          <span>·</span>
          <span>{type}</span>
        </div>
      </div>
    </div>
  )
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}