import { Injectable } from "@nestjs/common";

abstract class TokenAvoidlist {
  abstract add(token: string): void;
  abstract has(token: string): boolean;
  abstract remove(token: string): void
}

@Injectable()
export class TokenAvoidlistService extends TokenAvoidlist {
  private avoidlist: Set<string>;
  constructor() {
    super()
    this.avoidlist = new Set<string>();
  }

  add(token: string): void {
    this.avoidlist.add(token)
  }

  has(token: string): boolean {
    return this.avoidlist.has(token)
  }

  remove(token: string): void {
    this.avoidlist.delete(token)
  }


}
