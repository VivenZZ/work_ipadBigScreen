<template>
  <div class="mine">
    <transition name="fade">
      <div v-if="isShow">
        2222
      </div>
    </transition>
    <div class="loading" v-if="!isShow">
      <fulfilling-bouncing-circle-spinner
        :animation-duration="4000"
        :size="60"
        color="#EB4D3D"
      />
    </div>
  </div>
</template>

<script>
import {FulfillingBouncingCircleSpinner} from 'epic-spinners'
export default {
  name: 'Mine',
  components: {
    FulfillingBouncingCircleSpinner
  },
  data () {
    return {
      data: [],
      msg: 'Inspiration',
      isShow: false
    }
  },
  created () {
    this.common.getAjaxData('/all.com/', this.data, this.ShowNow)
  },
  methods: {
    ShowNow () {
      this.isShow = true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
