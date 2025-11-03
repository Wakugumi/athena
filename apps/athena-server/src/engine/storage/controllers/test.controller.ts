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
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';
import { StorageService } from '../services/storage.service';

class UploadBase64Dto {
  filename: string;
  folder?: string;
  // base64 encoded string
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

  // multipart/form-data upload (field name: file)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMultipart(
    @UploadedFile() file: any,
    @Body('folder') folder?: string,
  ) {
    if (!file) throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);

    try {
      const result = await this.storageService.write({
        file: file.buffer,
        name: file.originalname,
        folder: folder || '',
        mimeType: (file.mimetype as any) || undefined,
      });
      return { success: true, result };
    } catch (err) {
      throw new HttpException((err as any)?.message || String(err), HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // JSON base64 upload
  @Post('upload/base64')
  async uploadBase64(@Body() body: UploadBase64Dto) {
    const { filename, folder, file } = body as UploadBase64Dto;
    if (!filename || !file) throw new HttpException('filename and file are required', HttpStatus.BAD_REQUEST);

    try {
      const buffer = Buffer.from(file, 'base64');
      const result = await this.storageService.write({
        file: buffer,
        name: filename,
        folder: folder || '',
        mimeType: undefined,
      });
      return { success: true, result };
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
      const url = await this.storageService.getUrl({ key, signed: signed === 'true', expiresInSeconds: expiresIn ? Number(expiresIn) : undefined });
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
