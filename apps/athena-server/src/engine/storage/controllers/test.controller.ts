import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Query,
  Res,
  HttpStatus,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from '../services/storage.service';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';

class UploadBase64Dto {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  folder?: string;
  // base64 encoded string
  @ApiProperty()
  file: string;
}

class MoveCopyDto {
  from: string; // key like 'folder/file.txt' or 'file.txt'
  to: string;
}

@Controller('storage')
export class StorageTestController {
  constructor(private readonly storageService: StorageService) { }

  private splitKey(key: string) {
    const normalized = key.replace(/^\/+|\/+$/g, '');
    const lastSlashIdx = normalized.lastIndexOf('/');
    if (lastSlashIdx === -1) return { folder: '', name: normalized };
    return {
      folder: normalized.substring(0, lastSlashIdx),
      name: normalized.substring(lastSlashIdx + 1),
    };
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload a file with a storage key',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        key: {
          type: 'string',
          description: 'The storage/blob key to store the file under',
        },
      },
      required: ['file', 'key'],
    },
  })
  async uploadMultipart(
    @UploadedFile() file: any,
    @Body('key') key: string,
  ) {
    if (!file) throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    if (!key) throw new HttpException('No key provided', HttpStatus.BAD_REQUEST);

    try {
      const result = await this.storageService.write({
        file: file.buffer,
        name: key,          // Use the key as the storage name
        folder: '',         // optional, if you still want folder logic
        mimeType: file.mimetype || undefined,
      });
      return { success: true, result };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // JSON base64 upload
  @Post('upload/base64')
  @ApiBody({ type: UploadBase64Dto })
  @UsePipes(new ValidationPipe())
  async uploadBase64(@Body() body: UploadBase64Dto) {
    console.log(body)

    try {
      let key = 'test/test/' + randomUUID()
      const { folder, name } = this.storageService.splitKey(key)
      const result = await this.storageService.write({
        file: randomUUID(),
        name: name,
        folder: folder,
        mimeType: undefined,
      });
      return { key };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Read/stream a file by key (folder/name)
  @Get('read/:key')
  async read(@Param('key') key: string, @Res({ passthrough: true }) res: Response) {
    const { folder, name } = this.splitKey(key);
    try {
      const stream = await this.storageService.read({ folderPath: folder, filename: name });
      if (!stream) throw new HttpException('Not found', HttpStatus.NOT_FOUND);

      // Convert to Node Readable if necessary
      const nodeStream: NodeJS.ReadableStream = (stream as unknown) as NodeJS.ReadableStream;
      res.status(HttpStatus.OK);
      return new StreamableFile(nodeStream as any);
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('exists/:key')
  async exists(@Param('key') key: string) {
    try {
      const exists = await this.storageService.exists(key);
      return { exists };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':key')
  async delete(@Param('key') key: string) {
    const { folder, name } = this.splitKey(key);
    try {
      await this.storageService.delete({ folderPath: folder, filename: name });
      return { success: true };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // get url (public or signed) e.g. /storage/url?key=folder/file.txt&signed=true&expiresIn=3600
  @Get('url')
  async getUrl(@Query('key') key: string, @Query('signed') signed?: string, @Query('expiresIn') expiresIn?: string) {
    if (!key) throw new HttpException('key query param required', HttpStatus.BAD_REQUEST);
    try {
      const url = this.storageService.getUrl({ key: key });
      return { url };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('move')
  async move(@Body() body: MoveCopyDto) {
    const { from, to } = body;
    if (!from || !to) throw new HttpException('from and to are required', HttpStatus.BAD_REQUEST);
    const fromKey = this.splitKey(from);
    const toKey = this.splitKey(to);
    try {
      await this.storageService.move({ from: { folderPath: fromKey.folder, filename: fromKey.name }, to: { folderPath: toKey.folder, filename: toKey.name } });
      return { success: true };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('copy')
  async copy(@Body() body: MoveCopyDto) {
    const { from, to } = body;
    if (!from || !to) throw new HttpException('from and to are required', HttpStatus.BAD_REQUEST);
    const fromKey = this.splitKey(from);
    const toKey = this.splitKey(to);
    try {
      await this.storageService.copy({ from: { folderPath: fromKey.folder, filename: fromKey.name }, to: { folderPath: toKey.folder, filename: toKey.name } });
      return { success: true };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
