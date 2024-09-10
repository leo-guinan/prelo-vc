'use client'
import { User } from "@prisma/client/edge"
import { useState } from "react"
import FileUpload from "@/components/analyze/file-upload"

interface UploadDeckProps {
    user: User
}

export default function UploadDeck({ user }: UploadDeckProps) {
    const [uploaded, setUploaded] = useState(false)

    const handleUploadSuccess = () => {
        console.log('Upload success')
        setUploaded(true)
    }

    return (
        <>
            {uploaded ? (
                <div>Uploaded</div>
            ) : (
                <FileUpload user={user} onUploadSuccess={handleUploadSuccess}/>
            )}
        </>
    )
}