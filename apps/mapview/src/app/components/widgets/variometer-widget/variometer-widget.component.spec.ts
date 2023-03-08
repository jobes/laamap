import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { MapService } from '../../../services/map/map.service';
import { VariometerWidgetComponent } from './variometer-widget.component';

describe('VariometerWidgetComponent', () => {
  let component: VariometerWidgetComponent;
  let fixture: ComponentFixture<VariometerWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariometerWidgetComponent],
      providers: [
        provideMockStore({}),
        { provide: MapService, useValue: { geolocation$: of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VariometerWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
