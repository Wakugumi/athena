import { AuthRoutes } from '@athena/routes'
import { LoginRequest, SignupRequest } from '../requests/auth.request'
import { LoginResponse, LogoutResponse, MeResponse, SignupResponse } from '../responses/auth.response'
export interface AuthContract {
  /**
   * POST
   */
  [AuthRoutes.SIGNUP]: {
    req: SignupRequest,
    res: SignupResponse
  },

  /**
   * POST
   */
  [AuthRoutes.LOGIN]: {
    req: LoginRequest,
    res: LoginResponse
  },

  /**
   * POST
   * requires Bearer auth header
   */
  [AuthRoutes.LOGOUT]: {

    req: null,

    res: LogoutResponse
  }
  /**
  * GET
  * requires Bearer auth header
  */
  [AuthRoutes.ME]: {
    req: null,
    res: MeResponse
  }
}
