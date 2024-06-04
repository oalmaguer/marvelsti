import { Component, Input, SimpleChanges } from '@angular/core';
import { TimelineModule } from 'primeng/timeline';
import { ImageModule } from 'primeng/image';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../data.service';
import { forkJoin, map } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    TimelineModule,
    ImageModule,
    CarouselModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  @Input() hero: any;
  comics: any = [];
  loading = false;
  responsiveOptions: any;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.comics = this.hero.comics.items;
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '1100px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '768px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    this.getComicImages();
  }

  getComicImages() {
    this.loading = true;
    this.comics = this.hero.comics.items;

    // const apiCalls = [];

    for (let i = 0; i < this.comics.length; i++) {
      this.comics[i].image =
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
      // apiCalls.push(
      //   this.dataService.getComicData(this.comics[i].resourceURI.split('/')[6])
      // );
    }

    //

    // forkJoin(apiCalls)
    //   .pipe(
    //     map((res: any) => {
    //       return res.map((res: any) => {
    //         return {
    //           image: res.data.results[0].thumbnail.path,
    //           url: res.data.results[0].urls[0].url,
    //         };
    //       });
    //     }),
    //     map((res) =>
    //       res.map((data: any, index: any) => {
    //         this.comics[index].image = data.image;
    //         this.comics[index].url = data.url;
    //       })
    //     )
    //   )
    //   .subscribe(() => {
    //     this.loading = false;

    //     // this.comics = results;
    //   });
    // for (let i = 0; i < this.comics.length; i++) {
    //   this.comics[i].id = this.comics[i].resourceURI.split('/')[6];

    //   this.dataService.getComicData(this.comics[i].id).subscribe((res) => {
    //     this.comics[i].image = res.data.results[0].thumbnail.path;
    //   });
    // }
  }

  selectComic(comic: any) {
    window.open(comic.url, '_blank');
  }
}
