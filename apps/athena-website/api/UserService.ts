import { ContentTypes, FindOneUserResponse, FindUsersResponse, LoginRequest, LoginResponse, MeResponse, SignupRequest, SignupResponse, UpdateAvatarRequest, UpdateAvatarResponse, UpdateProfileRequest, UserUpdatedResponse } from "@athena/types"
import api from "./api"

export default class UserService {
  static async login(request: LoginRequest) {
    return await api.post<LoginResponse>('/auth/login', request)
      .then((response) => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  static async me() {
    return await api.get<MeResponse>('/user/me')
      .then((response) => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  static async logout() {
    return await api.post('/auth/logout')
  }

  static async updateProfile(request: UpdateProfileRequest) {
    return await api.patch<UserUpdatedResponse>('/user/profile', request)
      .then((response) => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  static async signUp(request: SignupRequest) {
    return await api.post<SignupResponse>('/auth/signup', request)
      .then((response) => {
        return response.data
      })
      .catch(error => {
        throw error
      })
  }

  static async fetchUserProfile(username: string) {
    return await api.get<FindOneUserResponse>('/user/profile/' + username)
      .then(resp => { return resp.data.data })
      .catch(error => { throw error; })
  }

  static async searchUsers(query: string) {
    return await api.get<FindUsersResponse>('/user/search?q=' + query)
      .then(resp => { return resp.data.data })
      .catch(error => { throw error })
  }

  static async updateAvatar(contentType: ContentTypes) {
    return await api.post<UpdateAvatarResponse>('/user/avatar', { contentType }).then(resp => { return resp.data }).catch(error => { throw error })

  }

}
