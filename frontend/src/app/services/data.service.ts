
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { DataModel, DisplayModel, Record } from '../models/data';


@Injectable({
  providedIn: 'root'
})

export class DataService {
  private baseUrl: string = environment.api;
  private limit: number = environment.limit;
  private resourceId: string = environment.resourceId;
  private days = environment.days;

  optionChange: Subject<string[]>;
  caseChange: Subject<DataModel>;

  constructor(private http: HttpClient){
    this.optionChange = new Subject<string[]>();
    this.caseChange = new Subject<DataModel>();
  }

  public setDays(days: number){
    this.days = days;
  }

  public getOptions(field:string, query: string){
    const header = new HttpHeaders({'Content-Type': 'application/json'});
    var data = {
      "resource_id": this.resourceId,
      "limit": this.limit,
      "fields": field,
      "q":{}
    };
    data["q"][field]=query.split(" ")[0]+":*";
    this.http.post<any>(this.baseUrl, data, {headers: header}).subscribe(
      (response) => {
        let options = [];
        response.forEach(function(record:any){
          options.push(record[field]);
        }, this)
        this.optionChange.next(options);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getCases(field:string, fieldValue: string){
    const header = new HttpHeaders({'Content-Type': 'application/json'});

    var data =
      {
        "resource_id": this.resourceId,
        "limit": this.limit,
        "filters":{}
      };
    if(field!=""){
      data["filters"][field]= [fieldValue.toString()];
    }
    this.http.post<any>(this.baseUrl, data, {headers: header}).subscribe(
      (response) => {

        let records : DisplayModel[]= [];
        let days = this.days;
        let start = new Date();
        start.setDate(start.getDate()-days);
        let first = start.toISOString().slice(0, 10);
        let today = new Date().toISOString().slice(0, 10);
        for(let i= 0;; i++){
          let date = new Date(first);
          date.setDate( date.getDate() + i );
          let dateString = date.toISOString().slice(0, 10);
          let r : DisplayModel = {
            date: dateString,
            count: 0
          }
          records.push(r);
          if(dateString==today){
            break;
          }
        }

        response.forEach(function(record:Record){
          let notification = record.notification_date.replace("T00:00:00", "");
          for(let i = 0; i < records.length; i++){
            if (records[i].date == notification){
              records[i].count = records[i].count+1;
              break;
            }
          }
        }, this)

        //format date
        let formattedData = []
        for(let i = 0; i< records.length; i++){
          let d: DisplayModel = {
            date: records[i].date.slice(5).replace("-","/"),
            count: records[i].count
          }
          formattedData.push(d);
        }
        let cases : DataModel = {
          title: fieldValue,
          field: field,
          total: response.length,
          data: formattedData
        };
        this.caseChange.next(cases);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
