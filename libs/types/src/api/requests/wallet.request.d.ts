import { ID } from "../../common/datatype.common";
export interface GetWalletBalanceRequest {
    walletId: ID;
}
export interface FindWalletLedgersQuery {
    walletId: ID;
    dateFrom?: string | null;
    dateTo?: string | null;
}
