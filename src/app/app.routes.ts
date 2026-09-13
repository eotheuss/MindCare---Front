import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { clinicaNaoAssociadaGuard } from './core/guards/clinica-nao-associada.guard';
import { UserRole } from './core/models/enums';
import { UsuarioFormComponent } from './features/usuarios/usuario-form/usuario-form.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./features/usuarios/usuario-form/usuario-form.component').then((m) => UsuarioFormComponent),
  },

  // ---- Paciente ----
  {
    path: 'paciente',
    canActivate: [authGuard, roleGuard([UserRole.PACIENTE])],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/patient/patient-home/patient-home.component').then((m) => m.PatientHomeComponent),
      },
      {
        path: 'diario',
        loadComponent: () =>
          import('./features/patient/diary-entry/diary-entry.component').then((m) => m.DiaryEntryComponent),
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/patient/patient-reports/patient-reports.component').then(
            (m) => m.PatientReportsComponent
          ),
      },
      {
        path: 'prescricoes',
        loadComponent: () =>
          import('./features/patient/patient-prescriptions/patient-prescriptions.component').then(
            (m) => m.PatientPrescriptionsComponent
          ),
      },
      {
        path: 'agendar',
        loadComponent: () =>
          import('./features/patient/appointment-scheduling/appointment-scheduling.component').then(
            (m) => m.AppointmentSchedulingComponent
          ),
      },
    ],
  },

  // ---- Profissional ----
  {
    path: 'profissional',
    canActivate: [authGuard, roleGuard([UserRole.PROFISSIONAL])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/professional/professional-dashboard/professional-dashboard.component').then(
            (m) => m.ProfessionalDashboardComponent
          ),
      },
      {
        path: 'pacientes/:nomeUsuario',
        loadComponent: () =>
          import('./features/professional/patient-details/patient-details.component').then(
            (m) => m.PatientDetailsComponent
          ),
      },
    ],
  },

  // ---- Admin ----
  {
    path: 'admin',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'clinicas/nova',
        canActivate: [clinicaNaoAssociadaGuard],
        loadComponent: () =>
          import('./features/clinicas/clinica-form/clinica-form.component').then(
            (m) => m.ClinicaFormComponent
          ),
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./features/agenda/agenda.component').then((m) => m.AgendaComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
