import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettignsComponent } from './settigns.component';

describe('SettignsComponent', () => {
  let component: SettignsComponent;
  let fixture: ComponentFixture<SettignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettignsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
