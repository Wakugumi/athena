"use client";

import Link from "next/link";
import Logo from "@/app/_components/Logo";
import { Navbar, NavbarToggle, NavbarCollapse, NavbarLink, NavbarBrand, Button } from "flowbite-react";
import { useAuth } from "@/context/AuthContext";
import ProfileClient from "./ProfileClient";
import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import SearchBar from "./SearchBar";

export default function NavbarClient() {
  const auth = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const segments = usePathname().split('/').filter(Boolean);
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return { label: decodeURIComponent(seg), href };
  });
  const lastCrumb = useMemo(() =>
    (<Link className="md:hidden block" href={crumbs.at(crumbs.length - 1)?.href ?? ""}>{crumbs.at(crumbs.length - 1)?.label.slice(0, 10)}</Link>)
    , [crumbs])

  useEffect(() => {
    const checkAuthentication = async () => {
      const authenticated = await auth.checkAuth();
      setIsAuthenticated(authenticated);
    }
    checkAuthentication();
  }, [auth]);

  return (
    <>
      <Navbar fluid className="fixed inset-x-0 top-0 z-50 bg-surface/95 backdrop-blur border-b border-border">

        <NavbarToggle className="md:hidden block" />
        <div className="flex items-center gap-1">        <NavbarBrand as={Link} href="/" >
          <Logo variant="inline" />
        </NavbarBrand>

          {crumbs.map(c => (
            <span key={c.href} className="hidden md:flex gap-1">
              / <Link href={c.href}>{c.label}</Link>
            </span>
          ))}

          {lastCrumb}
        </div>



        {isAuthenticated &&
          <div className="flex items-center gap-2 md:order-2">
            <ProfileClient onLogout={auth.logout} />
          </div>
        }

        {!isAuthenticated &&
          <div className="flex items-center gap-2 md:order-2">
            <Link href="/login">
              <Button color="light" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button color="primary" size="sm">Get started</Button>
            </Link>
          </div>

        }


        <NavbarCollapse>
          <SearchBar />

        </NavbarCollapse>
      </Navbar>
    </>
  );
}
