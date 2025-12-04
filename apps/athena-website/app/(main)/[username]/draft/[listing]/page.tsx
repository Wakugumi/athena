"use client";
import ListingService from "@/api/ListingService";
import { License, Listing } from "@athena/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MarkdownPreview } from "@/app/(main)/market/_components/MarkdownPreview";
import { useFormListing } from "./_components/form-listing";
import { Avatar, Badge, Button, Dropdown, HR, Label, Modal, ModalBody, ModalFooter, ModalHeader, Select, Spinner, Textarea, TextInput } from "flowbite-react";
import ProfileCard from "../../_components/ProfileCard";
import Loading from "@/app/loading";
import DraftFormUploadItem from "./_components/form-upload-item";
import { toSlug } from "@/app/_utils/slugify.util";
import useMutatePublish from "@/queries/mutations/useMutatePublish";
import { useQuery, useQueryErrorResetBoundary } from "@tanstack/react-query";

export default function DraftListingPage() {


  const search = useSearchParams()
  const { username, listing: urlSlug } = useParams()
  const [modalPublish, setModalPublish] = useState<boolean>(false)
  const listingId = search.get('id')
  const { form, updateField, loading: formLoading, saving, error: formError, synced } = useFormListing(listingId!)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);

  const router = useRouter()

  const query = useQuery({
    queryKey: [`fetchDraft`],
    queryFn: () => ListingService.getMyDraft(listingId!),
    refetchInterval: 2000
  })
  const listing = query.data

  const mutation = useMutatePublish({
    onSettled: (data) => {
      console.log(data)

      router.push(`/${username}/${toSlug(data.title as string)}?id=${data.id}`)
    }
  })


  useEffect(() => {
    setError(formError ?? "")

    setLoading(formLoading)
  }, [formError, saving, synced, formLoading])



  if (!listing)
    return <>{query.status}</>
  if (loading)
    return (
      <Loading />
    )




  if (mutation.isPending)
    return <Loading />


  return (
    <>
      <div className="mb-6 flex flex-col items-stretch space-y-6 sticky top-6 md:top-24 bg-background text-foreground z-10">
        <h1 className="text-2xl text-foreground">Draft Form</h1>

        {error &&
          <div className="mb-6 bg-red-700 text-red-50 p-4 rounded">
            {error}
          </div>
        }
        {mutation.isError &&
          <div className="mb-6 bg-red-700 text-red-50 p-4 rounded">
            {mutation.error.message}
          </div>
        }
        {saving &&
          <div className="mb-6 border border-foreground p-4 rounded text-foreground flex items-center gap-4">
            Saving...
            <Spinner aria-label="Loading" size="lg" color="success" />
          </div>
        }
        {synced &&
          <div className="mb-6 bg-green-700 text-green-50 p-4 rounded">
            Synchornized
          </div>
        }
      </div>

      <HR />
      <h1 className="text-xl mb-6 text-foreground">Markdown Preview</h1>
      <div id="preview" className="rounded-xl border shadow text-foreground p-8">
        <MarkdownPreview content={listing?.preview ?? "***No Preview***"} />
      </div>

      <ProfileCard data={listing?.owner!} horizontal={true} hideCTA={true} />

      {
        form && <>

          <div id="title">
            <Label color="primary">Title</Label>
            <TextInput color="primary" value={form.title ?? ""} onChange={(e) => { updateField("title", e.target.value) }}></TextInput>
          </div>


          <div className="flex items-stretch space-x-4">
            <div className="flex-1" id="license">
              <Label color="primary">License</Label>
              <Select color="primary" id="license" value={form.license!} onChange={(e) => updateField("license", e.target.value as License)}>
                {
                  Object.values(License).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))
                }
              </Select>
            </div>

            <div className="flex-1" id="price">
              <Label color="primary">Price</Label>
              <TextInput color="primary" type="number" value={form.price!} onChange={(e) => {
                const v = e.target.value;
                updateField("price", v === "" ? null : Number(v))
              }} />

            </div>
          </div>


          <div id="description">
            <Label color="primary">Description</Label>
            <Textarea color="primary" value={form.description ?? ""} onChange={(e) => updateField("description", e.target.value)} />
          </div>


          <div className="flex flex-col items-stretch gap-4 text-foreground">


            <div className="w-full p-6 bg-surface border rounded shadow-xs">
              <h5 className="text-xl font-semibold text-heading mb-6">Items</h5>
              <div className="flow-root">
                <DraftFormUploadItem listingId={listing.id} />
              </div>

            </div>

          </div>

        </>
      }

      <HR />

      <div className="flex justify-end gap-4">
        <Button color='danger'>Delete</Button>
        <Button color="primary" onClick={() => setModalPublish(true)}>Publish</Button>
      </div >


      <Modal dismissible show={modalPublish} onClose={() => setModalPublish(false)} position="center" size="4xl" color="surface">
        <ModalHeader>Confirm Publish</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Please check your listing's data before publishing, as you will be unable to edit published listing,
              unless you request for takedown (revert back into Draft state) first.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              By publishing your digital property in our market, you are agree to our Terms and Service, and comply to our market reguations.
            </p>
          </div >
        </ModalBody >
        <ModalFooter>
          <Button disabled={!mutation.isIdle} color="secondary" onClick={() => { mutation.mutate(listing?.id!); setModalPublish(false) }}>I agree and Publish</Button>
          <Button color="alternative" onClick={() => setModalPublish(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal >
    </>
  )
}
