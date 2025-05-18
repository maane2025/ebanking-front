import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitOperationComponent } from './debit-operation.component';

describe('DebitOperationComponent', () => {
  let component: DebitOperationComponent;
  let fixture: ComponentFixture<DebitOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DebitOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
