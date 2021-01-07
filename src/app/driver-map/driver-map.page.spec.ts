import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DriverMapPage } from './driver-map.page';

describe('CourseOngoingPage', () => {
  let component: DriverMapPage;
  let fixture: ComponentFixture<DriverMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DriverMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});