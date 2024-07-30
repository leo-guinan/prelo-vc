'use client'
import {useEffect, useState} from "react";
import SearchableDropdown from "@/components/searchable-dropdown";
import {User} from "@prisma/client/edge";
import {Sidebar} from "@/components/sidebar";
import {AnalysisSidebar} from "@/components/analysis-sidebar";
import useSwr, {useSWRConfig} from "swr";
import {useRouter} from "next/navigation";
import {DeckSidebar} from "@/components/deck-sidebar";

interface AdminSidebarProps {
    users: User[]
}

export default function AdminSidebar({users}: AdminSidebarProps) {

    const [selectedUserId, setSelectedUserId] = useState<string>('')
    const displayedUsers = users.map(user => ({name: user.email, id: user.id}))
    const router = useRouter()

    const handleSelect = async (item: {id: string, name: string}) => {
        setSelectedUserId(item.id)
        router.push(`/admin/interview/${item.id}`)
    }

    return (
        <>
            <Sidebar
                className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px]">
                <SearchableDropdown items={displayedUsers} onSelect={handleSelect}/>
                <DeckSidebar userId={selectedUserId}/>
            </Sidebar>

        </>
    )

}