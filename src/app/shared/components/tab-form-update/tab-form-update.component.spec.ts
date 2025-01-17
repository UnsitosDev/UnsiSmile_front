import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFormUpdateComponent } from './tab-form-update.component';

describe('TabFormUpdateComponent', () => {
  let component: TabFormUpdateComponent;
  let fixture: ComponentFixture<TabFormUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabFormUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabFormUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
