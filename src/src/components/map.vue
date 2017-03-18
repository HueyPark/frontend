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
let network = null
let nodes = null
let edges = null

export default {
  data () {
    return {
      selectedNodeId: undefined,
      intervalID: undefined
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
      nodes.forEach(function (fromNode, _, nodes) {
        fromNode.units.forEach(function (unit) {
          edges.push({from: fromNode.id, to: unit.id})
        })
        nodes.forEach(function (toNode) {
          if (fromNode.id === toNode.id) return

          if (self.hasEdge(fromNode.pos, toNode.pos) === false) return

          edges.push({from: fromNode.id, to: toNode.id})
        })
      })
      return edges
    },
    generateNodes: function (nodes) {
      let nodeData = []
      nodes.forEach(function (node) {
        nodeData.push({
          id: node.id,
          fixed: true,
          x: node.pos.x,
          y: node.pos.y
        })

        node.units.forEach(function (unit) {
          nodeData.push({
            id: unit.id,
            color: 'rgb(0,0,255)'
          })
        })
      })

      return nodeData
    },
    hasEdge: function (from, to) {
      let x = from.x - to.x
      let y = from.y - to.y
      let sqDist = (x * x) + (y * y)
      if (sqDist > (100 * 100)) return false

      return true
    },
    createUnit: function () {
      var self = this
      restClient.post(
        '/units',
        function (res) {
          self.readNodes()
        },
        {node_id: this.selectedNodeId})
    },
    readNodes: function () {
      var self = this
      restClient.get('/nodes', function (res) {
        nodes.clear()
        nodes.add(self.generateNodes(res.data.nodes))
        edges.clear()
        edges.add(self.generateEdges(res.data.nodes))
      })
    }
  },
  mounted: function () {
    /* eslint-disable no-undef */
    /* eslint-disable no-new */
    nodes = new vis.DataSet()
    edges = new vis.DataSet()
    network = new vis.Network(
      document.getElementById(this.visId),
      {
        nodes: nodes,
        edges: edges
      },
      {})
    network.on('click', function (data) {
      this.selectedNodeId = data.nodes[0]
    })

    var self = this
    self.readNodes()
    this.intervalID = setInterval(
      function () {
        self.readNodes()
      },
      1000)
  },
  beforeDestroy: function () {
    clearInterval(this.intervalID)
  }
}
</script>
