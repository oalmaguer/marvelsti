import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DataService } from '../data.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { HeroComponent } from './hero/hero.component';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [DataViewModule, ButtonModule, CommonModule, HeroComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  public page = 0;
  heroes: any[] = [];

  public popularHeroList = [
    'Hulk',
    'Captain America',
    'Thanos',
    'Black Panther',
    'Black Widow',
  ];
  selectedHero: any;

  popularHeroes: any[] = [];
  destroy$ = new Subject<void>();

  constructor(
    public dataService: DataService,
    private storageService: StorageService
  ) {}
  ngOnInit(): void {
    this.getHeroes();
    this.getPopularHeroes();
  }

  getHeroes(): void {
    this.dataService.heroesObs$
      .pipe(takeUntil(this.destroy$))
      .subscribe((heroes) => {
        this.heroes = heroes;
      });
  }

  goToHero(hero: any): void {
    this.selectedHero = hero;
    this.dataService.heroDetails$.next(hero);
  }

  getPopularHeroes(): void {
    if (this.storageService.retrieveData('popularHeroes')) {
      this.popularHeroes = this.storageService.retrieveData('popularHeroes');
      return;
    }
    const apiCalls = [];
    for (let i = 0; i < this.popularHeroList.length; i++) {
      apiCalls.push(this.dataService.getPopularHeroes(this.popularHeroList[i]));
    }

    forkJoin(apiCalls)
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.popularHeroes = results;
      });
  }

  paginate(action: string) {
    let prevPage = this.page;
    if (action === 'next') {
      this.page++;
    } else {
      this.page--;
    }

    this.dataService
      .paginate(this.page)
      .pipe(takeUntil(this.destroy$))
      .subscribe((heroes) => {
        if (heroes) {
          this.dataService.heroesObs$.next(heroes);
        } else {
          this.page = prevPage;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
