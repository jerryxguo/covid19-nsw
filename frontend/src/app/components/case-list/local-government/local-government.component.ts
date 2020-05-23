import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { ChartsComponent } from '../charts/charts.component';
import { Subscription } from 'rxjs';
import { DataModel } from 'src/app/models/data';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-local-government',
  templateUrl: './local-government.component.html',
  styleUrls: ['./local-government.component.css']
})

export class LocalGovernmentComponent implements OnInit, OnDestroy{

  @Input() chartsChild: ChartsComponent;
  
  private caseSubscription: Subscription;
  public result : DataModel;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.caseSubscription = this.dataService.caseChange.subscribe((result: DataModel) => {
      if(result.field=="lga_name19"){
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
