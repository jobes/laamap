import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';

import { NavigationDialogComponent } from './navigation-dialog.component';

describe('NavigationDialogComponent', () => {
  let component: NavigationDialogComponent;
  let fixture: ComponentFixture<NavigationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule],
      declarations: [NavigationDialogComponent],
      providers: [provideMockStore({})],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
