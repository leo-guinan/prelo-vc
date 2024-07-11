import React from 'react';
import Image from "next/image";
export interface Founder {
  name: string;
  twitter?: string;
  linkedin?: string;
}

interface FounderListProps {
  founders: Founder[];
}

const FounderList: React.FC<FounderListProps> = ({ founders }) => {
  return (
    <ul className="space-y-4">
      {founders.map((founder, index) => (
        <li key={index} className="flex items-start space-x-4 flex-col">
          <span className="font-semibold">{founder.name}</span>
          <div className="flex space-x-2">
            {founder.twitter && (
              <a
                href={founder.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600"
              >
                <Image src={'/x-logo.svg'} alt={"X"} width={20} height={20} />
              </a>
            )}
            {founder.linkedin && (
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-900"
              >
                <Image src={'/LinkedIn_icon.svg'} alt={"LinkedIn"} width={20} height={20} />
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FounderList;