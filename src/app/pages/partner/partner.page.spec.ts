import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartnerPage } from './partner.page';

describe('PartnerPage', () => {
  let component: PartnerPage;
  let fixture: ComponentFixture<PartnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
