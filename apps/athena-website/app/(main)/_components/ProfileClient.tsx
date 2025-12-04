"use client";

import ProfileFormClient from "@/app/_components/ProfileFormClient";
import { useAuth } from "@/context/AuthContext";
import { usePopup } from "@/context/PopupContext";
import { useNotifications } from "@/hooks/useNotifications";
import { Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { HiBell, HiDocument, HiLogout, HiShoppingCart } from "react-icons/hi";
import NotificationCenter from "./NotificationCenter";
import { NotificationBadge } from "./NotificationBadge";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import WalletCard from "./WalletCard";
import Link from "next/link";

interface ProfileClientProps {
  onLogout?: () => void;
}

export default function ProfileClient({
  onLogout,
}: ProfileClientProps) {
  const auth = useAuth();
  const { openPopup } = usePopup();
  const notif = useNotifications()
  const router = useRouter()

  const onProfile = useCallback(() => {

    router.push(`/${auth.user!.username}`)
  }, [auth.user])

  return (
    <div className="flex items-center gap-4">
      <Dropdown
        inline
        label={<><NotificationBadge /></>}>
        <NotificationCenter />

      </Dropdown>
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
            <span className="hidden md:inline-block text-sm font-medium text-foreground">{auth.user?.displayName ?? "Guest"}</span>
          </div>
        }
        placement="bottom-end"

        className="overflow-y-auto bg-surface shadow-lg rounded-lg border"
      >
        <DropdownHeader className="flex items-center gap-2" onClick={onProfile}>
          <Avatar img={auth.user?.avatar} rounded title={auth.user?.displayName} size="sm" />
          <span>{auth.user?.displayName}</span>
        </DropdownHeader>

        <DropdownDivider />
        <div className="p-4">
          <WalletCard />
        </div>



        <DropdownDivider />
        <DropdownItem icon={HiShoppingCart} as={Link} href={`/${auth.user?.username}?tab=listings`}>My Listing</DropdownItem>
        <DropdownItem icon={HiDocument} as={Link} href={`/${auth.user?.username}?tab=drafts`}>My Drafts</DropdownItem>


        <DropdownDivider />


        <DropdownItem icon={HiLogout} onClick={onLogout}>Sign out</DropdownItem>

      </Dropdown>
    </div>
  );
}
