import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FileUpload, { humanFileSize } from "@/components/analyze/file-upload";
import { UserWithMemberships } from '@/lib/types';
import { uploadDeckFromSharedLink } from '@/app/actions/share';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { CloudUploadIcon } from 'lucide-react';
import DisplayFile from './analyze/file';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from "@/components/ui/label";

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserWithMemberships;
    onUploadSuccess: (message: string, uuid: string) => void;
    message?: string;
}

export function UploadModal({ isOpen, onClose, user, onUploadSuccess, message }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
    const [uploadMessage, setUploadMessage] = useState<string>('');
    const [uuid, setUuid] = useState<string>('');


    useEffect(() => {
        if (uploadSuccess) {
            onUploadSuccess(uploadMessage, uuid)
            onClose()
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
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Your Pitch Deck</DialogTitle>
                </DialogHeader>
                <div
                    className={`flex items-center justify-center`}
                    onDrop={handleDrop}
                    onDragOver={handleDrag}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
        >
                    <Card className="w-full dark:bg-background border-none">
                        <CardContent className="pt-6">
                            <p className='pb-4'>{message}</p>
                            <Label
                                htmlFor="pdf"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <CloudUploadIcon className="w-10 h-10 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
                                </div>
                                <Input 
                                    id="pdf" 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    accept="application/pdf" 
                                />
                            </Label>
                            {file && (
                                <div className="mt-4">
                                    <DisplayFile name={file.name} size={humanFileSize(file.size)} type={file.type} />
                                </div>
                            )}
                            {errorMessage && (
                                <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button onClick={handleUpload} disabled={loading || !file}>
                                {loading ? 'Uploading...' : 'Submit'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
}
