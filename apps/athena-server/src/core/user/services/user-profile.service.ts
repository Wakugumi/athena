import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user.entity";
import { Repository } from "typeorm";
import { UpdateProfileDTO } from "../dtos/update-profile.dto";
import { UserException, UserExceptionCode } from "../user.exception";
import { ContentTypes, ListingStatus, NotificationCategory, PublicUser, UploadInstruction, UserWithoutPassword } from "@athena/types";
import { UploadService } from "src/engine/storage/services/upload.service";
import { UploadDomain } from "src/engine/storage/enums/upload-domain.enum";
import { UploadPurpose } from "src/engine/storage/enums/upload-purpose.enum";
import { FileUploadedEvent } from "src/engine/storage/events/file-uploaded.event";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { StorageEvents } from "src/engine/storage/enums/storage-events.enum";
import { StorageService } from "src/engine/storage/services/storage.service";
import { NotificationEvent } from "src/engine/notification/types/notification.constants";
import { NotificationEventPayload } from "src/engine/notification/types/notification.types";

@Injectable()
export class UserProfileService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>, private readonly uploadService: UploadService, private readonly storageService: StorageService, private readonly eventEmitter: EventEmitter2) {

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

  async getUser(userId: string): Promise<UserWithoutPassword> {
    const { passwordHash, ...user } = await this.userRepo.findOneByOrFail({ id: userId })

    return user as UserWithoutPassword
  }
  async getPublicUser(username: string): Promise<PublicUser | null> {
    return this.userRepo.createQueryBuilder('x').andWhere("x.username = :username", { username: username }).select(
      ['x.displayName', 'x.avatar', 'x.bio', 'x.createdAt', 'x.username'])
      .leftJoinAndSelect('x.listings', 'l', 'l.status = :status', { status: ListingStatus.PUBLISHED }).getOne();
  }

  async searchUser(query: string): Promise<PublicUser[] | null> {
    return this.userRepo.createQueryBuilder('x')
      .where('x.username ILIKE :username', { username: `%${query}%` })
      .orWhere('x.displayName ILIKE :q', { q: `%${query}%` })
      .select(['x.id', 'x.displayName', 'x.avatar', 'x.bio', 'x.createdAt', 'x.username'])
      .leftJoinAndSelect('x.listings', 'l').
      getMany()
  }


  async updateAvatar(userId: string, contentType: ContentTypes): Promise<UploadInstruction> {
    return await this.uploadService.createUpload({
      contentType: contentType,
      domain: UploadDomain.USER,
      purpose: UploadPurpose.AVATAR,
      referenceId: userId
    })

  }

  @OnEvent(StorageEvents.FILE_UPLOADED)
  async handleAvatarUpdate(event: FileUploadedEvent) {
    if (event.domain !== UploadDomain.USER && event.purpose !== UploadPurpose.AVATAR) return;
    const job = await this.uploadService.lookupJob(event.uploadId)
    const url = this.storageService.getUrl({ key: job.key })

    await this.userRepo.update({ id: job.referenceId }, { avatar: url })

    this.eventEmitter.emit(NotificationEvent.FIRE, new NotificationEventPayload(job.referenceId, NotificationCategory.USER, "Avatar has been updated"))

  }
}
