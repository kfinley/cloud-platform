<template>
  <div class="dashboard">
    <notify />
    <h1>Secure Dashboard</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notify } from "../components/";

@Component({
  components: {
    Notify
  }
})
export default class Secured extends Vue { }
</script>

<style>
.dashboard > * {
  padding: 5px;
}
</style>
