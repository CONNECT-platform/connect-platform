import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultComponent } from './vault.component';

describe('VaultComponent', () => {
  let component: VaultComponent;
  let fixture: ComponentFixture<VaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
