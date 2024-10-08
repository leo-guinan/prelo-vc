import { getMessages, getUserBySlug } from "@/app/actions/share"
import UploadDeck from "@/components/share/upload-deck";
import { Message } from "@/lib/types";
import { nanoid } from "@/lib/utils";
import { User } from "@prisma/client/edge";

interface InvestorPageProps {
    params: {
        slug: string
    }
}


export default async function InvestorPage({ params }: InvestorPageProps) {
    const { slug } = params;
    const user = await getUserBySlug(slug);

    if (!user) {
        return <div>User not found</div>
    }

    
    return (
        <div className="container mx-auto">
            <UploadDeck user={user}/>
        </div>
    )
}