import { Coordinate } from '../app/models/game-core/coordinate';
import {Board} from '../app/models/board';

describe('GameBoard', function () {
    it('approves given location', function() {
        const board: Board = new Board();
        const location: Coordinate = new Coordinate(2,3);
        const isValidated: boolean = board.isLocationValid.apply(location);

        expect(isValidated).toBe(true);
    });
});
