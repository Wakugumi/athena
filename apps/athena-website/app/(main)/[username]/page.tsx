"use client";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "flowbite-react";
import { useParams } from "next/navigation";

export function UserPage() {

  const params = useParams()
  const user = u


  return (
    <div className="w-full max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex gap-4 items-center mb-8">
        <Avatar rounded size="lg" />
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p>{user.name}</p>
          <p className="mt-2">{user.bio}</p>
        </div>
      </div>


      {/* Listings */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Listings</h2>


        <div className="flex flex-col gap-4">
          {user.listings.map((listing) => (
            <div key={listing.id} className="border rounded p-4">
              <h3 className="text-lg font-medium">{listing.title}</h3>
              <p className="text-sm mt-1">{listing.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
