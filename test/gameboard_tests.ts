import * as GameCore from "../GameBoard class";
let board = new GameCore.board;
// TODO: Alaina - fix type errors

describe("validateLocation", function () {
    it("approves given location", function() {
        location: GameCore.Coordinate = [2, 3];
        isValidated: boolean = GameCore.IsLocationValid(location);

        expect(isValidated).toBe(true);
    });
});