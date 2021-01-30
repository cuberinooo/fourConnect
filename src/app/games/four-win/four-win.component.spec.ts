import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FourWinComponent } from './four-win.component';

describe('FourWinComponent', () => {
  let component: FourWinComponent;
  let fixture: ComponentFixture<FourWinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FourWinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FourWinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
