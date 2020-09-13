import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoomHelperComponent } from './loom-helper.component';

describe('LoomHelperComponent', () => {
  let component: LoomHelperComponent;
  let fixture: ComponentFixture<LoomHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoomHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoomHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
