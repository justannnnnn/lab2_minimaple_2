class MiniMaple{
    parseTerm(term) {
        // Разбор слагаемого на коэффициент, переменную и степень(2*x^2)

        // ([+-]?\d*) - любое количество цифр(включая 0) и, возможно, + или -
        // \*? - возможна *
        // ([a-zA-Z]) - переменная
        // (?:\^(\d+))? - сначала скобки, которые показывают, что выражение не входит в группу, 
        // а потом после ^ - одна или более цифр(всего этого блока может не быть)
        const match = term.match(/^([+-]?\d*)\*?([a-zA-Z])(?:\^(\d+))?$/);
        if (!match) return null;

        let [, coef, varName, power] = match;
        coef = coef === '' || coef === '+' ? 1 : coef === '-' ? -1 : parseInt(coef);
        power = power ? parseInt(power) : 1; // если степени нет, то принимаем ее единицей

        return { coef, varName, power };
    }

    differentiateTerm(parsed, variable) {
        // если в поле переменной ее нет => константа и дальшее ее обработаем
        if (parsed.varName !== variable) return null;

        const newCoef = parsed.coef * parsed.power;
        const newPower = parsed.power - 1;

        return { coef: newCoef, varName: parsed.varName, power: newPower };
    }

    addTermToMap(diffMap, constantSum, term) {
        // Добавляем слагаемое в diffMap или в константы
        const key = term.power === 0 ? 'const' : term.varName + '^' + term.power;

        if (key === 'const') {
            return constantSum + term.coef; // если константа, то складываем с общей суммой контсант
        } else {
            diffMap[key] = (diffMap[key] || 0) + term.coef; // добавляем коэффициент к уже имеющимся слагаемым с такой же степенью
            return constantSum;
        }
    }

    formatResult(diffMap, constantSum) {
        const resultTerms = [];

        for (let key in diffMap) {
            const coef = diffMap[key];
            if (coef === 0) continue;

            const [varName, power] = key.split('^');
            const p = parseInt(power);
            if (p === 1) resultTerms.push(`${coef}*${varName}`);
            else resultTerms.push(`${coef}*${varName}^${p}`);
        }

        if (constantSum !== 0) resultTerms.push(constantSum.toString());
        if (resultTerms.length === 0) return '0';

        // (/\+\s-/g, '- ') - ищем все места где склеили + и - и оставляем только -
        return resultTerms.join(' + ').replace(/\+\s-/g, '- ');
    }


    symbolicDiff(expr, variable) {
        if (!/^[0-9a-zA-Z\^\*\+\-\s]+$/.test(expr)) {
            throw new Error("Только символы +, -, *, ^ и числа/переменные допустимы");
        }

        expr = expr.replace(/\s+/g, '');
        const terms = expr.match(/([+-]?[^+-]+)/g);

        const diffMap = {}; // словарь, в котором ключом будет степень полинома, а значения - его итоговый коэффициент
        let constantSum = 0; // сумма констант, полученных при дифф-нии

        for (let term of terms) {
            const parsed = this.parseTerm(term);

            if (!parsed) {
                if (term.includes(variable)) throw new Error("Формат слагаемого неверный: " + term);
                continue; // константа
            }

            const diffTerm = this.differentiateTerm(parsed, variable);
            if (!diffTerm) continue; // константа

            constantSum = this.addTermToMap(diffMap, constantSum, diffTerm); // если получили константу, то обновляем ее значение
            // или в самой функции наполняем словарь
        }

        return this.formatResult(diffMap, constantSum);
    }
}

export {MiniMaple};