import { Component, OnInit } from '@angular/core';
import { Store, State } from '../store/store.service';
import { Observable } from 'rxjs';
import { ReposService } from './shared/repos.service';
import { Repo } from './shared/Repo';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-repos',
  template: `
    <h2>Github repos</h2>
    <button type="button" (click)="getRepos()">Get repos</button>
    <p *ngIf="isLoading$ | async">Repos are loading...</p>
    <p *ngIf="hasError$ | async">Oups, could not retrieve repos from the server</p>
    <p *ngIf="(reposNumber$ | async) > 0">You have loaded {{reposNumber$ | async}} repos</p>
    <ul>
      <li *ngFor="let repo of repos$ | async">
        {{repo.name}} - {{repo.description}}
      </li>
    </ul>
  `
})
export class ReposComponent implements OnInit {
  repos$: Observable<Repo[]>;
  isLoading$: Observable<boolean>;
  hasError$: Observable<boolean>;
  reposNumber$: Observable<number>;

  constructor(private store: Store, private reposService: ReposService) {
  }

  ngOnInit() {
    this.repos$ = this.store.observe()
      .pipe(map((state: State) => state.repos.repos));

    this.isLoading$ = this.store.observe()
      .pipe(map((state: State) => state.repos.isLoading));

    this.hasError$ = this.store.observe()
      .pipe(map((state: State) => state.repos.hasError));

    this.reposNumber$ = this.store.observe()
      .pipe(map((state: State) => state.repos.repos.length));
  }

  getRepos() {
    this.reposService.getRepos();
  }
}
