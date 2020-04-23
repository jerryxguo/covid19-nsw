import { Injectable } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private breadCrumbSource = new Subject<void>();

  // Observable
  breadCrumbAnnounced$ = this.breadCrumbSource.asObservable();
  breadCrumbs = [];

  constructor(public router: Router, route: ActivatedRoute) {
    router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    )
    .subscribe((r: any) => {
      let topurl = r.urlAfterRedirects + '';
      var links = topurl.split('/');
      if (links.length > 0) {
        this.breadCrumbs = [];
        links.shift();

        for (const link of links) {
          const cdproute = {
            name: link.toUpperCase(),
            url: topurl.substring(0, topurl.lastIndexOf(link) + link.length),
            last: false
          };
          this.breadCrumbs.push(cdproute);
        }
        if (this.breadCrumbs.length > 1) {
          this.breadCrumbs[this.breadCrumbs.length - 1].last = true;
        }
        this.breadCrumbSource.next();
      }
    });
  }

  getBreadCrumbs(){
    return this.breadCrumbs
  }

  isActivelink(link: string){
    let up = link.toUpperCase()
    for (let b of this.breadCrumbs) {
      if(b.name == up){
        return true;
      }
    }
    return false
  }

  refresh() {
    this.breadCrumbSource.next();
  }
}
