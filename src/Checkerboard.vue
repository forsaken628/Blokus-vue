<template>
    <table @mouseleave="mouseLeave()">
        <tr v-for="y in width">
            <td v-for="x in width" :class=" show | showClass(width, x, y)" @click="click(x, y)"
                @mouseenter="mouseEnter(x,y)"></td>
        </tr>
    </table>
</template>

<script>
    import {Point} from './util'

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
            showClass(show, width, x, y){
                let p = new Point(width, x, y);

                return ["", "aqua", "red", "green", "orange"][show[p.index()]];
            }
        }
    }
</script>

<style>
    td {
        border: 1px solid blue;
        width: 24px;
        height: 24px;
    }

    td.start {
        border: 4px double red;
        width: 12px;
        height: 12px;
    }

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
