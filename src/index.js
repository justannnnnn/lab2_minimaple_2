import { MiniMaple } from "./miniMaple.js";

document.addEventListener('DOMContentLoaded',setup)

function setup() {
    window.symbolicDiff = symbolicDiff;
    document.getElementById('diffBtn').addEventListener('click', () => {
        const expr = document.getElementById('expression').value;
        const variable = document.getElementById('variable').value;
        const mm = new MiniMaple();
        try {
            const result = mm.symbolicDiff(expr, variable);
            document.getElementById('result').innerText = result;
        } catch (err) {
            document.getElementById('result').innerText = 'Ошибка: ' + err.message;
        }
    });
}