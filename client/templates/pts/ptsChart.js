var Slices = new Meteor.Collection(null);
Session.setDefault('ptsChartSort','none');
Session.setDefault('ptsChartSortModifier',undefined);


Template.ptsChart.events({
  /*'submit form':function(e){
    e.preventDefault();
    Slices.insert({
      value:Math.floor($('#slice1').val())
    });
    return false;
  },*/
	/*'click #pts':function(){   
    Expenses.find({}).map(function(pt) {
      Slices.insert({
			  value:Math.floor(pt.amount)
      });
    });
  },*/
  'click #add':function(){
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
	},
	'click #remove':function(){
		var toRemove = Random.choice(Slices.find().fetch());
		Slices.remove({_id:toRemove._id});
	},
	'click #randomize':function(){
		//loop through bars
		Slices.find({}).forEach(function(bar){
			//update the value of the bar
			Slices.update({_id:bar._id},{$set:{value:Math.floor(Math.random() * 100)}});
		});
	},
	'click #toggleSort':function(){
		if(Session.equals('ptsChartSort', 'none')){
			Session.set('ptsChartSort','asc');
			Session.set('ptsChartSortModifier',{sort:{value:1}});
		}else if(Session.equals('ptsChartSort', 'asc')){
			Session.set('ptsChartSort','desc');
			Session.set('ptsChartSortModifier',{sort:{value:-1}});
		}else{
			Session.set('ptsChartSort','none');
			Session.set('ptsChartSortModifier',{});
		}
	}
});

Template.ptsChart.rendered = function(){
  //Expenses added
  /*if(Slices.find({}).count() === 0){
    Expenses.find({}).map(function(pt) {
      Slices.insert({
			  value:Math.floor(pt.amount)
      });
    });
  }*/

	//Width and height
	var w = 300;
	var h = 300;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);
	
	var pts = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});
	
	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#ptsChart")
				.attr("width", w)
				.attr("height", h);
	
	var key = function(d){ 
		return d.data._id;
	};

	Deps.autorun(function(){
		var modifier = {fields:{value:1}};
		var sortModifier = Session.get('ptsChartSortModifier');
		if(sortModifier && sortModifier.sort)
			modifier.sort = sortModifier.sort;
		
		var dataset = Slices.find({},modifier).fetch();
		
		var arcs = svg.selectAll("g.arc")
					  .data(pts(dataset), key);

		var newGroups = 
			arcs
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
		
		//Draw arc paths
    var bigArc = true;
		newGroups
			.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);
		
		//Labels
		newGroups
			.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.value;
			});

		arcs
			.transition()
			.select('path')
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});
		
		arcs
			.transition()
			.select('text')
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.text(function(d) {
				return d.value;
			});

		arcs
			.exit()
	 		.remove();
	});
};
