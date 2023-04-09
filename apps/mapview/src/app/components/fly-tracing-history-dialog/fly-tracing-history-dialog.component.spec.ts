import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlyTracingHistoryDialogComponent } from './fly-tracing-history-dialog.component';

describe('FlyTracingHistoryDialogComponent', () => {
  let component: FlyTracingHistoryDialogComponent;
  let fixture: ComponentFixture<FlyTracingHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlyTracingHistoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FlyTracingHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
