import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-print-drill-guide',
  templateUrl: './print-drill-guide.component.html',
  styleUrls: ['./print-drill-guide.component.css']
})
export class PrintDrillGuideComponent implements OnInit {

  constructor() { }

  perimeter: number = 2394;
  nbPins: number = 200;

  ngOnInit(): void {
  }

}
