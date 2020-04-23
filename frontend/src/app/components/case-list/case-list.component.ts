import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.css']
})

export class CaseListComponent implements OnInit, OnDestroy {

  private breadcrumSubscription: Subscription;
  private modelChanged: Subject<void> = new Subject<void>();
  private delaySubscription: Subscription;

  private optionSubscription: Subscription;

  private daysChanged: Subject<void> = new Subject<void>();
  private delayDaysSubscription: Subscription;
  private days = environment.days;
  private daysChange = 0;
  public placeholder = "";
  public selectedView  = "";
  public genres = environment.genres;

  public options: string[];
  public filterText = "";
  public displayDays ="";
  public showOptions = false;


  constructor(private dataService: DataService, private breadcrumbService: BreadcrumbService){}

  ngOnInit() {
    this.updateFocus();
    this.breadcrumSubscription = this.breadcrumbService.breadCrumbAnnounced$.subscribe(() => {
      this.updateFocus();
    });

    this.optionSubscription = this.dataService.optionChange.subscribe((options: string[]) => {
      this.options = options;
    });


    this.delaySubscription = this.modelChanged
        .pipe(
          debounceTime(500),
        )
        .subscribe(() => {
          this.loadOptions();
        });

    this.delayDaysSubscription = this.daysChanged
        .pipe(
          debounceTime(1500),
        )
        .subscribe(() => {
          this.onDayschange();
        });
    this.daysChange = 0;
    this.options = [];
    this.displayDays = this.days + " Days"
  }

  onButtonClick(index){

    if((index < 0 && this.days > environment.days/2) ||
      (index> 0 && this.days < environment.days * 2)) {

        this.daysChange = this.daysChange + index;
        this.days = this.days + index;
        this.displayDays = this.days + " Days"
        this.dataService.setDays(this.days);
    }
    this.daysChanged.next();
  }

  onDayschange(){
    if(this.daysChange!=0) {
        this.getCases();
        this.daysChange = 0;
    }
  }

  onInputAction(){
    this.modelChanged.next();
  }

  ngOnDestroy() {
    this.breadcrumSubscription.unsubscribe();
    this.optionSubscription.unsubscribe();
    this.delaySubscription.unsubscribe();
    this.delayDaysSubscription.unsubscribe();
  }

  loadOptions(this){
    this.showOptions = true;
    this.options = [];
    this.dataService.getOptions(this.selectedView, this.filterText);

  }

  getCases(){
    this.dataService.getCases(this.selectedView, this.filterText);
  }

  onClick(index: number) {
    this.showOptions = false;
    if (index < 0){
      this.filterText = "";
    } else if (index < this.options.length){
      this.filterText = this.options[index];
      if(this.filterText != "" && this.hasOption(this.filterText)){
        this.getCases();
      }
    } else {
      console.log("wrong index:"+index)
      this.filterText = "";
    }
  }

  hasOption(text: string){
    for(let i= 0; i< this.options.length; i++){
      if(this.options[i]==text){
        return true;
      }
    }
    return false;
  }

  getOptions(){
    return this.options;
  }

  updateFocus() {
    this.filterText ="";
    this.showOptions = false;
    for( var i = 0; i< this.genres.length; i++){
      if (this.breadcrumbService.isActivelink(this.genres[i].name)) {
        this.selectedView = this.genres[i].field;
        this.placeholder = this.genres[i].name;
      }
    }
    if(this.selectedView==""){
      //state government
      this.getCases();
    }
  }
}
