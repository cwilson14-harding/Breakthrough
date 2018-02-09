import { Coordinate } from '../src/app/models/game-core/coordinate';
import {Board} from '../src/app/models/board';

describe('validateLocation', function () {
    it('approves given location', function() {
        const board: Board = new Board();
        const location: Coordinate = [2, 3];
        const isValidated: boolean = board.isLocationValid.apply(location);

        expect(isValidated).toBe(true);
    });
});
