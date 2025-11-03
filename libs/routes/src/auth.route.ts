import { ApiPrefix } from "./common/api-base"
import { joinPath } from "./util/path"

export const AuthBaseRoute = `/auth`
export const AuthRoutes = {
  ME: joinPath(AuthBaseRoute, "me"),
  LOGIN: joinPath(AuthBaseRoute, "login"),
  SIGNUP: joinPath(AuthBaseRoute, "signup"),
  LOGOUT: joinPath(AuthBaseRoute, 'logout')

}
