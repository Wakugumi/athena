import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateNoteFromImageCommand } from "../commands/create-note-from-image.command";
import { ImageAsNoteService } from "../services/image-as-note.service";
import { UploadInstruction } from "@athena/types";

@CommandHandler(CreateNoteFromImageCommand)
export class CreateNoteFromImageHandler implements ICommandHandler<CreateNoteFromImageCommand> {
  constructor(private readonly imageAsNoteService: ImageAsNoteService) { }


  async execute(command: CreateNoteFromImageCommand): Promise<UploadInstruction> {
    return await this.imageAsNoteService.uploadImage(command.userId, command.contentType)


  }
}
