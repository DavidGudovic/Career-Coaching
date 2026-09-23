// Shared by the contact form's email input (`pattern`) and the server action, so the browser
// rejects the same addresses the server would instead of the visitor hitting a generic error.
export const EMAIL_PATTERN = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+'
