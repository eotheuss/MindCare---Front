import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const clinicaNaoAssociadaGuard: CanActivateFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const nomeUsuario = authService.nomeUsuario();

  if (!nomeUsuario) {
    return router.createUrlTree(['/login']);
  }

  return of(!authService.possuiClinicaCadastrada());
};