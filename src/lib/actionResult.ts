export interface ActionResult {
  status: 'idle' | 'success' | 'error';
  message: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialActionResult: ActionResult = {
  status: 'idle',
  message: '',
};

export function successResult(message: string): ActionResult {
  return { status: 'success', message };
}

export function errorResult(
  message: string,
  fieldErrors?: Record<string, string[]>,
): ActionResult {
  return { status: 'error', message, fieldErrors };
}
