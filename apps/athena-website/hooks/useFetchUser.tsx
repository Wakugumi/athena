import UserService from "@/api/UserService";
import { useEffect } from "react";

export function useFetchUser() {
  const [user, setUser] = user;

  useEffect(() => {

    setUser(

      (async () => {
        await UserService.get
      })()
    )
  })
}
