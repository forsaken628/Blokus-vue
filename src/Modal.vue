<template>
    <div class="modal" style="display: block" role="dialog">
        <div class="modal-dialog" role="document" style="width: 300px">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" aria-label="Close" @click="close()"><span
                            aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">Modal title</h4>
                </div>
                <div class="modal-body">
                    <div class="form-horizontal">
                        <div class="form-group">
                            <div class="col-md-6">
                                <button class="btn btn-default center-block" type="button"
                                        @click="tab = 'new'"
                                        :class="{ 'btn-primary': tab == 'new' }"
                                >new game
                                </button>
                            </div>
                            <div class="col-md-6">
                                <button class="btn btn-default center-block" type="button"
                                        @click="tab = 'join'"
                                        :class="{ 'btn-primary': tab == 'join' }"
                                >join game
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-6 control-label">人数：</label>
                            <div class="col-md-6">
                                <label class="radio-inline">
                                    <input type="radio" value="2" v-model="type"> 2
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" value="4" v-model="type"> 4
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-md-6 control-label">颜色：</label>
                            <div class="col-md-6">
                                <label class="radio-inline">
                                    <input type="radio" value="1" v-model="color"> <span
                                        class="aqua">&emsp;&emsp;</span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" value="2" v-model="color"> <span class="red">&emsp;&emsp;</span>
                                </label>
                            </div>
                            <div class="col-md-6 col-md-offset-6" v-show="type==4">
                                <label class="radio-inline">
                                    <input type="radio" value="3" v-model="color"> <span
                                        class="green">&emsp;&emsp;</span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" value="4" v-model="color"> <span
                                        class="orange">&emsp;&emsp;</span>
                                </label>
                            </div>
                        </div>
                        <div class="form-group" v-show="tab=='join'">
                            <label class="col-md-6 control-label">房间号：</label>
                            <div class="col-md-6">
                                <input class="form-control">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" @click="close()">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div>
</template>

<script>
  'use strict';

  import Vue from 'vue'

  export default {
    name: 'modal',
    props: {},
    data () {
      let tab = 'new';
      let type = 2;
      let color = 1;
      return {
        tab,
        type,
        color
      }
    },

    computed: {},
    methods: {
      close(){
        this.$emit('close')
      }
    }
  }

</script>