import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ClinicaService } from '../services/clinica.service';

/** Só permite acesso à tela de cadastro de clínica se o admin logado ainda não tiver nenhuma. */
export const clinicaNaoAssociadaGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const clinicaService = inject(ClinicaService);
  const router = inject(Router);

  const nomeUsuario = authService.nomeUsuario();
  if (!nomeUsuario) {
    router.navigate(['/login']);
    return false;
  }

  return clinicaService.buscarPorAdmin(nomeUsuario).pipe(
    map((clinica) => {
      if (clinica) {
        router.navigate(['/admin/dashboard']);
        return false;
      }
      return true;
    })
  );
};
