import { Listing } from "@athena/types";
import { Avatar, Card } from "flowbite-react";
import { MarkdownPreview } from "./MarkdownPreview";

interface Props {
  data: Listing

}


export function ListingCard(props: Props) {


  return (
    <Card className="max-w-sm" renderImage={() => <MarkdownPreview content={props.data.preview ?? props.data.summary} />}>


      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.data.title}
      </h5>
      <Avatar img={props.data.owner?.avatar ?? ""} rounded>
        <div className="space-y-1 font-medium dark:text-white">
          <div>{props.data.owner?.displayName}</div>
        </div>
      </Avatar>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {props.data.description?.slice(0, 50) ?? ""}
      </p>
    </Card>
  )
}
