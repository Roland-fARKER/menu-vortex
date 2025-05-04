import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDigitalComponent } from './menu-digital.component';

describe('MenuDigitalComponent', () => {
  let component: MenuDigitalComponent;
  let fixture: ComponentFixture<MenuDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuDigitalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
