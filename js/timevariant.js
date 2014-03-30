var arr=new Array("hour","day","week","month","year");
function changeTab(period)
{
	var current_period=$("#navbar > li.active > a")[0].innerHTML;
	if(period==current_period.toLowerCase()) return;
	else
	{
		$("#navbar > li.active").removeClass("active");
		var index=arr.indexOf(period);
		$("#navbar > li:eq("+index+")").addClass("active");
		getHash(id,period);
	}
}

function getHash(id,period)
{
	var url="http://reassent.no-ip.biz:7777/web/graph_data/miner_hash_rates/last_"+period;
	document.getElementById("hashrate-loading").innerHTML=loading;
	document.getElementById("hashrate").innerHTML="";
	$.ajax({
		dataType: "json",
		url: url,
		type: "GET",
		success:function(data)
		{
					var dead_url="http://reassent.no-ip.biz:7777/web/graph_data/miner_dead_hash_rates/last_"+period;
			$.ajax({
				dataType: "json",
				url: dead_url,
				type: "GET",
				success:function(dead_data)
				{
					var hashrates=new Array();
					for(var i=0,j=0;i<data.length;i+=6,j++)
					{
						var users=$.map(data[i][1],function(value,key){return key;});
						var hashes=$.map(data[i][1],function(value,key){return value;});
						var hashes_dead=new Array(users.length);
						hashes_dead=$.map(dead_data[i][1],function(value,key){return value;});
						var x=users.indexOf(id);
						data[i][0]=new Date(data[i][0]*1000);
						if(x!=-1)
						{
							hashrates[j]=new Array(data[i][0],Math.round( hashes[x]/1000/1000 *100)/100,Math.round( (isNaN(hashes_dead[x])?0:hashes_dead[x])/1000/1000 *100)/100);
						}
						else hashrates[j]=new Array(data[i][0],0,0);
					}
					document.getElementById("hashrate-loading").innerHTML="";
					drawHashChart(hashrates,period);
				}
			});
		}
	});
}

function drawHashChart(inputData,period) {
	var width=$(".container").width();
    var data = new google.visualization.DataTable();
    data.addColumn('datetime','Time');
	data.addColumn('number','Hash Rate');
	data.addColumn('number','Rejected');
	data.addRows(inputData);
	var format="";
	if(period=="day") format="h aa";
	else if(period=="week") format="d MMM";
	else if(period=="month") format="d/MM";
	else if(period=="year") format="MMM";
	var options={'width':width,'height':400,
	  	"vAxis":{"title":"Hash Rate","minValue":0},
		"hAxis":{"title":"",gridlines: {
        color: 'transparent'
    },
		 "format": format
	}
};
	var dateFormatter = new google.visualization.DateFormat({pattern: format});
dateFormatter.format(data, 0);
    var chart = new google.visualization.LineChart(document.getElementById("hashrate"));
    chart.draw(data,options);
  }