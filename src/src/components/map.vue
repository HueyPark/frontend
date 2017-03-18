<template>
<div>
  <div class="panel panel-default">
    <div class="panel-body" style="height:80vh;" :id="visId"></div>
  </div>
  <div v-if="selectedNodeId !== undefined" class="panel panel-default">
    <div class="panel-body">
      <div class="btn-group" role="group">
        <button @click="createUnit" type="button" class="btn btn-default">Create Unit</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import restClient from '../framework/rest_client.js'

export default {
  data () {
    return {
      selectedNodeId: undefined
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
    },
    createUnit: function () {
      restClient.post(
        '/units',
        function (res) {
          console.log(res)
        },
        {node_id: this.selectedNodeId})
    },
    readNodes: function () {
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
        network.on('click', function (data) {
          self.selectedNodeId = data.nodes[0]
        })
      })
    }
  },
  mounted: function () {
    this.readNodes()
  }
}
</script>
