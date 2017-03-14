<template>
<div>
  <div style="width:95vw; height:80vh; border: 1px solid lightgray; margin: 0 auto" :id="visId"></div>
  <div>
  </div>
</div>
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
  methods: {
    generateEdges: function (nodes) {
      let self = this
      let edges = []
      nodes.forEach(function (fromNode, idx, nodes) {
        nodes.forEach(function (toNode, idx, nodes) {
          if (fromNode.id === toNode.id) return

          if (self.hasEdge(fromNode.pos, toNode.pos) === false) return

          edges.push({from: fromNode.id, to: toNode.id})
        })
      })
      /* eslint-disable no-new */
      /* eslint-disable no-undef */
      return new vis.DataSet(edges)
    },
    hasEdge: function (from, to) {
      let x = from.x - to.x
      let y = from.y - to.y
      let sqDist = (x * x) + (y * y)
      if (sqDist > (100 * 100)) return false

      return true
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
          fixed: true,
          x: node.pos.x,
          y: node.pos.y
        }
      }))

      let data = {
        nodes: nodes,
        edges: self.generateEdges(res.data.nodes)
      }

      let network = new vis.Network(document.getElementById(self.visId), data, {})
      network.on('selectNode', function (data) {
        let node = nodes.get(data.nodes[0])
        console.log(node)
      })
    })
  }
}
</script>
