import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../../utilities/guards/admin/admin.guard'
import { AuthGuard } from '../../utilities/guards/auth/auth.guard'


const routes: Routes = [
  { path: '', component: AdminComponent, canActivate: [AuthGuard, AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
