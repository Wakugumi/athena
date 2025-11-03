export class StoragePath {
  private static base: string = '/';

  static joinPaths(...paths: string[]) {
    return paths
      .map((p) => p.replace(/^\/+|\/+$/g, '')) // trim leading/trailing slashes
      .filter((p) => p.length > 0) // remove empty segments
      .join('/');
  }

  static userBase() {
    return this.joinPaths(this.base, 'user');
  }

  static userAvatar(userId: string, filename?: string): string {
    return this.joinPaths(this.userBase(), 'avatar', userId, filename ?? '');
  }
}
