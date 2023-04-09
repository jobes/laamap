import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideMockStore } from '@ngrx/store/testing';

import { getTranslocoModule } from '../../../../transloco-testing.module';
import { TrackingWidgetSettingsComponent } from './tracking-widget-settings.component';

describe('TrackingWidgetSettingsComponent', () => {
  let component: TrackingWidgetSettingsComponent;
  let fixture: ComponentFixture<TrackingWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingWidgetSettingsComponent],
      providers: [provideMockStore({})],
      imports: [getTranslocoModule(), MatExpansionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
