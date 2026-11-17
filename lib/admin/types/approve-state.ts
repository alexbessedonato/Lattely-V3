// What a Submission's card shows after an Approve try: the text the Admin typed and, if something was wrong, why.
export type ApproveState = {
  coordinates: string;
  error?: string;
  photoError?: string;
};
