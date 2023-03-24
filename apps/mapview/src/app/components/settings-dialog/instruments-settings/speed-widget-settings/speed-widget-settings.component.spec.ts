import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideMockStore } from '@ngrx/store/testing';

import { getTranslocoModule } from '../../../../transloco-testing.module';
import { SpeedWidgetSettingsComponent } from './speed-widget-settings.component';

describe('SpeedWidgetSettingsComponent', () => {
  let component: SpeedWidgetSettingsComponent;
  let fixture: ComponentFixture<SpeedWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedWidgetSettingsComponent],
      providers: [provideMockStore({})],
      imports: [MatSnackBarModule, getTranslocoModule(), MatExpansionModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SpeedWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
