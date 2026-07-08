"use client";
import { useEffect } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { generateSlug } from "@/lib/utils";

interface UseSlugOptions {
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  nombreField?: string;
  slugField?: string;
}

export function useSlug({
  watch,
  setValue,
  nombreField = "nombre",
  slugField = "slug",
}: UseSlugOptions) {
  const nombre = watch(nombreField);

  useEffect(() => {
    setValue(slugField, generateSlug(nombre || ""), {
      shouldValidate: true,
    });
  }, [nombre, setValue, slugField]);

  return watch(slugField) as string;
}
