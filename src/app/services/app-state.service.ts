import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppStateService {
    private _searchOpen = new BehaviorSubject<boolean>(false);
    private _searchTerm = new BehaviorSubject<string>('');

    searchOpen$ = this._searchOpen.asObservable();
    searchTerm$ = this._searchTerm.asObservable();

    get searchOpen() {
        return this._searchOpen.value;
    }

    toggleSearch() {
        const next = !this._searchOpen.value;
        this._searchOpen.next(next);
        if (!next) this._searchTerm.next('');
    }

    setSearchTerm(term: string) {
        this._searchTerm.next(term);
    }
}
