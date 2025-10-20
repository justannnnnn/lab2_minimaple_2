import { MiniMaple } from "../src/miniMaple.js";

describe("MiniMaple internal methods", () => {
    let mm;

    beforeEach(() => {
        mm = new MiniMaple();
    });

    describe("parseTerm()", () => {
        test("парсинг простого члена 3*x^2", () => {
            expect(mm.parseTerm("3*x^2")).toEqual({ coef: 3, varName: "x", power: 2 });
        });

        test("парсинг отрицательного коэффициента", () => {
            expect(mm.parseTerm("-2*y^5")).toEqual({ coef: -2, varName: "y", power: 5 });
        });

        test("парсинг члена без степени", () => {
            expect(mm.parseTerm("4*x")).toEqual({ coef: 4, varName: "x", power: 1 });
        });

        test("парсинг переменной без коэффициента", () => {
            expect(mm.parseTerm("x")).toEqual({ coef: 1, varName: "x", power: 1 });
        });

        test("парсинг -x", () => {
            expect(mm.parseTerm("-x")).toEqual({ coef: -1, varName: "x", power: 1 });
        });

        test("неправильный формат → null", () => {
            expect(mm.parseTerm("3")).toBeNull();
        });
    });

    describe("differentiateTerm()", () => {
        test("правильная производная", () => {
            const term = { coef: 3, varName: "x", power: 4 };
            expect(mm.differentiateTerm(term, "x")).toEqual({ coef: 12, varName: "x", power: 3 });
        });

        test("другая переменная → null", () => {
            const term = { coef: 3, varName: "y", power: 2 };
            expect(mm.differentiateTerm(term, "x")).toBeNull();
        });
    });

    describe("addTermToMap()", () => {
        test("добавляет обычный член", () => {
            const diffMap = {};
            mm.addTermToMap(diffMap, 0, { coef: 5, varName: "x", power: 2 });
            expect(diffMap).toEqual({ "x^2": 5 });
        });

        test("складывает одинаковые степени", () => {
            const diffMap = { "x^2": 5 };
            mm.addTermToMap(diffMap, 0, { coef: 3, varName: "x", power: 2 });
            expect(diffMap).toEqual({ "x^2": 8 });
        });

        test("добавляет константу", () => {
            const diffMap = {};
            const result = mm.addTermToMap(diffMap, 0, { coef: 7, varName: "x", power: 0 });
            expect(result).toBe(7);
        });
    });

    describe("formatResult()", () => {
        test("форматирует результат полинома", () => {
            const diffMap = { "x^2": 5, "x^1": -3 };
            expect(mm.formatResult(diffMap, 0)).toBe("5*x^2 - 3*x");
        });

        test("учитывает константу", () => {
            const diffMap = { "x^1": 2 };
            expect(mm.formatResult(diffMap, 4)).toBe("2*x + 4");
        });

        test("нулевой результат", () => {
            expect(mm.formatResult({}, 0)).toBe("0");
        });
    });
});


describe("MiniMaple.symbolicDiff", () => {
    let mm;
    beforeEach(() => {
        mm = new MiniMaple();
    });

    test("простая степень", () => {
        expect(mm.symbolicDiff("4*x^3", "x")).toBe("12*x^2");
    });

    test("сумма членов", () => {
        expect(mm.symbolicDiff("3*x^3 + 2*x - 5", "x")).toBe("9*x^2 + 2");
    });

    test("только константа", () => {
        expect(mm.symbolicDiff("7", "x")).toBe("0");
    });

    test("другая переменная", () => {
        expect(mm.symbolicDiff("5*x^2", "y")).toBe("0");
    });

    test("недопустимый символ", () => {
        expect(() => mm.symbolicDiff("sin(x)", "x")).toThrow();
    });

    test("некорректный формат", () => {
        expect(() => mm.symbolicDiff("3**x", "x")).toThrow();
    });
});