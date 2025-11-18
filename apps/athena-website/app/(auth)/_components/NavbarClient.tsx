"use client";

import Logo from "@/app/_components/Logo";
import { Navbar, NavbarBrand } from "flowbite-react";
import Link from "next/link";

export default function NavbarClient() {
    return (
        <>
            <Navbar fluid>
                <NavbarBrand as={Link} href="/" className="flex items-center">
                    <Logo variant="inline" />
                </NavbarBrand>
            </Navbar>
        </>
    )
}