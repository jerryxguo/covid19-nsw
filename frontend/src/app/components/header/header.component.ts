import { Component, Input, Output,  OnInit, OnDestroy , EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  @Output() navMenuToggled = new EventEmitter<boolean>();

  breadcrumSubscription : Subscription;
  breadCrumbs = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(){
    this.breadcrumSubscription = this.breadcrumbService.breadCrumbAnnounced$.subscribe(() => {
      this.breadCrumbs = this.breadcrumbService.getBreadCrumbs()
    });
    this.breadcrumbService.refresh();
  }

  ngOnDestroy(){
    this.breadcrumSubscription.unsubscribe();
  }
}
