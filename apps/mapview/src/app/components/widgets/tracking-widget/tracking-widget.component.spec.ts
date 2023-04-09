import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { Observable } from 'rxjs';

import { TrackingWidgetComponent } from './tracking-widget.component';

describe('TrackingWidgetComponent', () => {
  let component: TrackingWidgetComponent;
  let fixture: ComponentFixture<TrackingWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [TrackingWidgetComponent],
      providers: [
        provideMockStore({}),
        provideMockActions(() => new Observable<Action>()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
