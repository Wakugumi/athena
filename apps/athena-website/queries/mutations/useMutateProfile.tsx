import UserService from "@/api/UserService";
import { UpdateProfileRequest } from "@athena/types";
import { useMutation } from "@tanstack/react-query";

export default function useMutateProfile() {
  return useMutation({
    mutationKey: ["profile"],
    mutationFn: (payload: UpdateProfileRequest) => UserService.updateProfile(payload),
    onError: (error) => { throw error }

  })
}
