import { FetchWalletResponse } from '@athena/types'
import api from './api'
export default class WalletService {
  static async fetchWallet() {

    return await api.get<FetchWalletResponse>('/wallet')
      .then(response => { return response.data.data })
      .catch(error => { throw error })
  }


}
