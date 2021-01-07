import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClientMapPage } from './client-map.page';

describe('CourseOngoingPage', () => {
  let component: ClientMapPage;
  let fixture: ComponentFixture<ClientMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientMapPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});