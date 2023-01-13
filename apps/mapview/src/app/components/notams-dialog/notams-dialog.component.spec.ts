import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotamsDialogComponent } from './notams-dialog.component';

describe('NotamsDialogComponent', () => {
  let component: NotamsDialogComponent;
  let fixture: ComponentFixture<NotamsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotamsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotamsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
