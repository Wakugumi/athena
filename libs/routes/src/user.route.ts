import { joinPath } from "./util/path";

export const UserBaseRoute = '/user';
export const UserRoutes = {
  PROFILE: joinPath(UserBaseRoute, "profile"),
}
