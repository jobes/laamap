import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLocationMenuComponent } from './map-location-menu.component';

describe('MapLocationMenuComponent', () => {
  let component: MapLocationMenuComponent;
  let fixture: ComponentFixture<MapLocationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapLocationMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapLocationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
