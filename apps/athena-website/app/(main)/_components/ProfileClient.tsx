"use client";

import ProfileFormClient from "@/app/_components/ProfileFormClient";
import { useAuth } from "@/context/AuthContext";
import { usePopup } from "@/context/PopupContext";
import { Avatar, Button, Dropdown } from "flowbite-react";

interface ProfileClientProps {
    onLogout?: () => void;
}

export default function ProfileClient({
    onLogout,
}: ProfileClientProps) {
    const auth = useAuth();
    const { openPopup } = usePopup();

    const showProfileForm = () => {
        openPopup(
            <ProfileFormClient />,
            "surface"
        );
    }

    return (
        <div className="inline-block">
            <Dropdown
                arrowIcon={false}
                inline
                label={
                    <div className="flex items-center space-x-2">
                        <Avatar
                            alt={auth.user?.displayName ?? "Profile"}
                            img={auth.user?.avatar}
                            rounded
                            title={auth.user?.displayName}
                        />
                        <span className="inline-block text-sm font-medium text-foreground">{auth.user?.displayName ?? "Guest"}</span>
                    </div>
                }
                placement="bottom-end"
            >
                <div className="bg-surface px-2 py-1">
                    <Button color="primary" onClick={showProfileForm}>Edit Profile</Button>
                </div>
                <div className="bg-surface px-2 py-1">
                    <Button color="primary" onClick={onLogout}>Logout</Button>
                </div>
            </Dropdown>
        </div>
    );
}