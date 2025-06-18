import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertDemandeComponent } from './insert-demande.component';

describe('InsertDemandeComponent', () => {
  let component: InsertDemandeComponent;
  let fixture: ComponentFixture<InsertDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertDemandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
