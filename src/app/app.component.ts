import { Component } from '@angular/core';
import { HeroListComponent } from './hero-list/hero-list.component';
import { DataService } from './data.service';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeroListComponent, MessagesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'sti';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.dataService.getHeroes().subscribe((res: any) => {
      if (res.code === 200) {
        this.dataService.heroesObs$.next(res.data.results);
      } else {
      }
    });
  }
}
