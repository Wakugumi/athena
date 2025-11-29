import { INestApplication } from '@nestjs/common'
import { Test } from "@nestjs/testing"
describe('authentication case', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
  })

})
