"use client"
import ListingService from "@/api/ListingService";
import { useDebounce } from "@/app/_utils/debounce.util";
import { UpdateListingRequest } from "@athena/types";
import { useEffect, useState, useCallback } from "react";

export function useFormListing(id: string) {
  const [form, setForm] = useState<UpdateListingRequest | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [ready, setReady] = useState(false);
  const debounceForm = useDebounce(form, 500);

  // load initial
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await ListingService.getMyDraft(id)
        setForm({
          ...data!,
          price: data!.price! !== null ? Number(data!.price) : null
        });
        setReady(true)
      } catch (error) {
        setError((error as any).message ?? "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const updateField = useCallback(
    <K extends keyof UpdateListingRequest>(key: K, value: UpdateListingRequest[K]) => {
      setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  // autosave
  useEffect(() => {
    if (!debounceForm || !ready) return;
    const t = setTimeout(async () => {
      setError(null);
      try {
        await ListingService.updateDraft(debounceForm)
        setSynced(true)
      } catch (error) {
        setError((error as any).response.data.message ?? "Failed to save");
      } finally {
        setSaving(false);
      }
    }, 400);

    return () => clearTimeout(t);
  }, [debounceForm, ready, id]);

  useEffect(() => { setSaving(true); setSynced(false); }, [form])

  return { form, updateField, loading, saving, error, synced };
}
