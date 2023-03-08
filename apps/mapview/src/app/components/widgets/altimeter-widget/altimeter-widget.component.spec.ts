import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { LetModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { getTranslocoModule } from '../../../shared/transloco-testing.module';
import { selectInstrumentAltiMeterWidget } from '../../../store/core/core.selectors';
import { AltimeterWidgetComponent } from './altimeter-widget.component';

describe('AltimeterWidgetComponent', () => {
  let component: AltimeterWidgetComponent;
  let fixture: ComponentFixture<AltimeterWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AltimeterWidgetComponent],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectInstrumentAltiMeterWidget, value: {} }],
        }),
        { provide: MapService, useValue: { geolocation$: of(null) } },
      ],
      imports: [
        getTranslocoModule(),
        MatExpansionModule,
        MatDialogModule,
        LetModule,
        DragDropModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AltimeterWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
