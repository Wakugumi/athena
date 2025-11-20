import { LoginRequest, LoginResponse, MeResponse, SignupRequest, SignupResponse, UpdateProfileRequest, UserUpdatedResponse } from "@athena/types"
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
        return await api.put<UserUpdatedResponse>('/user/profile', request)
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
}