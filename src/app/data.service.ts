import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of, throwError } from 'rxjs';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  public heroesObs$ = new BehaviorSubject<any[]>([]);
  public popularHeroesObs$ = new BehaviorSubject<any[]>([]);
  public heroDetails$ = new BehaviorSubject<any[]>([]);
  // public urlKey = '293712bcb109586dc1136300e1f3838b';
  public urlKey = 'ab8348f80bc0ba898f93d07b8eefd1e7';
  public url = 'https://gateway.marvel.com:443';

  constructor(
    private storageService: StorageService,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  paginate(page: any) {
    let offset;
    if (page == 0) {
      offset = 0;
    } else {
      offset = page * 10;
    }
    return this.http
      .get(
        `${this.url}/v1/public/characters?apikey=${this.urlKey}&hash=22be4c3948dd52107a7df0b2a7b1e608&limit=10&offset=${offset}`
      )
      .pipe(
        map((res: any) => {
          if (res.code === 200) {
            return res.data.results;
          } else {
            return of(null);
          }
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getHeroes(page?: any) {
    const storedData = this.storageService.retrieveData('heroes');
    if (storedData) {
      this.heroesObs$.next(storedData);
      if (!page) {
        return of(storedData[0]);
      }
    }
    return this.http
      .get(
        `${this.url}/v1/public/characters?apikey=${this.urlKey}&hash=22be4c3948dd52107a7df0b2a7b1e608&limit=10&offset=0`
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
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  getComicData(comicId: any) {
    return this.http
      .get(
        `${this.url}/v1/public/comics/${comicId}?apikey=${this.urlKey}&hash=22be4c3948dd52107a7df0b2a7b1e608&limit=10&offset=10+1`
      )
      .pipe(catchError((error) => this.handleError(error)));
  }
  getPopularHeroes(hero: string) {
    const storedData = this.storageService.retrieveData('popularHeroes');

    let popularHeroes = this.storageService.retrieveData('popularHeroes');
    if (storedData) {
      return of(storedData);
    }

    return this.http
      .get(
        `${this.url}/v1/public/characters?ts=1&apikey=${this.urlKey}&hash=22be4c3948dd52107a7df0b2a7b1e608&name=${hero}`
      )
      .pipe(
        map((res: any) => {
          if (res.code === 200) {
            this.storageService.storeData('popularHeroes', res.data.results[0]);
            this.popularHeroesObs$.next(popularHeroes);
            return res.data.results[0];
          } else {
            return null;
          }
        }),
        catchError((error) => {
          return this.handleError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar los heroes',
      });
    }

    return of(null);
  }
}
