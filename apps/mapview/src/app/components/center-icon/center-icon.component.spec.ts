import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterIconComponent } from './center-icon.component';

describe('CenterIconComponent', () => {
  let component: CenterIconComponent;
  let fixture: ComponentFixture<CenterIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CenterIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
