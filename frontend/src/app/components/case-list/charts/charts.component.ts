import { Component, OnDestroy, AfterViewInit, Output, EventEmitter, NgZone } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { DisplayModel } from 'src/app/models/data';

am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnDestroy, AfterViewInit {

  chart: am4charts.XYChart;
  chartTitle: any;
  showNoDataAvailable = false;
  chartData : any = [];
  isShown = false;

  constructor(private zone: NgZone) {}

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      //Initialise chart only -- data loading later
      this.initializeChartParams();
    });
  }

  initializeChartParams()
  {
    /**** Chart Initialization ****/
    let chart = am4core.create("trending_chartdiv", am4charts.XYChart);
    chart.fontSize = 12;   //global chart font size

    this.chartTitle =chart.titles.create();
    this.chartTitle.paddingBottom=20;
    this.chartTitle.marginTop=0;
    this.chartTitle.paddingTop=0;
    this.chartTitle.fontSize = 16;


    /**** Date Axis Configuration ****/
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());

    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category  = 'date';
    categoryAxis.renderer.minGridDistance = 0.0001;
    categoryAxis.renderer.inversed = false;
    categoryAxis.renderer.grid.template.disabled = true;

    let label = categoryAxis.renderer.labels.template;
    label.rotation = -90;
    label.horizontalCenter = "right";
    label.verticalCenter = "middle";


    /*********Y Axis Configuration */
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.maxPrecision  = 0;
    valueAxis.extraMax = 0.1;
    valueAxis.strictMinMax = true;
    valueAxis.renderer.minGridDistance = 30;

    var series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryX = "date";
    series.dataFields.valueY = "count";
    series.columns.template.tooltipText = "{valueY.value}"
    series.columns.template.tooltipY = 0;
    series.columns.template.strokeOpacity = 0;

    series.columns.template.adapter.add("fill", function (fill, target) {
      return chart.colors.getIndex(target.dataItem.index);
     });

    /**** Enable Export Menu ****/
    //chart.exporting.menu = new am4core.ExportMenu();
     this.chart = chart;

  }

  updateChartData(data: DisplayModel[]){
    this.zone.runOutsideAngular(()=>{
      this.chart.data = data;
    });
  }

  updateChartTitle(title)
  {
    this.zone.runOutsideAngular(()=>{
      this.chartTitle.text = title
    });
  }


  showChart(){
    this.isShown = true;
  }

  hideChart(){
    this.isShown = false;
  }

}
