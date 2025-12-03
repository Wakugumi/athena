import WalletService from "@/api/WalletService";
import { useAuth } from "@/context/AuthContext";
import { Button, Spinner } from "flowbite-react";
import { useState } from "react";
import { HiWallet } from "react-icons/hi2";

interface Props {
  onUpdate?: () => void;
}

enum Status {
  IDLE,
  FETCHING,
  READY,
  ERROR

}
export default function WalletCard(props: Props) {
  const [balance, setBalance] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>(Status.IDLE)
  const [error, setError] = useState("")
  const [updated, setUpdated] = useState<Date | null>(null)
  const { isAuth } = useAuth()

  const handleFetch = async () => {
    setStatus(Status.FETCHING)
    try {

      const result = await WalletService.fetchWallet();
      setBalance(Number(result?.balance))
      setUpdated(new Date(result?.updatedAt!))

    } catch (error) {
      setError((error as any).response.data.message ?? (error as any).message ?? "Failed fetch balance")
      setStatus(Status.ERROR)
      throw error;
    } finally {
      setStatus(Status.READY)
    }
  }

  if (!isAuth())
    return <></>

  return (

    <div className="flex flex-col gap-4 p-4 shadow-lg rounded-lg bg-slate-200">

      <span className="flex items-center justify-start gap-2 text-foreground"><HiWallet /> Your Wallet</span>

      {status == Status.IDLE && <Button className="outline outline-slate-600 text-slate-600 hover:bg-slate-600 hover:text-slate-100" onClick={() => handleFetch()}>Fetch Balance</Button>}
      {status == Status.FETCHING && <>
        <div>Fetching... <Spinner color="gray" /></div>
      </>}
      {status === Status.READY && <span className="text-lg text-center text-primary font-bold">{balance}</span>}
      {status === Status.ERROR && <span className="p-4 rounded shadow bg-red-700 text-red-100">{error}</span>}


      {updated && <small className="text-sm italic text-slate-500">Last fetched: {updated.toUTCString()}</small>}


    </div>


  )
}
