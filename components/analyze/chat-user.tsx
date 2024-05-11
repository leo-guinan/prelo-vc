import Image from "next/image";

interface ChatUserProps {
    user?: {
        name?: string | null
        image?: string | null

    }
}

export default function ChatUser({user}: ChatUserProps) {
    function getUserInitials(name?: string) {
        if (!name) return "US"
        const [firstName, lastName] = name.split(' ')
        return lastName ? `${firstName[0]}${lastName[0]}` : firstName.slice(0, 2)
    }

    return (
        <>
            {user?.image ? (
                <Image
                    className="transition-opacity duration-300 rounded-full select-none hover:opacity-80"
                    src={user?.image ? `${user.image}` : ''}
                    alt={user?.name ?? 'Avatar'}
                    height={32}
                    width={32}
                />
            ) : (
                <div
                    className="flex items-center justify-center text-xs font-medium uppercase rounded-full select-none size-7 shrink-0 bg-muted/50 text-muted-foreground">
                    {user?.name ? getUserInitials(user?.name) : null}
                </div>
            )}

        </>
    )
}