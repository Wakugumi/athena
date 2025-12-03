import UserService from "@/api/UserService";
import { mimeFromFilename } from "@/app/_utils/resolve-filetype.util";
import { useAuth } from "@/context/AuthContext";
import useMutateProfile from "@/queries/mutations/useMutateProfile";
import { UpdateProfileRequest } from "@athena/types";
import axios from "axios";
import { Avatar, Button, Label, Spinner, Textarea, TextInput, Toast } from "flowbite-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiPercentBadge } from "react-icons/hi2";

export default function UpdateProfile() {
  const [form, setForm] = useState<UpdateProfileRequest>({})
  const { isAuth, user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [progress, setProgress] = useState<number | null>(null);

  const mutation = useMutateProfile();



  // load initial
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await UserService.me()
        setForm({
          ...data.data!,
        });
        setReady(true)
      } catch (error) {
        setError((error as any).message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const updateField = useCallback(
    <K extends keyof UpdateProfileRequest>(key: K, value: UpdateProfileRequest[K]) => {
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );


  const processFile = async (files: FileList) => {
    const file = files?.[0]
    if (!file) return;
    setProgress(0)

    try {

      const signed = (await UserService.updateAvatar(mimeFromFilename(file.name)!)).data

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
      setProgress(null);
      throw error
    }

    setProgress(null);
  };






  return (

    <>
      <form onSubmit={() => mutation.mutate(form)} className="p-4 flex flex-col gap-4 items-stretch">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => processFile(e.target.files!)}
        />
        {progress !== null && <Toast>
          <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
            <HiPercentBadge className="h-5 w-5" />
          </div>
          <div className="ml-3 text-sm font-normal">{progress}</div>
        </Toast>}



        <Avatar size="lg" img={user?.avatar} onClick={() => (progress === null) && inputRef.current?.click()} />

        <div className="flex flex-col gap-1 items-stretch">
          <Label>Display Name</Label>
          <TextInput disabled={mutation.isPending} value={form.displayName ?? ""} onChange={(e) => updateField("displayName", e.target.value)} />
        </div>



        <div className="flex flex-col gap-1 items-stretch">
          <Label>Bio</Label>
          <Textarea disabled={mutation.isPending} value={form.bio ?? ""} onChange={(e) => updateField("bio", e.target.value)} />
        </div>


        <Button disabled={!mutation.isIdle} type="submit" color="primary">Save profile</Button>

        {
          mutation.isPending && <span className="p-4 rounded outline outline-primary">Processing... <Spinner color="success" /></span>
        }

        {
          mutation.isError && <span className="p-4 rounded bg-red-700 text-red-100">{mutation.error.message ?? error ?? "Cannot update your profile"}</span>
        }
        {
          error && <span className="p-4 rounded bg-red-700 text-red-100">{error ?? "Cannot update your profile"}</span>
        }

      </form>

    </>
  )
}
