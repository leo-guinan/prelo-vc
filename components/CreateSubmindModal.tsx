import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from '@/lib/hooks/use-debounce';
import { checkSlugUniquenessAction } from '@/app/actions/interview';

interface CreateSubmindModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: SubmindFormData) => void;
}

export interface SubmindFormData {
    firstName: string;
    lastName: string;
    firmName: string;
    firmUrl: string;
    specialNotes: string;
    slug: string;
}

export function CreateSubmindModal({ isOpen, onClose, onSubmit }: CreateSubmindModalProps) {
    const [formData, setFormData] = useState<SubmindFormData>({
        firstName: '',
        lastName: '',
        firmName: '',
        firmUrl: '',
        specialNotes: '',
        slug: '',
    });
    const [slugError, setSlugError] = useState<string | null>(null);
    const debouncedSlug = useDebounce(formData.slug, 500);

    useEffect(() => {
        if (debouncedSlug) {
            checkSlugUniqueness(debouncedSlug);
        }
    }, [debouncedSlug]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'slug') {
            setSlugError(null);
        }
    };

    const checkSlugUniqueness = async (slug: string) => {
        const unique = await checkSlugUniquenessAction(slug)
        if (!unique) {
            setSlugError('This slug is already taken. Please choose another one.')
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!slugError) {
            onSubmit(formData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Create Your Submind</DialogTitle>
                    <DialogDescription>
                        Let&apos;s start by creating your submind. In order to do so, we need a little bit of info.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstName" className="text-right">
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastName" className="text-right">
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firmName" className="text-right">
                                Firm Name
                            </Label>
                            <Input
                                id="firmName"
                                name="firmName"
                                value={formData.firmName}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firmUrl" className="text-right">
                                Firm URL
                            </Label>
                            <Input
                                id="firmUrl"
                                name="firmUrl"
                                value={formData.firmUrl}
                                onChange={handleChange}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="specialNotes" className="text-right">
                                Special Notes
                            </Label>
                            <Textarea
                                id="specialNotes"
                                name="specialNotes"
                                value={formData.specialNotes}
                                onChange={handleChange}
                                className="col-span-3"
                                placeholder="Anything special you'd like your submind to take note of"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="slug" className="text-right">
                                Profile URL
                            </Label>
                            <div className="col-span-3 flex items-center">
                                <Input
                                    value="https://investor.pitchin.bio/"
                                    disabled
                                    className="rounded-r-none bg-gray-100 text-gray-500"
                                />
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="rounded-l-none"
                                    placeholder="your-unique-slug"
                                    required
                                />
                            </div>
                        </div>
                        
                    </div>
                    {slugError && (
                            <p className="flex justify-center text-red-500 text-sm mt-1 mb-4">{slugError}</p>
                        )}
                    <DialogFooter>
                        <Button type="submit" disabled={!!slugError}>Create Submind</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}