'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUploadUrl } from "@/app/actions/analyze";
import DisplayFile from "@/components/analyze/file";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudUploadIcon } from "@/components/ui/icons";
import { User } from '@prisma/client/edge';
import { uploadDeckFromSharedLink } from '@/app/actions/share';
import ChatUser from './chat-user';
import { UserWithMemberships } from '@/lib/types';
import Image from 'next/image';
export function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

interface FileUploadProps {
    user: UserWithMemberships
    onUploadSuccess: (message: string, uuid: string) => void
    showDetails?: boolean
}

export default function FileUpload({ user, onUploadSuccess, showDetails = true }: FileUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [uuid, setUuid] = useState<string>('');
    const [investorName, setInvestorName] = useState<string>(user?.firstName ?? 'Investor');
    const [investorCompany, setInvestorCompany] = useState<string>(user.memberships[0].organization.name ?? 'Early Stage');

    const [show, setShow] = useState<boolean>(true)


    useEffect(() => {
        if (uploadSuccess) {
            onUploadSuccess(uploadMessage, uuid)
            setShow(false)
        }
    }, [uploadSuccess])

    // Handle file change event from input
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        await pickFile(selectedFile);

    };

    const pickFile = async (selectedFile: File | null) => {
        // Check if the file is a PDF
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf') {
                setLoading(true);
                setFile(selectedFile);
                setErrorMessage('');
                setLoading(false);
            } else {
                setErrorMessage('Please upload a valid PDF file.');
                setFile(null);
            }
        }
    }

    // Function to handle file upload, for example, sending it to a server
    const handleUpload = async () => {
        if (!file) {
            setErrorMessage('Please select a PDF file to upload.');
            return;
        }

        try {
            setLoading(true);
            // Example: POST request using fetch

            const formData = new FormData()
            formData.append('file', file)

            const response = await uploadDeckFromSharedLink(user.slug ?? "", formData)

            if ('error' in response) {
                throw new Error(response.error)
            }

            setUploadMessage(response.message)
            setUuid(response.uuid)

            console.log('File uploaded successfully');
            setUploadSuccess(true)

        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('Error uploading file. Please try again.');
            setFile(null);
            setLoading(false);
        }
    };
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDragIn = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setDragActive(true);
        }
    };

    const handleDragOut = (event: React.DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
            const files = event.dataTransfer.files;
            await pickFile(files[0]);
            event.dataTransfer.clearData();
        }
    };

    if (!show) {
        return null
    }

    return (
        <div
            className={`flex items-center justify-center h-screen`}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
        >
            <Card className="w-full h-full py-48"
                style={{ backgroundImage: 'url(/share-hero.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}

            >
                <CardHeader className='flex flex-col items-center justify-center'>
                    {showDetails && (
                        <>
                            <div className='flex flex-col items-center justify-center gap-4'>
                                <Image
                                    src={user.shareProfile?.avatarUrl ?? user.image ?? ""}
                                    alt={`${user.shareProfile?.name}'s avatar`}
                                    width={128}
                                    height={128}
                                    className="rounded-full mb-4"
                                />

                            </div>

                            <h1 className="text-5xl font-bold">Hey, I&apos;m {investorName}</h1>
                            <h2 className='text-5xl font-bold'>Investor at <span className="text-objections">{investorCompany}</span></h2>
                        </>
                    )}
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </CardHeader>
                <CardContent className="flex items-center gap-4 py-8 max-w-lg mx-auto">
                    <div className="grid w-full gap-1.5">
                        <Label
                            className="border border-dashed bg-standard dark:bg-zinc-50 text-zinc-50 dark:text-gray-900 rounded-lg w-4/5 mx-auto p-8 flex items-center justify-center gap-2 text-xl cursor-pointer hover:bg-gray-100 hover:text-gray-900  dark:hover:bg-standard dark:hover:text-zinc-50"
                            htmlFor="pdf"
                        >
                            <span>Upload your Pitch Deck</span>
                            <span className="ml-auto font-semibold">
                                <CloudUploadIcon className="size-16" />
                            </span>
                            <Input className="sr-only" id="pdf" type="file" onChange={handleFileChange}
                                disabled={loading}
                                accept="application/pdf" />
                        </Label>
                        {file && (
                            <>
                                <DisplayFile name={file.name} size={humanFileSize(file.size)} type={file.type} />
                            </>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex p-3 border-t justify-end max-w-lg mx-auto">
                    <Button size="sm" onClick={handleUpload} disabled={loading || !file}>Submit</Button>
                </CardFooter>
            </Card>

        </div>
    );
}

