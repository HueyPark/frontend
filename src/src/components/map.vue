<template>
<div style="width:95vw; height:80vh; border: 1px solid lightgray; margin: 0 auto" :id="visId"></div>
</template>

<script>
import restClient from '../framework/rest_client.js'

export default {
  data () {
    return {
      nodes: [1, 2, 3]
    }
  },
  computed: {
    visId: function () {
      return this._uid
    }
  },
  mounted: function () {
    var self = this
    restClient.get('/nodes', function (res) {
      /* eslint-disable no-new */
      /* eslint-disable no-undef */
      let nodes = new vis.DataSet(res.data.nodes.map(function (node) {
        return {
          id: node.id,
          label: node.id,
          x: node.pos.x,
          y: node.pos.y}
      }))

      let edges = new vis.DataSet([])

      let data = {
        nodes,
        edges
      }

      new vis.Network(document.getElementById(self.visId), data, {})
    })
  }
}
</script>
