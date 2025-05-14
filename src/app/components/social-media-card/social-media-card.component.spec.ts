import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaCardComponent } from './social-media-card.component';

describe('SocialMediaCardComponent', () => {
  let component: SocialMediaCardComponent;
  let fixture: ComponentFixture<SocialMediaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialMediaCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SocialMediaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
