"use client";

import { useAuth } from "@/context/AuthContext";
import { Card } from "flowbite-react";

export default function UserOverview() {
  const { user } = useAuth()

  return <>

    <div className="flex flex-col items-stretch gap-8">
      <Card className="outline-primary text-foreground gap-8">
        <h2 className="text-lg font-medium">Bio</h2>
        <p>{user?.bio ?? <i>User has no bio.</i>}
        </p>
      </Card>

    </div>
  </>

}
