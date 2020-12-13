import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-multi-loom',
  templateUrl: './multi-loom.component.html',
  styleUrls: ['./multi-loom.component.css']
})
export class MultiLoomComponent implements OnInit {

  public fileIds: string[];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params): void => {
      if (params.fileIds != undefined) {
        this.fileIds = params.fileIds.split(';');
        console.log(this.fileIds);
      }
      
    });
  }

}
