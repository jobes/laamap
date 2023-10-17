import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInterestPointDialogComponent } from './create-interest-point-dialog.component';

describe('CreateInterestPointDialogComponent', () => {
  let component: CreateInterestPointDialogComponent;
  let fixture: ComponentFixture<CreateInterestPointDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInterestPointDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInterestPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
