"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitShopAction } from "@/lib/submission/submit-shop-action";
import type { SubmitShopState } from "@/lib/submission/types/submit-shop-state";

const empty: SubmitShopState = {
  values: { name: "", address: "", instagramOrWebsite: "" },
  errors: {},
};

const inputLook = "h-13 rounded-full bg-white px-5 md:text-base";

// The /submit form. The Server Action checks it and sends back a message for each field that's wrong.
export function SubmitForm() {
  const [state, formAction, pending] = useActionState(submitShopAction, empty);

  return (
    <form action={formAction} className="flex flex-col gap-4.5">
      <Field id="name" label="Shop name" errors={state.errors.name}>
        <Input
          id="name"
          name="name"
          required
          maxLength={100}
          placeholder="e.g. Nomad Coffee"
          defaultValue={state.values.name}
          aria-invalid={Boolean(state.errors.name)}
          aria-describedby={state.errors.name && "name-error"}
          className={inputLook}
        />
      </Field>

      <Field id="address" label="Address" errors={state.errors.address}>
        <Input
          id="address"
          name="address"
          required
          maxLength={200}
          autoComplete="street-address"
          placeholder="Street and number, Barcelona"
          defaultValue={state.values.address}
          aria-invalid={Boolean(state.errors.address)}
          aria-describedby={state.errors.address && "address-error"}
          className={inputLook}
        />
      </Field>

      <Field
        id="instagramOrWebsite"
        label={
          <>
            Instagram or website <span className="font-normal">(optional)</span>
          </>
        }
        errors={state.errors.instagramOrWebsite}
      >
        <Input
          id="instagramOrWebsite"
          name="instagramOrWebsite"
          type="url"
          inputMode="url"
          placeholder="https://instagram.com/…"
          defaultValue={state.values.instagramOrWebsite}
          aria-invalid={Boolean(state.errors.instagramOrWebsite)}
          aria-describedby={
            state.errors.instagramOrWebsite && "instagramOrWebsite-error"
          }
          className={inputLook}
        />
      </Field>

      <Field
        id="photo"
        label={
          <>
            Photo <span className="font-normal">(optional)</span>
          </>
        }
        errors={state.errors.photo}
      >
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          aria-invalid={Boolean(state.errors.photo)}
          aria-describedby={
            state.errors.photo ? "photo-error photo-help" : "photo-help"
          }
          className="h-13 rounded-full bg-white px-5 py-3.5 md:text-base"
        />

        <p id="photo-help" className="pl-5 text-[13px] text-mocha">
          A JPEG, PNG or WebP up to 4 MB, of the shop from outside or the bar.
        </p>
      </Field>

      {state.errors.form && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {state.errors.form[0]}
        </p>
      )}

      <Button
        type="submit"
        disabled={pending}
        className="mt-1.5 h-13 rounded-full text-base font-bold"
      >
        {pending ? "Submitting…" : "Submit shop"}
      </Button>

      <p className="text-center text-sm leading-normal text-mocha">
        You can have up to 3 shops waiting for review.
      </p>
    </form>
  );
}

// A label, its input, and the first error message under it, if any.
function Field({
  id,
  label,
  errors,
  children,
}: {
  id: string;
  label: React.ReactNode;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-semibold text-mocha">
        {label}
      </Label>

      {children}

      {errors && (
        <p
          id={`${id}-error`}
          className="pl-5 text-sm font-semibold text-destructive"
        >
          {errors[0]}
        </p>
      )}
    </div>
  );
}
