import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiqueListComponent } from './statistique-list.component';

describe('StatistiqueListComponent', () => {
  let component: StatistiqueListComponent;
  let fixture: ComponentFixture<StatistiqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatistiqueListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
