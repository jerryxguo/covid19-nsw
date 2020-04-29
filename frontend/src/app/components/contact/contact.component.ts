import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit{

  firstName = "";
  lastName = "";
  sender = "";
  content ="";
  submitted = false;
  submitting = false;


  constructor(private router: Router,private dataService: DataService) { }

  ngOnInit() {}

  onSubmit() {
    this.submitted = false;
    this.submitting = true;
    this.dataService.contactUs(this.sender, this.content, this.firstName, this.lastName)
        .subscribe(
          () => {
            this.submitting = false;
            this.submitted = true;
          },
          () => {
            this.submitting = false;
            this.submitted = true;
        });
  }

  goBack(){
    this.router.navigate([""]);
  }
}
