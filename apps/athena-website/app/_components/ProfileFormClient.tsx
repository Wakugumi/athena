"use client";

import UserService from "@/api/UserService";
import { usePopup } from "@/context/PopupContext";
import { UpdateProfileRequest } from "@athena/types";
import { Button, Label, TextInput } from "flowbite-react";
import { FormEvent, useState } from "react";

export default function ProfileFormClient() {
    const [error, setError] = useState<string | null>(null);
    const { closePopup } = usePopup();

    return (
        <>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Update Profile</h1>
                </div>
                <form className="flex flex-col gap-4" onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const form = new FormData(e.currentTarget);
                    const data: UpdateProfileRequest = {
                        displayName: form.get("displayName") as string,
                        bio: form.get("bio") as string,
                    }
                    UserService.updateProfile(data).then(() => {
                        closePopup();
                    }).catch((err) => {
                        setError(err.message || "An error occurred while updating the profile");
                    });
                }}>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="displayName">Display name</Label>
                        </div>
                        <TextInput id="displayName" name="displayName" type="text" required />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="bio">Bio</Label>
                        </div>
                        <TextInput id="bio" name="bio" type="text" required />
                    </div>
                    {error && (
                        <p className="text-sm text-red-600">{error}</p>
                    )}
                    <Button type="submit" color="primary" className="w-full">
                        Update Profile
                    </Button>
                </form>
            </div>
        </>
    )
}