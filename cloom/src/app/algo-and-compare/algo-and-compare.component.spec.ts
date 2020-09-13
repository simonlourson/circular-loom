import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlgoAndCompareComponent } from './algo-and-compare.component';

describe('AlgoAndCompareComponent', () => {
  let component: AlgoAndCompareComponent;
  let fixture: ComponentFixture<AlgoAndCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlgoAndCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlgoAndCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
