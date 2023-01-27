import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { RainViewerService } from '../../../services/rain-viewer.service';
import { OnMapRadarComponent } from './on-map-radar.component';

describe('OnMapRadarComponent', () => {
  let component: OnMapRadarComponent;
  let fixture: ComponentFixture<OnMapRadarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnMapRadarComponent],
      providers: [
        provideMockStore({}),
        { provide: RainViewerService, useValue: {} },
      ],
      imports: [PushModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapRadarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
