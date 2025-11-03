import { UserRoutes } from "@athena/routes";
import { UpdateProfileRequest } from "../requests/user.request";
import { UserUpdatedResponse } from "../responses/user.response";

export interface UserContract {
  /**
  * PUT
  */
  [UserRoutes.PROFILE]: {
    req: UpdateProfileRequest,
    res: UserUpdatedResponse
  }
}
