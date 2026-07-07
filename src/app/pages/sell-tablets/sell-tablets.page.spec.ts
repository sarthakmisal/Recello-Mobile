import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellTabletsPage } from './sell-tablets.page';

describe('SellTabletsPage', () => {
  let component: SellTabletsPage;
  let fixture: ComponentFixture<SellTabletsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SellTabletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
