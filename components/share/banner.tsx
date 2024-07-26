import Link from "next/link";

interface BannerProps {
    deckUUID: string
    reportUUID: string

}

export async function Banner({deckUUID, reportUUID}: BannerProps) {

    return (

        <div className="absolute top-0 left-0 w-full flex justify-center bg-objections p-2">
            <h1 className="text-3xl font-bold sm:text-4xl flex items-center sm:justify-start flex-col sm:flex-row mx-auto sm:mx-0">
                <span
                    className="text-standard mr-4">
                        Want to see more details of this deck?
                    <Link href={`/login?redirect=/view/${deckUUID}/${reportUUID}`}
                          className="text-zinc-50 underline cursor-pointer pl-2">
                        Sign up for a free account!
                    </Link>
            </span>
            </h1>
        </div>

    )
}