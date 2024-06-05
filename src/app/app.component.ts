import { Component } from '@angular/core';
import { HeroListComponent } from './hero-list/hero-list.component';
import { DataService } from './data.service';
import { MessagesModule } from 'primeng/messages';
import { Subject, takeUntil } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroListComponent, MessagesModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sti';
  destroy$ = new Subject<void>();
  messages: any[] = [];
  showError = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.dataService
      .getHeroes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        if (res[0]) {
          this.dataService.heroesObs$.next(res[0]);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
