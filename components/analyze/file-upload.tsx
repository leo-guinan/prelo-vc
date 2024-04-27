'use client'
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {getUploadUrl} from "@/app/actions/analyze";
import DisplayFile from "@/components/analyze/file";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

function humanFileSize(bytes: number, si = false, dp = 1) {
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

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [uploadUrl, setUploadUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [pitchDeckId, setPitchDeckId] = useState<number | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const router = useRouter()


    useEffect(() => {
        if (uploadSuccess && pitchDeckId) {
            console.log(pitchDeckId)
            router.push(`/report/${pitchDeckId.toString()}`)
        }
    }, [uploadSuccess, pitchDeckId])

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
                const newUploadUrl = await getUploadUrl(selectedFile.name);
                console.log(newUploadUrl)
                if ('error' in newUploadUrl) {
                    setErrorMessage('Error getting upload URL. Please try again.');
                    setFile(null);
                    setLoading(false);
                    return;
                }
                setUploadUrl(newUploadUrl.url)
                setPitchDeckId(newUploadUrl.pitchDeckId)
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
            // Example: POST request using fetch
            const response = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/pdf'  // Must match with the content type used to generate the pre-signed URL
                },
                body: file,
            });

            if (response.ok) {
                console.log('File uploaded successfully');
                setUploadSuccess(true)

                // Handle response here
            } else {
                throw new Error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setErrorMessage('Error uploading file. Please try again.');
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

    return (
        <div
            className={`flex items-center justify-center`}
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
        >
            <Card className="w-full max-w-lg">
                <CardHeader>
                    {errorMessage && <div style={{color: 'red'}}>{errorMessage}</div>}


                    <div>Upload your PDF</div>
                    <div>Drag and drop your PDF file here to upload.</div>
                </CardHeader>
                <CardContent className="flex items-center gap-4 py-6">
                    <div className="grid w-full gap-1.5">
                        <Label
                            className="border border-dashed rounded-lg w-full p-4 flex items-center justify-center gap-2 text-sm cursor-pointer"
                            htmlFor="pdf"
                        >
                            <span>Choose a file or drag it here.</span>
                            <span className="ml-auto font-semibold">Browse</span>
                            <Input className="sr-only" id="pdf" type="file" onChange={handleFileChange}
                                   disabled={loading}
                                   accept="application/pdf"/>
                        </Label>
                        {file && (
                            <>
                                <DisplayFile name={file.name} size={humanFileSize(file.size)} type={file.type}/>
                            </>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex p-3 border-t justify-end">
                    <Button size="sm" onClick={handleUpload} disabled={loading || !file}>Submit</Button>
                </CardFooter>
            </Card>

        </div>
    );
}

export default FileUpload;
