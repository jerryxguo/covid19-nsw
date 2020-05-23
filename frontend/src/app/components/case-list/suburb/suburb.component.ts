import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { ChartsComponent } from '../charts/charts.component';
import { Subscription } from 'rxjs';
import { DataModel} from 'src/app/models/data';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-suburb',
  templateUrl: './suburb.component.html',
  styleUrls: ['./suburb.component.css']
})


export class SuburbComponent implements OnInit, OnDestroy {


  //@ViewChild(ChartsComponent, {static: true})
  @Input() chartsChild: ChartsComponent;

  private caseSubscription: Subscription;
  public result : DataModel;


  constructor(private dataService: DataService) {}

  ngOnInit() {
   
    this.caseSubscription = this.dataService.caseChange.subscribe((result: DataModel) => {
      if(result.field=="postcode"){
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
