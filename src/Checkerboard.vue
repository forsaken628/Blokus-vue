<template>
    <table @mouseleave="mouseLeave()">
        <tr v-for="y in width">
            <td v-for="x in width" :class=" show | showClass(start, width, x, y)" @click="click(x, y)"
                @mouseenter="mouseEnter(x,y)"></td>
        </tr>
    </table>
</template>

<script>
  'use strict';

  import { Point } from './util'

  export default {
    name: 'checkerboard',
    props: {
      width: {
        type: Number,
        required: true
      },
      show: {
        type: Array,
        required: true,
      },
      start: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data () {
      return {}
    },
    computed: {},
    methods: {
      click(x, y){
        this.$emit('click-td', new Point(this.width, x, y));
      },
      mouseEnter(x, y){
        this.$emit('mouse-enter-td', new Point(this.width, x, y));
      },
      mouseLeave(){
        this.$emit('mouse-leave');
      }
    },
    filters: {
      showClass(show, start, width, x, y){
        let index = new Point(width, x, y).index();
        return ["", "aqua", "red", "green", "orange"][show[index]] + (start.includes(index) ? ' start' : '');
      }
    }
  }
  //    let game = document.getElementById('game');
  //    let j = 0;
  //    game.childNodes.forEach((tr) => {
  //        j++;
  //        let i = 0;
  //        tr.childNodes.forEach((td) => {
  //            i++;
  //            let index = new Point(12, i, j).index();
  //            if (show[index] !== before[index]) {
  //                before[index] = show[index];
  //                td.className = removeClass(td.className, 'aqua red green orange')
  //                    + " " + ["", "aqua", "red", "green", "orange"][show[index]];
  //            }
  //        });
  //    });

  //    function removeClass(className, remove) {
  //        let removes = ( remove || "" ).split(/\s+/);
  //
  //        if (className) {
  //            let className = (" " + className + " ").replace(/[\t\r\n]/g, " ");
  //            // loop over each item in the removal list
  //            let c, cl;
  //            for (c = 0, cl = removes.length; c < cl; c++) {
  //                // Remove until there is nothing to remove,
  //                while (className.indexOf(" " + removes[c] + " ") > -1) {
  //                    className = className.replace(" " + removes[c] + " ", " ");
  //                }
  //            }
  //            return className.trim();
  //        }
  //    }
</script>

<style>
    td {
        border: 1px solid blue;
        width: 24px;
        height: 24px;
    }

    td.start {
        border: 2px solid red;
    }
</style>
