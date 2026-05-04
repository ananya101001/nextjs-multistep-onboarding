"use client";

import { useEffect } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";

export function useFormPersistence<T extends FieldValues>(
  form: UseFormReturn<T>,
  storageKey: string
) {
  const { watch, reset } = form;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        reset(JSON.parse(stored) as T);
      } catch {
        localStorage.removeItem(storageKey);
      }
    }
  // reset is stable across renders, storageKey is the only meaningful dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    const subscription = watch((values) => {
      localStorage.setItem(storageKey, JSON.stringify(values));
    });
    return () => subscription.unsubscribe();
  }, [watch, storageKey]);
}
