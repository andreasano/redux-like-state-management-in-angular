import { throwError as observableThrowError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '../../store/store.service';
import { GetReposErrorEvent, GetReposEvent, GetReposSuccessEvent } from './repos-events';
import { Repo } from './Repo';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReposService {
  reposUrl = 'https://api.github.com/users/intojs/repos';

  constructor(private http: HttpClient, private store: Store) {
  }

  getRepos() {
    this.store.dispatch(new GetReposEvent());

    this.http.get(this.reposUrl)
      .pipe(
        delay(1000),
        catchError((error: any) => {
          return observableThrowError(error.json().error || 'Server error');
        })
      )
      .subscribe(
        {
          next: (repos: Repo[]) => this.store.dispatch(new GetReposSuccessEvent(repos)),
          error: (error: any) => this.store.dispatch(new GetReposErrorEvent())
        }
      );
  }
}
