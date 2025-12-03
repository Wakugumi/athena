import { useAuth } from "@/context/AuthContext";
import { PublicUser } from "@athena/types";
import { Avatar, Button, Modal, ModalHeader } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { HiUser } from "react-icons/hi";
import UpdateProfile from "./UpdateProfile";

interface Props {
  data: PublicUser;
  horizontal?: boolean;
  hideCTA?: boolean;
  href?: string
}
export default function ProfileCard(props: Props) {
  const { isAuth, user } = useAuth()
  const [updateProfile, setUpdateProfile] = useState(false)

  const baseStyle = `flex-col gap-4 flex items-stretch text-foreground ${props.horizontal ? "flex-row items-center" : 'flex-col'}`
  return (


    <>
      <div className={baseStyle}>

        <a className="shrink-0 flex">
          <Avatar rounded size={props.horizontal ? "lg" : "xl"} className="w-full h-auto object-cover shrink-0 flex-1" img={props.data.avatar}></Avatar>
        </a>
        <div className="space-y-2 flex flex-col">
          <div>
            <h1 className='text-2xl font-bold'>{props.data.displayName}</h1>
            <h4 className="text-lg ">{props.data.username}</h4>
          </div>

          {!props.hideCTA && (<> {isAuth() && user?.username == props.data.username ?

            <Button color="primary" onClick={() => setUpdateProfile(true)}>Update Profile</Button>
            :
            <Button color="primary">Follow</Button>}</>
          )
          }

          {!props.hideCTA && <p>{props.data.bio || "No bio."} </p>}


          <div className="flex flex-row gap-4">

            <span className="flex items-center justify-center gap-2 text-gray-400">
              <HiUser /> <span className="text-foreground">10</span> followers &#183; <span className="text-foreground">2</span> following</span>




          </div>
        </div>
      </div>


      <Modal show={updateProfile} dismissible onClose={() => setUpdateProfile(false)} size="xl">
        <ModalHeader>
          Update Profile</ModalHeader>
        <UpdateProfile />
      </Modal>
    </>

  )
}
