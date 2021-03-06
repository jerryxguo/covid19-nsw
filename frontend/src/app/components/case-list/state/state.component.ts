import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
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


  //@ViewChild(ChartsComponent, {static: true})
  @Input() chartsChild: ChartsComponent;

  private caseSubscription: Subscription;
  public result : DataModel;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.caseSubscription = this.dataService.caseChange.subscribe((result: DataModel) => {
      if(result.field=="state"){
        this.result = result;
        this.updateCharts();
        this.chartsChild.showChart();
      }
    });

  }

  ngOnDestroy() {
    this.caseSubscription.unsubscribe();
    this.chartsChild.hideChart();
  }


  updateCharts(){
    this.chartsChild.updateChartData(this.result.data);
    this.chartsChild. updateChartTitle("Total: "+ this.result.total+" cases" )
  }
}
