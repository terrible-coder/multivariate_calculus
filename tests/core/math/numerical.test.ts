import { levicivita, kronecker } from "../../../src/core/math/numerical";

describe("Levi-Civita symbol", function() {
    it("2 dimensions", function() {
        expect(levicivita(1, 1)).toBe(0);
        expect(levicivita(1, 2)).toBe(1);
        expect(levicivita(2, 1)).toBe(-1);
        expect(levicivita(2, 2)).toBe(0);
    });

    it("3 dimensions", function() {
        const symbol = [
            [[0, 0, 0],
             [0, 0, 1],
             [0, -1, 0]],
            [[0, 0, -1],
             [0, 0, 0],
             [1, 0, 0]],
            [[0, 1, 0],
             [-1, 0, 0],
             [0, 0, 0]]
        ];
        for(let i = 0; i < 3; i++)
            for(let j = 0; j < 3; j++)
                for(let k = 0; k < 3; k++)
                    expect(levicivita(i+1,j+1,k+1)).toBe(symbol[i][j][k]);
    });

    it("Throws errors", function() {
        expect(() => levicivita(1, 2, 4)).toThrow();
    });
});

describe("Kronecker delta symbol", function() {
    it("2 dimensions", function() {
        for(let i = 0; i < 10; i++)
            for(let j = 0; j < 10; j++)
                expect(kronecker(i, j)).toBe(i == j ? 1: 0);
    });

    it("3 dimensions", function() {
        
    });
});