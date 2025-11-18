import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateNoteFromImageCommand } from "../commands/create-note-from-image.command";
import { ImageAsNoteService } from "../services/image-as-note.service";

@CommandHandler(CreateNoteFromImageCommand)
export class CreateNoteFromImageHandler implements ICommandHandler<CreateNoteFromImageCommand> {
  constructor(private readonly imageAsNoteService: ImageAsNoteService) { }


  async execute(command: CreateNoteFromImageCommand): Promise<{ key: string, url: string }> {
    return await this.imageAsNoteService.uploadImage(command.userId, command.contentType)


  }
}
