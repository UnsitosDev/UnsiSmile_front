import { CanDeactivateFn } from '@angular/router';

export const withoutSavenGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};
