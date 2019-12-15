import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnalysePage } from './analyse.page';

describe('AnalysePage', () => {
  let component: AnalysePage;
  let fixture: ComponentFixture<AnalysePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
