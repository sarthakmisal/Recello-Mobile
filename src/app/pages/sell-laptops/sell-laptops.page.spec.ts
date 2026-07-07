import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellLaptopsPage } from './sell-laptops.page';

describe('SellLaptopsPage', () => {
  let component: SellLaptopsPage;
  let fixture: ComponentFixture<SellLaptopsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SellLaptopsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
