const Router = require('koa-router');
const check = new Router();
const bodyparser = require('koa-bodyparser');
const controller = require('../utils/controller');
check.use(bodyparser()) //調用這個中間件取得前端Post的值
const randomModel = require('../utils/bingoUtil');

let getnum = new randomModel()

let checkConnect = 0;
let indices = [];


// 檢查是否連線
function check5(i1, i2, i3, i4, i5) {
    return (
        getnum.checkArray(i1, indices) &&
        getnum.checkArray(i2, indices) &&
        getnum.checkArray(i3, indices) &&
        getnum.checkArray(i4, indices) &&
        getnum.checkArray(i5, indices)
    );
}

function checkWin() {
    // console.log(indices);
    let connect = 0;
    if (check5(0, 1, 2, 3, 4)) {
        connect++;
    }
    if (check5(5, 6, 7, 8, 9)) {
        connect++;
    }
    if (check5(10, 11, 12, 13, 14)) {
        connect++;
    }
    if (check5(15, 16, 17, 18, 19)) {
        connect++;
    }
    if (check5(20, 21, 22, 23, 24)) {
        connect++;
    }
    if (check5(0, 5, 10, 15, 20)) {
        connect++;
    }
    if (check5(1, 6, 11, 16, 21)) {
        connect++;
    }
    if (check5(2, 7, 12, 17, 22)) {
        connect++;
    }
    if (check5(3, 8, 13, 18, 23)) {
        connect++;
    }
    if (check5(4, 9, 14, 19, 24)) {
        connect++;
    }
    if (check5(0, 6, 12, 18, 24)) {
        connect++;
    }
    if (check5(4, 8, 12, 16, 20)) {
        connect++;
    }
    checkConnect = connect;
}

check.post('/', async (ctx) => {
    console.log(ctx.request.body);
    let user = ctx.request.body.username;
    indices = ctx.request.body.indices;
    let model = ctx.request.body.model;

    checkWin();

    if (checkConnect > 1 && model == 'generate') {
        controller.getWin();
        controller.setWinnerName(user);
    } else if (checkConnect > 1 && model == 'playerchoice') {
        controller.getWinPC();
        controller.setWinnerNamePC(user);
    }

    ctx.body = 'success';

})

module.exports = check;