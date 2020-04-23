import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ChartsComponent } from '../charts/charts.component';
import { Subscription } from 'rxjs';
import { DataModel } from 'src/app/models/data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit, OnDestroy {


  @ViewChild(ChartsComponent, {static: true})
  chartsChild: ChartsComponent;

  private caseSubscription: Subscription;
  public result : DataModel;

  constructor(private dataService: DataService, ) {}

  ngOnInit() {
    this.caseSubscription = this.dataService.caseChange.subscribe((result: DataModel) => {
      if(result.field==""){
        this.result = result;
        this.updateCharts()
      }
    });

  }

  ngOnDestroy() {
    this.caseSubscription.unsubscribe();
  }


  updateCharts(){
    this.chartsChild.updateChartData(this.result.data);
    this.chartsChild. updateChartTitle("Total: "+ this.result.total+" cases" )
  }
}
