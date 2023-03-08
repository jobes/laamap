import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentsSettingsComponent } from './instruments-settings.component';

describe('InstrumentsSettingsComponent', () => {
  let component: InstrumentsSettingsComponent;
  let fixture: ComponentFixture<InstrumentsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstrumentsSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrumentsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
