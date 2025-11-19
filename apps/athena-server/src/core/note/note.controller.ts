import { Body, Controller, Post, Sse, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiSchema } from "@nestjs/swagger";
import { Observable } from "rxjs";
import { CurrentUser } from "src/engine/auth/decorators/current-user.decorator";
import { JwtAuthGuard } from "src/engine/auth/guards/auth-jwt.guard";
import { User } from "../user/user.entity";
import { CommandBus } from "@nestjs/cqrs";
import { CreateNoteFromImageCommand } from "./commands/create-note-from-image.command";
import { CreatePhotonoteDto } from "./dtos/create-photonote.input";

@UseGuards(JwtAuthGuard)
@Controller('note')
export class NoteController {
  constructor(private commandBus: CommandBus) { }

  @Sse('sse')
  sse(): Observable<MessageEvent> {

  }


  @Post('photonote/create')
  @ApiOperation({ description: 'Initate creation of new note by uploading image that will be transformed into Note. Return URL for upload' })
  @ApiResponse({ description: "Signed URL for upload. Listen SSE for callback" })
  @ApiBearerAuth()
  async createPhotonote(@CurrentUser() user: User, @Body() dto: CreatePhotonoteDto) {
    this.commandBus.execute(
      new CreateNoteFromImageCommand(user.id, dto.contentType)
    )

  }
}
