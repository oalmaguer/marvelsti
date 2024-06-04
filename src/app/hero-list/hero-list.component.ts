import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DataService } from '../data.service';
import { forkJoin } from 'rxjs';
import { HeroComponent } from './hero/hero.component';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [DataViewModule, ButtonModule, CommonModule, HeroComponent],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
})
export class HeroListComponent {
  public page = 1;
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

  constructor(public dataService: DataService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getHeroes();
    // this.getPopularHeroes();
  }

  getHeroes(): void {
    this.dataService.heroesObs$.subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  goToHero(hero: any): void {
    this.selectedHero = hero;
    this.dataService.heroDetails$.next(hero);
  }

  getPopularHeroes(): void {
    const apiCalls = [];
    for (let i = 0; i < this.popularHeroList.length; i++) {
      apiCalls.push(this.dataService.getPopularHeroes(this.popularHeroList[i]));
    }

    forkJoin(apiCalls).subscribe((results) => {
      this.popularHeroes = results;
    });
  }

  paginate(action: string) {
    if (action === 'next') {
      this.page++;
    } else {
      this.page--;
    }
    this.dataService.getHeroes(this.page);
  }
}
