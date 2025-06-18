import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeUpdateComponent } from './demande-update.component';

describe('DemandeUpdateComponent', () => {
  let component: DemandeUpdateComponent;
  let fixture: ComponentFixture<DemandeUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemandeUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
