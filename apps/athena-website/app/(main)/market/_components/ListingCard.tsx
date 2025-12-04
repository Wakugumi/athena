import { Listing } from "@athena/types";
import { Avatar, Card } from "flowbite-react";
import { MarkdownPreview } from "./MarkdownPreview";
import { HiCheckCircle } from "react-icons/hi";

interface Props {
  data: Listing

}


export function ListingCard(props: Props) {


  return (

    <div className="flex flex-col h-[30vh] rounded-xl">
      {/* Preview */}
      <div className="min-h-0">
        <MarkdownPreview
          className="h-[20vh] overflow-y-auto rounded-xl"
          content={props.data.preview ?? props.data.summary}
        />
      </div>

      {/* Title */}
      <h5 className="flex-1 mt-2 text-sm font-medium text-foreground">
        {props.data.title.slice(0, 30)}
      </h5>

      {/* Price */}
      <div className="text-foreground font-bold text-sm">
        TOKEN {props.data.price}
      </div>

      {/* Author */}
      <div className="flex items-center gap-2 text-xs mt-1">
        <Avatar img={props.data.owner?.avatar ?? ""} rounded size="xs" />
        <span className="flex items-center gap-1">
          {props.data.owner?.displayName} <HiCheckCircle />
        </span>
      </div>
    </div>
  )
}
