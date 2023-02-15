import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PushModule } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';

import { OnMapDirectionLineComponent } from './on-map-direction-line.component';

describe('OnMapDirectionLineComponent', () => {
  let component: OnMapDirectionLineComponent;
  let fixture: ComponentFixture<OnMapDirectionLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnMapDirectionLineComponent],
      providers: [provideMockStore({})],
      imports: [PushModule],
    }).compileComponents();

    fixture = TestBed.createComponent(OnMapDirectionLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
