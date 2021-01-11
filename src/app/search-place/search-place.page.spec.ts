import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchPlacePage } from './search-place.page';

describe('SearchPlacePage', () => {
  let component: SearchPlacePage;
  let fixture: ComponentFixture<SearchPlacePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPlacePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPlacePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
