// The biggest photo a Member can submit: 4 MB. The form checks it before sending, because over
// next.config.ts's bodySizeLimit Next refuses the request before our action can explain why.
export const MAX_PHOTO_BYTES = 4 * 1024 * 1024;
