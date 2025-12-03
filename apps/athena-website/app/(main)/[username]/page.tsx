"use client";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { UserPageTabs, UserPageTabsOrder } from "./_types/UserPageTabs.enum";
import UserOverview from "./_tabs/Overview";
import UserListings from "./_tabs/Listings";
import { PublicUser } from "@athena/types";
import { useEffect, useMemo, useState } from "react";
import UserService from "@/api/UserService";
import Loading from "@/app/loading";
import ProfileCard from "./_components/ProfileCard";
import { TabItem, Tabs } from "flowbite-react";
import { HiDocument, HiShoppingCart, HiUserCircle } from "react-icons/hi";
import NotFound from "@/app/not-found";
import UserDrafts from "./_tabs/Drafts";
import { useAuth } from "@/context/AuthContext";

export default function UserPage() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || UserPageTabs.HOME
  const params = useParams();
  const { username } = params;
  const [user, setUser] = useState<PublicUser>()
  const { user: authedUser } = useAuth();
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")



  const OverviewTab = useMemo(() => <UserOverview />, [])
  const ListingTab = useMemo(() => <UserListings />, [])

  const DraftsTab = useMemo(() => <UserDrafts />, [])


  useEffect(() => {

    setLoading(true);
    (async () => {

      try {

        setUser(
          (await UserService.fetchUserProfile(params.username as string))!
        )
      }
      catch (error) {
        setError(error as string)

      } finally {
        setLoading(false)
      }

    })()

    return () => {
      setLoading(false)
    }
  }, [])


  if (loading)
    return (
      <Loading />
    )



  const link = (t: string) => t != "" ? `/${username}?tab=${t}` : `/${username}`;

  const tabChange = (tab: number) => {

    router.push(link(UserPageTabsOrder[tab]))

  }

  if (user)
    return (
      <>


        <section className="bg-background text-foreground min-h-screen" id="user">

          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-[30%]">
                <ProfileCard data={user} href={`/${user.username}`} />

              </div>


              <div className="md:w-[70%]">

                <nav className=" text-foreground">
                  <Tabs variant="underline" onActiveTabChange={(tab) => tabChange(tab)}>
                    <TabItem icon={HiUserCircle} active={tab === UserPageTabs.HOME} title={<>Overview</>} />
                    <TabItem icon={HiShoppingCart} active={tab === UserPageTabs.LISTINGS} title={<>Listings</>} />
                    {authedUser?.username === username &&

                      <TabItem icon={HiDocument} active={tab === UserPageTabs.DRAFTS} title={<>My Drafts</>} />
                    }

                  </Tabs>
                </nav>
                {
                  tab === UserPageTabs.HOME && OverviewTab
                }
                {tab === UserPageTabs.LISTINGS && ListingTab}

                {tab === UserPageTabs.DRAFTS && DraftsTab}
              </div>

            </div>
          </div>
        </section>
      </>
    )


  return <NotFound />

}
