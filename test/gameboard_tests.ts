import { GameCore } from "../GameBoard class";

describe("validateLocation", function () {
    it("approves given location", function() {
        let board: GameCore.Board;
        let location: GameCore.Coordinate = [2, 3];
        let isValidated: boolean = board.isLocationValid.apply(location);

        expect(isValidated).toBe(true);
    });
});