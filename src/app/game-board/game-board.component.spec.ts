import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //it('should process new game click', function () {
  //  let newGameButton = element.all(by.tagName('app-toolbar')).get(0)
  //    .all(by.tagName('button')).get(0);
  //  newGameButton.click().then(function() {
  //    spyOn(GameBoardComponent, 'newGameClicked')
  //    expect(GameBoardComponent.newGameClicked()).toHaveBeenCalled();
  //  });
  //});
});
