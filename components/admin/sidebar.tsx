'use client'
import {useState} from "react";
import SearchableDropdown from "@/components/searchable-dropdown";
import {User} from "@prisma/client/edge";
import {Sidebar} from "@/components/sidebar";
import {useRouter} from "next/navigation";
import {DeckSidebar} from "@/components/deck-sidebar";
import { UserWithMemberships } from "@/lib/types";

interface AdminSidebarProps {
    users: UserWithMemberships[]
}

export default function AdminSidebar({users}: AdminSidebarProps) {

    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const displayedUsers = users.map(user => ({name: user.email, id: user.id}))
    const [selectedUser, setSelectedUser] = useState<UserWithMemberships | null>(null)
    const router = useRouter()

    const handleSelect = async (item: { id: string, name: string }) => {
        setSelectedUserId(item.id)
        router.push(`/admin/interview/${item.id}`)
        setSelectedUser(users.find(user => user.id === item.id) ?? null)
    }

    return (
        <>
            <Sidebar
                className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
                <SearchableDropdown items={displayedUsers} onSelect={handleSelect}/>
                {selectedUser && <DeckSidebar userId={selectedUserId} user={selectedUser}/>}
            </Sidebar>

        </>
    )

}