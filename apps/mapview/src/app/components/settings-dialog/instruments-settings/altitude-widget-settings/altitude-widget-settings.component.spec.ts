import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideMockStore } from '@ngrx/store/testing';

import { getTranslocoModule } from '../../../../shared/transloco-testing.module';
import { AltitudeWidgetSettingsComponent } from './altitude-widget-settings.component';

describe('AltitudeWidgetSettingsComponent', () => {
  let component: AltitudeWidgetSettingsComponent;
  let fixture: ComponentFixture<AltitudeWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltitudeWidgetSettingsComponent],
      providers: [provideMockStore({})],
      imports: [getTranslocoModule(), MatExpansionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AltitudeWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
