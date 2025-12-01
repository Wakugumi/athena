import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, DeepPartial } from "typeorm";
import { SignupPayload } from "../dtos/signup.input";
import { AuthException, AuthExceptionCode } from "../auth.exception";
import { User } from "src/core/user/user.entity";
import { hashPassword } from "../utils/auth.util";
import { UserProfileService } from "src/core/user/services/user-profile.service";
import { WalletService } from "src/core/wallet/services/wallet.service";
import { WalletOwnerType } from "@athena/types";
import { EventEmitter2 } from "@nestjs/event-emitter";

@Injectable()
export class SignupService {

  constructor(
    private readonly profileService: UserProfileService,
    @InjectDataSource() private datasource: DataSource,
    private readonly wallet: WalletService,
    private readonly eventEmitter: EventEmitter2) { }


  async signup(payload: SignupPayload) {


    return await this.datasource.transaction(async (manager) => {

      const existing = await manager.findOne(User, {
        where: [
          { username: payload.username },
          {
            email: payload.email
          }
        ]
      })

      if (existing) {
        throw new AuthException("User already exist", AuthExceptionCode.ALREADY_EXISTS, "User already exist", HttpStatus.BAD_REQUEST)
      }




      const newUser = manager.create(User, {
        username: payload.username,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        avatar: this.profileService.generateDefaultAvatar(payload.firstName, payload.lastName),
        displayName: payload.displayName ?? payload.username,
        passwordHash: await hashPassword(payload.password)
      });
      const savedUser = await manager.save(User, newUser);

      await this.wallet.createWallet(savedUser.id, WalletOwnerType.USER)

      /**
       * TODO: fire event on signup
        */
      return savedUser;

    })


  }
}
