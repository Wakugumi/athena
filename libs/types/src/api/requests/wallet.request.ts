import { ID } from "../../common/datatype.common";

export interface GetWalletBalanceRequest {
  walletId: ID;
}

export interface FindWalletLedgersQuery {
  walletId: ID;
  /**
  * in Date format, no time
  */
  dateFrom?: string | null

  /**
  * in Date format, no time
  */
  dateTo?: string | null;


}

