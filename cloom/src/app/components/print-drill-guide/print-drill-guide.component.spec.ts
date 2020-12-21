import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDrillGuideComponent } from './print-drill-guide.component';

describe('PrintDrillGuideComponent', () => {
  let component: PrintDrillGuideComponent;
  let fixture: ComponentFixture<PrintDrillGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintDrillGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintDrillGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
