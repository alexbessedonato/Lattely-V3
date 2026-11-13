// What the form shows after a try: the text the Member typed (so nothing is lost) and a message per field.
export type SubmitShopState = {
  values: { name: string; address: string; instagramOrWebsite: string };
  errors: {
    name?: string[];
    address?: string[];
    instagramOrWebsite?: string[];
    form?: string[]; // about the whole Submission, not one field (e.g. the 3-pending limit)
  };
};
