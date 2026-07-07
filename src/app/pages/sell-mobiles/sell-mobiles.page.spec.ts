import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellMobilesPage } from './sell-mobiles.page';

describe('SellMobilesPage', () => {
  let component: SellMobilesPage;
  let fixture: ComponentFixture<SellMobilesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SellMobilesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
