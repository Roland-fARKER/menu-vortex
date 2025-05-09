import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuLinkShareComponent } from './menu-link-share.component';

describe('MenuLinkShareComponent', () => {
  let component: MenuLinkShareComponent;
  let fixture: ComponentFixture<MenuLinkShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuLinkShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuLinkShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
