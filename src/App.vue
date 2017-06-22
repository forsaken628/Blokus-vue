<template>
    <div class="container" id="app">
        <div class="row">
            <ol class="col-xs-2">
                <li>确实很丑，样式以后再说</li>
                <li>选颜色，点 new game</li>
                <li>另打开一个页面，将 room id 复制进去，点 join game</li>
                <li>蓝色先走，红色后走</li>
                <li>
                    游戏开始时，要把己方颜色的棋子从棋盘起点处（红色格）依次摆放到棋盘上，每个棋子只能与同色棋子的棋角相连，不允许沿同色棋边贴着摆放。在游戏的过程中，您不能只埋头放置自己的方块片，还必须要阻止别人的放置，以便最终让您成为赢家!
                </li>
                <li>遇到不可恢复的错误时，点
                    <button type="button" id="clean">clean</button>
                    ，清除野狗后端云的数据，
                    <button type="button" id="debug">debug</button>
                </li>
                <li>10秒一次心跳包，15秒超时后可重新登陆</li>
                <li>四人房，也以后再说</li>
            </ol>
            <div class="col-xs-8">
                <checkerboard :width="12" :show="show1" @click-td="ddd" @mouse-enter-td="med"
                              @mouse-leave="ml"></checkerboard>
            </div>
            <div class="col-xs-2">
                <checkerboard :width="5" :show="show2"></checkerboard>
                <label>棋子<select v-model="selected">
                    <option v-for="(v,k) in player" :value="k">{{v}}</option>
                </select></label>
                <button type="button" @click="direction++">旋转</button>
                <button type="button" @click="inverse=!inverse">镜像</button>
            </div>
        </div>
    </div>
</template>

<script>
    import checkerboard from './Checkerboard.vue'
    import Vue from 'vue'
    import {Point} from './util'

    export default {
        name: 'app',
        data () {
            let show1 = Array(143).fill(0);

            let player = {
                0: '1',
                1: '2',
                2: '3-1',
                3: '3-2',
                4: '4-1',
                5: '4-2',
                6: '4-3',
                7: '4-4',
                8: '4-5',
                9: '5-1',
                10: '5-2',
                11: '5-3',
                12: '5-4',
                13: '5-5',
                14: '5-6',
                15: '5-7',
                16: '5-8',
                17: '5-9',
                18: '5-10',
                19: '5-11',
                20: '5-12'
            };

            return {
                player,
                selected: 5,
                inverse: false,
                direction: 0,
                show1,
            }
        },
        components: {
            checkerboard
        },
        computed: {
            piece: function () {
                let p = new Piece(this.selected);
                if (this.inverse)
                    p.mirror();
                p.roll(this.direction);
                return p;
            },
            show2: function () {
                return changeTableNow(Array(25).fill(0), this.piece, new Point(5, 3, 3), 1);
            }
        },
        methods: {
            ddd(node){
                console.log(node);
                Vue.set(this.show1, node.index(), 1);
            },
            med(node){
                this.show1 = changeTableNow(Array(143).fill(0), this.piece, node, 1);
            },
            ml(){
                this.show1 = Array(143).fill(0);
            }
        }
    }

    function changeTableNow(base, piece, node, color) {
        piece = piece.getPiece();
        var nodeArr = piece.nodeArr;
        var i;

        let arr = base.slice(0);

        if (piece.v2 + node.x < 0
            || piece.v1 + node.x >= node.width
            || piece.h2 + node.y < 0
            || piece.h1 + node.y >= node.width) {
            return arr;
        }


        for (i in nodeArr) {
            var j = node.x + nodeArr[i][0] + (node.y + nodeArr[i][1]) * node.width;
            arr[j] = color;
        }
        return arr;
    }

    function Piece(id) {
        //坐标系右下为正
        const PIECES = [[[0, 0]],
            [[0, 0], [1, 0]],
            [[-1, 0], [0, 0], [1, 0]],
            [[0, 0], [1, 0], [0, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]],
            [[-1, 0], [0, 0], [1, 0], [2, 0]],
            [[-1, 0], [0, 0], [1, 0], [-1, 1]],
            [[0, -1], [-1, 0], [0, 0], [1, 0]],
            [[-1, 0], [0, 0], [0, 1], [1, 1]],
            [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]],
            [[-1, 0], [-1, 1], [0, 0], [1, 0], [2, 0]],
            [[-1, 0], [0, 0], [1, 0], [2, 0], [0, 1]],
            [[-1, 0], [0, 0], [1, 0], [1, 1], [2, 1]],
            [[-1, -1], [0, -1], [0, 0], [0, 1], [1, 1]],
            [[-1, 0], [0, 0], [1, 0], [-1, 1], [1, 1]],
            [[-1, 0], [0, 0], [1, 0], [0, 1], [1, 1]],
            [[-1, -1], [-1, 0], [-1, 1], [0, -1], [1, -1]],
            [[-1, -1], [-1, 0], [-1, 1], [0, 0], [1, 0]],
            [[0, -1], [-1, 0], [0, 0], [1, 0], [-1, 1]],
            [[0, -1], [-1, 0], [0, 0], [1, 0], [0, 1]],
            [[-1, -1], [0, -1], [0, 0], [1, 0], [1, 1]]];

        var nodeArr, h1 = 0, h2 = 0, v1 = 0, v2 = 0, inverse = false, direction = 0;
        var side = {}, corner = {};

        this.initPiece = function (id) {
            nodeArr = PIECES[id];
            for (var i in nodeArr) {
                h1 = nodeArr[i][1] > h1 ? nodeArr[i][1] : h1;
                h2 = nodeArr[i][1] < h2 ? nodeArr[i][1] : h2;
                v1 = nodeArr[i][0] > v1 ? nodeArr[i][0] : v1;
                v2 = nodeArr[i][0] < v2 ? nodeArr[i][0] : v2;
                side[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1])] = [nodeArr[i][0] + 1, nodeArr[i][1]];
                side[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1])] = [nodeArr[i][0] - 1, nodeArr[i][1]];
                side[(nodeArr[i][0]) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0], nodeArr[i][1] + 1];
                side[(nodeArr[i][0]) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0], nodeArr[i][1] - 1];
                corner[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0] + 1, nodeArr[i][1] + 1];
                corner[(nodeArr[i][0] + 1) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0] + 1, nodeArr[i][1] - 1];
                corner[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1] + 1)] = [nodeArr[i][0] - 1, nodeArr[i][1] + 1];
                corner[(nodeArr[i][0] - 1) + ',' + (nodeArr[i][1] - 1)] = [nodeArr[i][0] - 1, nodeArr[i][1] - 1];
            }
            for (i in nodeArr) {
                delete side[nodeArr[i][0] + ',' + nodeArr[i][1]];
                delete corner[nodeArr[i][0] + ',' + nodeArr[i][1]];
            }
            for (i in side) {
                delete corner[i];
            }

        };

        this.roll = function (times) {
            times %= 4;
            direction = (direction + (inverse ? 4 - times : times)) % 4;
            while (times--) {
                var i;
                for (i in nodeArr) {
                    nodeArr[i] = [-nodeArr[i][1], nodeArr[i][0]];//顺时针90度
                }
                for (i in side) {
                    side[i] = ([-side[i][1], side[i][0]]);//顺时针90度
                }
                for (i in corner) {
                    corner[i] = ([-corner[i][1], corner[i][0]]);//顺时针90度
                }
                var t = v1;
                v1 = -h2;
                h2 = v2;
                v2 = -h1;
                h1 = t;
            }
        };

        this.mirror = function () {
            inverse = !inverse;
            for (var i in nodeArr) {
                nodeArr[i][0] = -nodeArr[i][0];
            }
            var t;
            t = v1;
            v1 = -v2;
            v2 = -t;
            for (i in side) {
                side[i][0] = -side[i][0];
            }
            for (i in corner) {
                corner[i][0] = -corner[i][0];
            }
        };

        this.getPiece = function () {
            return {
                id: id,
                nodeArr: nodeArr,
                v1: v1,
                v2: v2,
                h1: h1,
                h2: h2,
                inverse: inverse,
                direction: direction,
                side: side,
                corner: corner
            }
        };

        this.initPiece(id);
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
