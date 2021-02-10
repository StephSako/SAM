import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CourseOngoingPage } from './course-ongoing.page';

describe('CourseOngoingPage', () => {
  let component: CourseOngoingPage;
  let fixture: ComponentFixture<CourseOngoingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseOngoingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseOngoingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});