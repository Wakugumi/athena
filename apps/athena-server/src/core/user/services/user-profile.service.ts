import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { UpdateProfileDTO } from "../dtos/update-profile.dto";
import { UserException, UserExceptionCode } from "../user.exception";

@Injectable()
export class UserProfileService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {

  }
  private checkDefaultAvatar(url: string): boolean {
    if (url.startsWith("https://ui-avatars.com/api/")) {
      return true
    }
    return false
  }


  generateDefaultAvatar(firstName: string, lastName?: string): string {
    return `https://ui-avatars.com/api/?name=${firstName}${lastName ? `+${lastName}` : ""}`
  }


  async updateProfile(userId: string, dto: UpdateProfileDTO) {
    const entity = await this.userRepo.preload({ id: userId, ...dto });

    if (!entity) throw new UserException('User not exist', UserExceptionCode.USER_NOT_EXIST, "User does not exist, auth token may be broken, login again", HttpStatus.BAD_REQUEST)


    if (this.checkDefaultAvatar(entity.avatar)) {
      entity.avatar = this.generateDefaultAvatar(entity.firstName, entity.lastName)
    }
    return this.userRepo.save(entity)

  }

}
