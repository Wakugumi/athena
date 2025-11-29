import { Controller, Param, Post } from "@nestjs/common";
import { UploadService } from "../services/upload.service";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {

  }


  @Post(":uploadId")
  @ApiBearerAuth()
  @ApiParam({ name: 'uploadId', description: "id of the upload job to be mark" })
  async complete(@Param("uploadId") uploadId: string) {
    const result = await this.uploadService.markComplete(uploadId);
    if (result.affected)
      return "Upload job marked as completed"

    else
      return "No job found or marked"

  }




}
