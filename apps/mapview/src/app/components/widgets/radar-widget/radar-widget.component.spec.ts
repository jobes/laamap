import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { RainViewerService } from '../../../services/rain-viewer/rain-viewer.service';
import { RadarWidgetComponent } from './radar-widget.component';

describe('RadarWidgetComponent', () => {
  let component: RadarWidgetComponent;
  let fixture: ComponentFixture<RadarWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadarWidgetComponent],
      providers: [
        provideMockStore({}),
        { provide: RainViewerService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadarWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
