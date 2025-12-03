import { Listing } from "@athena/types";
import { Avatar, Card } from "flowbite-react";
import { MarkdownPreview } from "./MarkdownPreview";
import { HiCheckCircle } from "react-icons/hi";

interface Props {
  data: Listing

}


export function ListingCard(props: Props) {


  return (
    <div className="flex flex-col text-foreground h-[40vh] space-y-4">
      <div className="h-[50%] w-full overflow-y-scroll">
        <MarkdownPreview content={props.data.preview ?? props.data.summary} />
      </div>


      <div className="h-[50%] p-2 space-y-2">
        <h5 className="text-sm tracking-tight text-foreground">
          {props.data.title}
        </h5>
        <div className="text-foreground font-bold">{props.data.currency} {props.data.price}</div>

        <div className="flex flex-row items-center gap-2">
          <Avatar img={props.data.owner?.avatar ?? ""} rounded size="xs" />
          <span className="flex items-center gap-2 text-xs">{props.data.owner?.displayName} <HiCheckCircle /></span>
        </div>
      </div>
    </div>
  )
}
