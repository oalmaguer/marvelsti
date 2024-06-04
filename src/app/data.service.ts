import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, of } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public heroesObs$ = new BehaviorSubject<any[]>([]);
  public popularHeroesObs$ = new BehaviorSubject<any[]>([]);
  public heroDetails$ = new BehaviorSubject<any[]>([]);
  public urlKey = '293712bcb109586dc1136300e1f3838b';
  public url = 'https://gateway.marvel.com:443';

  constructor(
    private storageService: StorageService,
    private http: HttpClient
  ) {}

  getHeroes(page?: any) {
    const storedData = this.storageService.retrieveData('heroes');
    if (storedData) {
      this.heroesObs$.next(storedData);

      if (!page) {
        return of(storedData);
      }
    }
    return this.http
      .get(
        `${
          this.url
        }/v1/public/characters?apikey=293712bcb109586dc1136300e1f3838b&hash=4c582ace7e2ecef17a5213f0da6921d1&limit=10&offset=${
          page ? page * 10 + 1 : 0
        }`
      )
      .pipe(
        map((res: any) => {
          if (res.code === 200) {
            this.storageService.storeData('heroes', res.data.results);
            this.heroesObs$.next(res.data.results);
            return res.data.results;
          } else {
            return null;
          }
        })
      );
  }

  getComicData(comicId: any) {
    return this.http.get(
      `${this.url}/v1/public/comics/${comicId}?apikey=293712bcb109586dc1136300e1f3838b&hash=4c582ace7e2ecef17a5213f0da6921d1&limit=10&offset=10+1`
    );
  }
  getPopularHeroes(hero: string) {
    const storedData = this.storageService.retrieveData('popularHeroes');
    const timestamp = new Date().getTime();
    let date = new Date();

    // if (storedData) {
    //   this.popularHeroesObs$.next(storedData);
    //
    //   return of(storedData);
    // }

    return this.http.get(
      `${this.url}/v1/public/characters?ts=1&apikey=293712bcb109586dc1136300e1f3838b&hash=4c582ace7e2ecef17a5213f0da6921d1&name=${hero}`
    );
  }
}
