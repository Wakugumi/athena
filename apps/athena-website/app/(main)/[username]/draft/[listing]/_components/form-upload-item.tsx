import ListingService from "@/api/ListingService";
import { usePolling } from "@/app/_utils/polling.util";
import { mimeFromFilename } from "@/app/_utils/resolve-filetype.util";
import { getPublicBlobUrl } from "@/app/_utils/storage-url.util";
import { ListingItem } from "@athena/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Badge, Spinner } from "flowbite-react";
import { DragEvent, useEffect, useRef, useState } from "react";

interface Props {
  listingId: string,
}

export default function DraftFormUploadItem({
  listingId
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState("")

  const query = useQuery({
    queryKey: ['querydraft'],
    queryFn: () => ListingService.getMyDraft(listingId),
    refetchInterval: 1000,

  })
  const items = query.data?.items

  // MAIN FILE HANDLER
  const processFile = async (file: File) => {
    setDisabled(true);
    setProgress(0);

    try {

      const signed = await ListingService.uploadItem(mimeFromFilename(file.name)!, listingId)

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(signed?.method!, signed?.url!);

        for (const [k, v] of Object.entries(signed?.headers!)) {
          xhr.setRequestHeader(k, v);
        }

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => resolve();
        xhr.onerror = () => reject();
        xhr.send(file);
      });

      if (signed?.callback) {
        await axios.request({
          url: signed.callback.url,
          method: signed.callback.method
        })
      }



    }
    catch (error) {
      setError((error as any).response.data.message ?? (error as any).message ?? "Failed to process upload")
      setDisabled(false);
      setProgress(0);
      throw error
    }

    setDisabled(false);
    setProgress(0);
  };


  const handleFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (!file || disabled) return;
    processFile(file);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };


  return (
    <div className="space-y-4">
      {error && <div className="p-4 bg-red-700 text-red-50 rounded-lg">
        {error as string}</div>
      }
      {/* DROPZONE */}
      <div
        className={`border-2 border-dashed rounded p-10 text-center cursor-pointer transition
          ${dragActive ? "border-blue-500 bg-blue-50" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
      >
        {disabled ? <>Uploading {progress}% <Spinner color="success" /></> : "Drop file here or click to upload"}
      </div>

      {/* HIDDEN INPUT */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* PROGRESS */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="bg-blue-600 h-3 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* LIST */}
      <ul role="list" className="divide-y divide-default">
        {items?.length! <= 0 && <>No Items yet.</>}
        {items?.map((item, index) => (

          <li className="pb-4 sm:pb-4 inline-flex justify-between w-full" key={index}>
            <div className="w-[50%] space-y-4 overflow-x-clip">
              <a className="text-blue-400 hover:underline font-medium text-heading truncate" href={getPublicBlobUrl(item.blobKey!)} target="_blank">
                {item.title}
              </a>
              <p className="text-sm text-body truncate">
                {item.contentType}
              </p>
              <Badge className="justify-center" color={item.status === "READY" ? "success" : "warning"} size="sm">{item.status}</Badge>

            </div>
            <div className="w-[50%] flex flex-row justify-end space-x-1.5">
              <button data-tooltip-target="tooltip-remove-1" type="button" className="flex flex-row items-center justify-center gap-2 p-2 outline outline-red-700 text-red-700 rounded  hover:bg-red-200 focus:ring-4 focus:ring-neutral-tertiary font-medium leading-5 focus:outline-none">
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg>
                <span>Delete</span>
              </button>
              <div id="tooltip-remove-1" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm leading-4 font-medium text-white transition-opacity duration-300 bg-dark rounded-base shadow-xs force:opacity-0 tooltip">
                Remove
                <div className="tooltip-arrow" data-popper-arrow></div>
              </div>
            </div>


          </li>


        ))}
      </ul>

    </div>
  );


}
