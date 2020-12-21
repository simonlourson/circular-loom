import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLoomComponent } from './multi-loom.component';

describe('MultiLoomComponent', () => {
  let component: MultiLoomComponent;
  let fixture: ComponentFixture<MultiLoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiLoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
