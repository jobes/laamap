import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LetModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { getTranslocoModule } from '../../../../transloco-testing.module';
import { VarioWidgetSettingsComponent } from './vario-widget-settings.component';

describe('VarioWidgetSettingsComponent', () => {
  let component: VarioWidgetSettingsComponent;
  let fixture: ComponentFixture<VarioWidgetSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VarioWidgetSettingsComponent],
      providers: [provideMockStore({})],
      imports: [
        MatSnackBarModule,
        getTranslocoModule(),
        LetModule,
        MatExpansionModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VarioWidgetSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
