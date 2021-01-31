import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LoomHelperComponent } from '../loom-helper/loom-helper.component';

@Component({
  selector: 'app-multi-loom',
  templateUrl: './multi-loom.component.html',
  styleUrls: ['./multi-loom.component.css']
})
export class MultiLoomComponent implements OnInit {

  public currentRatio: number;
  public fileIds: string[];

  public slider

  @ViewChildren(LoomHelperComponent) loomHelpers: QueryList<LoomHelperComponent>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params): void => {
      if (params.fileIds != undefined) {
        this.fileIds = params.fileIds.split(';');
      }
      
    });
  }

  public getShaveArray(index: number) {
    let returnValue = [false, false, true, true];

    if (index == 0) returnValue[2] = false;
    if (index == this.fileIds.length - 1) returnValue[3] = false;

    return returnValue;
  }

  changeRatio() {
    for (let loomHelper of this.loomHelpers) {
      loomHelper.updateToRatio(this.currentRatio / this.maxPinPathLength);
    }
  }

  maxPinPathLength = 0;
  pinPathLoaded(length: number) {
    if (length > this.maxPinPathLength) this.maxPinPathLength = length;
    this.currentRatio = 0;
    this.changeRatio();
  }

  replayDisabled: boolean = false;
  replayTotalTime: number = 10000;
  replayStepInMs: number = 20;
  playTimer;
  replay() {
    this.replayDisabled = true;

    this.currentRatio = 0;
    this.changeRatio();

    this.playTimer = setInterval(this.playInterval.bind(this), 20);
  }

  playInterval() {
    this.currentRatio += this.maxPinPathLength / (this.replayTotalTime / this.replayStepInMs);
    this.changeRatio();

    if (this.currentRatio >= this.maxPinPathLength) {
      clearInterval(this.playTimer);
      this.replayDisabled = false;
    }
  }

}
