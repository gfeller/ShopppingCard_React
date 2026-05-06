import { Severity } from '../model/message';
import { useUiActions } from '../state/ui-store';

export const useWithMessage = <T extends unknown[], R = void>(
  action: (...args: T) => Promise<R>,
  successText: string | ((result: R) => string) | null,
  errorText: string | ((error: Error) => string)
) => {
  const { setMessage } = useUiActions();

  return (...args: T) =>
    action(...args)
      .then((result) => {
        if (successText) {
          setMessage({
            text: typeof successText === 'function' ? successText(result) : successText,
            severity: Severity.success,
          });
        }
      })
      .catch((error: Error) => {
        setMessage({
          text: typeof errorText === 'function' ? errorText(error) : errorText,
          severity: Severity.error,
        });
      });
};
