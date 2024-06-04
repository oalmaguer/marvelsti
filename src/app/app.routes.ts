import { HeroComponent } from './hero-list/hero/hero.component';
import { HeroListComponent } from './hero-list/hero-list.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, //default route
  { path: 'home', component: HeroListComponent },
  {
    path: 'hero/:id',
    component: HeroComponent,
  },
];
