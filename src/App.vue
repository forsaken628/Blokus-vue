<template>
    <div id="app">
        <div class="container">
            <h1 class="row" style="margin-bottom: 40px">
                Blokus
            </h1>
            <div class="row" style="margin-bottom: 40px">
                <div class="col-xs-3"></div>
                <div class="col-xs-6">
                    <checkerboard id="game" :width="14" :show="show1" :start="[45,150]" @click-td="ddd"
                                  @mouse-enter-td="move"
                                  @mouse-leave="leave"></checkerboard>
                </div>
                <div class="col-xs-3">
                    <checkerboard :width="5" :show="show2"></checkerboard>
                    <label>棋子<select v-model="selected">
                        <option v-for="(v,k) in player" :value="k">{{v}}</option>
                    </select></label>
                    <button type="button" @click="direction++">旋转</button>
                    <button type="button" @click="inverse=!inverse">镜像</button>
                </div>
            </div>
            <div class="row">
                <ol class="col-xs-12">
                    <li>选颜色，点 new game</li>
                    <li>另打开一个页面，将 room id 复制进去，点 join game</li>
                    <li>蓝色先走，红色后走</li>
                    <li>
                        游戏开始时，要把己方颜色的棋子从棋盘起点处（红色格）依次摆放到棋盘上，每个棋子只能与同色棋子的棋角相连，不允许沿同色棋边贴着摆放。在游戏的过程中，您不能只埋头放置自己的方块片，还必须要阻止别人的放置，以便最终让您成为赢家!
                    </li>
                    <li>遇到不可恢复的错误时，点
                        <button type="button" id="clean">clean</button>
                        ，清除野狗后端云的数据，
                        <button type="button" id="debug" @click="debug">debug</button>
                    </li>
                    <li>10秒一次心跳包，15秒超时后可重新登陆</li>
                    <li>四人房，也以后再说</li>
                </ol>
            </div>
        </div>

        <modal v-show="modalShow" @close="modalShow=false"></modal>
    </div>
</template>

<script>
  'use strict';

  import checkerboard from './Checkerboard.vue'
  import modal from './Modal.vue'
  import Vue from 'vue'
  import { Point } from './util'

  let m1 = Array(195).fill(0);

  export default {
    name: 'app',
    data () {
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
        selected: 0,
        inverse: false,
        direction: 0,
        show1: Array(195).fill(0),
        modalShow: true,
        color: 1
      }
    },
    components: {
      checkerboard,
      modal
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
        return render(Array(25).fill(0), this.piece, new Point(5, 3, 3), this.color);
      }
    },
    methods: {
      debug(){
        if (this.color === 4) {
          this.color = 1;
        } else {
          this.color++;
        }
      },
      ddd(node){
        if (!boundCheck(this.piece, node))
          return;
        m1 = render(m1, this.piece, node, this.color);
      },
      move(node){
        this.show1 = m1;
        if (boundCheck(this.piece, node) && overlapCheck(m1, this.piece, node)) {
          this.show1 = render(m1, this.piece, node, this.color);
        }
      },
      leave(){
        this.show1 = m1;
      }
    }
  }

  function boundCheck (piece, node) {
    piece = piece.getPiece();

    return !(piece.v2 + node.x < 0
    || piece.v1 + node.x >= node.width
    || piece.h2 + node.y < 0
    || piece.h1 + node.y >= node.width)
  }

  function overlapCheck (base, piece, node) {
    piece = piece.getPiece();
    let nodeArr = piece.nodeArr;
    for (let i in nodeArr) {
      if (base[node.x + nodeArr[i][0] + (node.y + nodeArr[i][1]) * node.width] !== 0) {
        return false;
      }
    }
    return true;
  }

  function sideCheck (base, piece, node, color) {
    let side = piece.getPiece().side;
    let x = node.x;
    let y = node.y;
    let width = node.width;
    for (let i in side) {
      if (x + side[i][0] >= 0
        && x + side[i][0] < width
        && y + side[i][1] >= 0
        && y + side[i][1] < width
        && base[x + side[i][0] + (y + side[i][1]) * width] === color)
        return false;
    }
    return true;
  }

  function cornerCheck (base, piece, node, color) {
    let corner = piece.getPiece().corner;
    let x = node.x;
    let y = node.y;
    let width = node.width;
    for (let i in corner) {
      if (x + corner[i][0] >= 0
        && x + corner[i][0] < width
        && y + corner[i][1] >= 0
        && y + corner[i][1] < width
        && base[x + corner[i][0] + (y + corner[i][1]) * width] === color) {
        return true;
      }
    }
    return false;
  }

  function startCheck (now, width, color) {
    if (width === 14) {
      return (now[45] === color || now[150] === color);
    } else {
      return (now[0] === color
      || now[width - 1] === color
      || now[width * (width - 1)] === color
      || now[width * width - 1] === color);
    }
  }

  function render (base, piece, node, color) {
    piece = piece.getPiece();
    let nodeArr = piece.nodeArr;
    let arr = base.slice(0);

    for (let i in nodeArr) {
      let j = node.x + nodeArr[i][0] + (node.y + nodeArr[i][1]) * node.width;
      arr[j] = color;
    }
    return arr;
  }

  function Piece (id) {
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

    let nodeArr, h1 = 0, h2 = 0, v1 = 0, v2 = 0, inverse = false, direction = 0;
    let side = {}, corner = {};

    this.initPiece = function (id) {
      nodeArr = PIECES[id];
      for (let i in nodeArr) {
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
        let i;
        for (i in nodeArr) {
          nodeArr[i] = [-nodeArr[i][1], nodeArr[i][0]];//顺时针90度
        }
        for (i in side) {
          side[i] = ([-side[i][1], side[i][0]]);//顺时针90度
        }
        for (i in corner) {
          corner[i] = ([-corner[i][1], corner[i][0]]);//顺时针90度
        }
        let t = v1;
        v1 = -h2;
        h2 = v2;
        v2 = -h1;
        h1 = t;
      }
    };

    this.mirror = function () {
      inverse = !inverse;
      for (let i in nodeArr) {
        nodeArr[i][0] = -nodeArr[i][0];
      }
      let t;
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
    .aqua {
        background-color: aqua;
    }

    .red {
        background-color: #F55;
    }

    .green {
        background-color: #32CD32;
    }

    .orange {
        background-color: orange;
    }
</style>
