////////////////////////////////////////////////////////////////////////////////

window.sigma = require('sigma');

// animate
require('sigma/plugins/sigma.plugins.animate/sigma.plugins.animate')

// noverlap
require('sigma/plugins/sigma.layout.noverlap/sigma.layout.noverlap')

// forceAtlas2 layout
require('sigma/build/plugins/sigma.layout.forceAtlas2.min')
require('sigma/plugins/sigma.layout.forceAtlas2/worker')
require('sigma/plugins/sigma.layout.forceAtlas2/supervisor')

require('sigma/plugins/sigma.plugins.dragNodes/sigma.plugins.dragNodes')

window.graphml = require('graphml-js');

var fs = require('fs');
// browserify -t brfs ....

var txt = fs.readFileSync('primer.graphml');
var prsr = new graphml.GraphMLParser();
window.g = [];

function setupLayout(sigmaInstance){
    var noverlapListener = sigmaInstance.configNoverlap({
	nodeMargin: 300,
	scaleNodes: 1.05,
	gridSize: 75,
	easing: 'quadraticInOut',
	duration: 400
    });
    // Bind the events:
    noverlapListener.bind('start stop interpolate', function(e) {
	console.log(e.type);
	if(e.type === 'start') {
	    console.time('noverlap');
	}
	if(e.type === 'interpolate') {
	    console.timeEnd('noverlap');
	}
    });
}


function parseGraphMLText(s,txt) {
    prsr.parse(
	txt,
	(err, graphs) =>
	    graphs.map(
		g =>
		    { window.g.push(g);
		      g.nodes.map( 
			  v => s.graph.addNode(
			      Object.assign(
				  {id: v.id, size: 1},
				  {x: 100 * Math.random(),
				   y: 100 * Math.random()},
				  v.attributes)));
		      
		      g.edges.map(
			  e =>
			      { var edge_id = e.id ? e.id : e.source + '->' + e.target; 
				s.graph.addEdge(
				    Object.assign({id: edge_id,
						   source: e.source,
						   target: e.target
						  },
						  e.attributes))});
		      
		    }))
}

// DOM must be ready before a sigm comp can be mounted
window.onload = function (){
    var s = new sigma( document.getElementById('sigma-container') );
    window.s = s;

    setupLayout(s);

    // parseGraphMLText(txt,s);
    
    console.log('loaded',s.graph.nodes(), s.graph.edges());
    
    // MUST!! REFRESH!! TO SEE ANYTHING!!
    s.refresh(); 		// DON'T FORGET IN THE FUTURE!!
    // ^ MUST!! REFRESH!! CRUSH!! KILL!! REFRESH!!

    var dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
    
};

var ws = new WebSocket('ws://localhost:9090');

ws.onmessage =
    event =>
    {
	var reader = new FileReader();
	reader.addEventListener('loadend', (e) => {
	    const text = e.srcElement.result;
	    console.log(text);
	    parseGraphMLText(window.s,text);
	    s.refresh();
	})
	reader.readAsText(event.data);
    }
