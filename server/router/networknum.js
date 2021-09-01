const Router = require('koa-router');
const networknum = new Router();
const randomModel = require('../utils/bingoUtil');
const controller = require('../utils/controller');
const EventEmitter = require('events');

let dispatcher = new EventEmitter();
let netWorkNum = [];
let getnum = new randomModel()
let triigerGame = 0;
let delayTime = 3;
let timer = null;

// 每10秒產生數字
const game = function gameStart() {
    setInterval(function () {
        if (controller.checkWinner()) {
            clearInterval(game);
            let name = controller.getWinnerName();
            netWorkNum = `獲勝者 ${name}!!!`;
            return dispatcher.emit('update');
        }

        // 產生1~50數字
        let num = getnum.getRandomInt(1, 50);

        // 數字重復就重run
        while (getnum.checkArray(num, netWorkNum) && netWorkNum.length < 49) {
            console.log('重設數字');
            num = getnum.getRandomInt(1, 50);
        }
        netWorkNum.push(num);
        console.log(netWorkNum);

        // 通知所有客戶端資料有更新
        dispatcher.emit('update');
    }, delayTime * 1000)
}

// 過X秒後給client陣列
function delayed(ctx) {
    return new Promise((resolve, reject) => {
        dispatcher.once('update', function () {
            resolve(netWorkNum);
        });
    })
}
function timeout() {
    return new Promise((resolve, reject) => {
        timer = setTimeout(() => {
            console.log('timeout')
            resolve(netWorkNum);
        }, 15000)
    });
}

networknum.get('/', async (ctx) => {
    // 在觸發api後開始每10秒發送隨機數字
    if (triigerGame == 0) {
        game();
        triigerGame += 1;
    }

    // ctx.body = await delayed(ctx);
    clearTimeout(timer);
    ctx.body = await Promise.race([delayed(), timeout()]);
})

module.exports = networknum;


// 重復的數字重新篩選
// function checkArray(number, array) {
//     for (var count = 0; count < array.length; count++) {
//         if (array[count] == number) {
//             return true;
//         }
//     }
//     return false;
// }