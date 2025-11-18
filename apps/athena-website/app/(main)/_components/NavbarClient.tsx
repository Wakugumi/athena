"use client";

import Link from "next/link";
import Logo from "@/app/_components/Logo";
import { Navbar, NavbarToggle, NavbarCollapse, NavbarLink, NavbarBrand, Button } from "flowbite-react";
import { useAuth } from "@/context/AuthContext";
import ProfileClient from "./ProfileClient";

export default function NavbarClient() {
    const auth = useAuth();
    if (auth.checkAuth()) {
        return (
            <>
                <Navbar fluid className="fixed inset-x-0 top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
                    <NavbarBrand as={Link} href="/" className="flex items-center">
                        <Logo variant="inline" />
                    </NavbarBrand>

                    <div className="flex items-center gap-2 md:order-2">
                        <ProfileClient onLogout={auth.logout}/>
                        <NavbarToggle />
                    </div>
                    <NavbarCollapse>
                        <NavbarLink href="/">Home</NavbarLink>
                        <NavbarLink href="/market">Market</NavbarLink>
                        <NavbarLink href="/pricing">Pricing</NavbarLink>
                    </NavbarCollapse>
                </Navbar>
            </>
        );  
    } else {
        return (
            <>
                <Navbar fluid className="fixed inset-x-0 top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">
                    <NavbarBrand as={Link} href="/" className="flex items-center">
                        <Logo variant="inline" />
                    </NavbarBrand>
    
                    <div className="flex items-center gap-2 md:order-2">
                        <Link href="/login">
                            <Button color="light" size="sm">Sign in</Button>
                        </Link>
                        <Link href="/register">
                            <Button color="primary" size="sm">Get started</Button>
                        </Link>
                        <NavbarToggle />
                    </div>
    
                    <NavbarCollapse>
                        <NavbarLink href="/">Home</NavbarLink>
                        <NavbarLink href="/market">Market</NavbarLink>
                        <NavbarLink href="/pricing">Pricing</NavbarLink>
                    </NavbarCollapse>
                </Navbar>
            </>
        );  
    }
}