import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LedgerService } from 'src/core/ledger/services/ledger.service'
import { TokenLedger } from '../entities/token-ledger.entity';
import { Wallet } from 'src/core/wallet/entities/wallet.entity';
import { TokenLedgerReferenceType, TokenLedgerType, WalletOwnerType } from '@athena/types';
import { LedgerException, LedgerExceptionCode } from '../ledger.exception';
import { mock } from 'node:test';
describe('Ledger service', () => {

  let ledger: LedgerService;
  let repo = {
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getRawOne: jest.fn()


  }

  let walletMock: Partial<Wallet> = {
    id: "d99bbf70-ae87-4a44-94e5-c7bc15348904",
    balance: 0,
    ownerId: "1",
    ownerType: WalletOwnerType.USER,
  }


  beforeEach(async () => {
    let module = await Test.createTestingModule({
      providers: [
        LedgerService,
        {
          provide: getRepositoryToken(TokenLedger),
          useValue: repo
        }
      ]


    }).compile()

    ledger = module.get(LedgerService);
    repo = module.get(getRepositoryToken(TokenLedger))

    jest.clearAllMocks()
  })



  it('should be defined', () => {
    expect(ledger).toBeDefined()
  })


  describe('get balance operation', () => {

    it('should get balance', async () => {
      const sumMock = { sum: "500" }
      repo.getRawOne.mockResolvedValueOnce(sumMock)

      const sum = await ledger.getBalance(walletMock.id!)

      expect(sum).toEqual(500)
    });

    it('should return zero when query misvalue', async () => {
      const returnMock = { sum: null }
      repo.getRawOne.mockResolvedValueOnce(returnMock)
      const sum = await ledger.getBalance(walletMock.id!)
      expect(sum).toEqual(0)
    })

  });

  describe('assert balance operation', () => {

    let mockBalance = 500
    beforeEach(() => {
      repo.getRawOne.mockResolvedValueOnce({ sum: mockBalance })
      jest.clearAllMocks()
    })

    it('should pass assert balance', async () => {

      expect(await ledger.assertBalance(walletMock.id!, mockBalance - 200)).toBeUndefined()

    })

    it('should throw error if assert balance returns false', async () => {
      expect.assertions(2);
      try {
        await ledger.assertBalance(walletMock.id!, mockBalance + 200);
      } catch (error) {
        expect(error).toBeInstanceOf(LedgerException);
        expect((error as LedgerException).code).toBe(LedgerExceptionCode.INSUFFICIENT_BALANCE)
      }
    })

  })

  describe('transfer operation', () => {
    let wallet1 = {
      ...walletMock,
      balance: 500,
      id: '70129dae-16c4-4d49-8ca3-e37a597925db'
    }
    let wallet2 = {
      ...walletMock,

      id: '2e9b2697-eb23-4d40-9921-fbd1640af56e'
    }

    it('should transfer from wallet to wallet', async () => {
      let amount = 200;
      let mockRefId = 'ff8ff32e-c53b-4ea0-924f-f84e9a0127a3'

      repo.getRawOne.mockResolvedValueOnce({ sum: wallet1.balance });

      repo.save.mockResolvedValueOnce({})

      repo.save.mockResolvedValueOnce({})

      await ledger.transfer(wallet1.id, wallet2.id, amount, TokenLedgerReferenceType.ORDER, mockRefId);

      expect(repo.getRawOne).toHaveBeenCalled()

      expect(repo.save).toHaveBeenCalledWith({
        amount: -amount,
        walletId: wallet1.id,
        type: TokenLedgerType.DEBIT,
        referenceType: TokenLedgerReferenceType.ORDER,
        referenceId: mockRefId
      })

      expect(repo.save).toHaveBeenCalledWith({
        amount: amount,
        walletId: wallet2.id,
        type: TokenLedgerType.CREDIT,
        referenceType: TokenLedgerReferenceType.ORDER,
        referenceId: mockRefId
      })

    })

  })
})
