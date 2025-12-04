"use client";

import UserService from "@/api/UserService";
import Loading from "@/app/loading";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card } from "flowbite-react";
import { useParams } from "next/navigation";

export default function UserOverview() {
  const { username } = useParams()
  const query = useQuery({
    queryKey: ['fetchUser'],
    queryFn: () => UserService.fetchUserProfile(username as string)

  })

  return <>

    <div className="flex flex-col items-stretch gap-8">
      <Card className="outline-primary text-foreground gap-8">
        <h2 className="text-lg font-medium">Bio</h2>
        {query.isLoading && <Loading />}
        <p>{query.data?.bio ?? <i>User has no bio.</i>}
        </p>
      </Card>

    </div>
  </>

}
