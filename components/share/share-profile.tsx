import { UserWithMemberships } from '@/lib/types';
import Image from 'next/image';

export default function ShareProfile({ user }: { user: UserWithMemberships }) {
  return (
    <div className="text-white p-6 rounded-lg mx-auto h-full">
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

      <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6">
        Share {user.shareProfile?.name}&apos;s Submind
      </button>
    </div>
  );
}

function Section({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      
      <p className="text-sm text-gray-300">{children}</p>
      <h3 className="font-bold mb-1">
        {emoji} {title}
      </h3>
    </div>
  );
}