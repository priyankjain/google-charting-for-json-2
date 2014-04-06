
var m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");
google.load("visualization", "1", {packages:["corechart"]});
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function error404()
{
	document.getElementById("error").innerHTML="<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Error!</strong> Invalid User ID</div>";
}
function errorCustom()
{
	document.getElementById("error").innerHTML="<div class='alert alert-danger alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>Error!</strong> An unexpected error occurred</div>";	
}
function getFriendlyLastPayout(date)
{
	var date=new Date(date).getTime()/1000;
	var now=new Date().getTime()/1000;
	var dif=now-date;
	if(dif<60) return (now-date)+" seconds ago";
	else if(dif<120) return "A minute ago";
	else if(dif<3600) return Math.floor((dif/60))+" minutes ago";
	else if(dif<7200) return "An hour ago";
	else if(dif<86400) return Math.floor((dif/3600))+" hours ago";
	else if(dif<86400*2) return "Yesterday";
	else return Math.floor((dif/86400))+" days ago";
}
function getFriendlyCreated(date)
{
	var datetime=new Date(date);
	var date=datetime.getTime()/1000;
	var now=new Date().getTime()/1000;
	var dif=now-date;
	if(dif<86400) return "Today";
	else if(dif<86400*2) return "Yesterday";
	else return m_names[datetime.getMonth()]+" "+datetime.getDate()+", "+datetime.getFullYear();
}

function getLatestHashRate(id)
{
	var ret=0;
		$.ajax({
			async: false,
		  dataType: "json",
		  url: "http://reassent.no-ip.biz:7777/web/graph_data/miner_hash_rates/last_hour",
		  success: function(data)
		  {
		  	$.ajax({
		  		async: false,
		  		dataType: "json",
		  		url: "http://reassent.no-ip.biz:7777/web/graph_data/miner_hash_rates/last_day",
		  		success: function(daydata)
		  		{
				  	var unit="KH/s";
				  	var maxval=0;
				  	var count=0;
				  	var hashrate=0.0;
				  	var maxhashrate=0.0;
				  	for(var i=0;i<data.length;i++)
				  	{
				  		var users=$.map(data[i][1],function(value,key){return key;});
		            	var hashes=$.map(data[i][1],function(value,key){return value;});
		            	var x=users.indexOf(id);
		            	if(x!=-1)
		            	{	
		            		hashrate=hashrate+hashes[x];
		            		count++;
		            	}
				  	}
				  	for(var i=0;i<daydata.length;i++)
				  	{
				  		var users=$.map(daydata[i][1],function(value,key){return key;});
		            	var hashes=$.map(daydata[i][1],function(value,key){return value;});
		            	var x=users.indexOf(id);
		            	if(x!=-1)
		            	{	
		            		if(hashes[x]>maxhashrate) maxhashrate=hashes[x];
		            	}
				  	}
				  	maxhashrate= Math.round(maxhashrate/1000 * 100) / 100;
				  	if(maxhashrate>1000)
				  	{
				  		maxhashrate=Math.round(maxhashrate/1000*100)/100;
				  		unit="MH/s";
				  	}
				  	hashrate=hashrate/count;
				  	if(unit=="KH/s") { hashrate=Math.round(hashrate/1000 * 100) / 100;}
				  	else if(unit=="MH/s") { hashrate=Math.round( hashrate/1000/1000 * 100) / 100; }
				  	 g = new JustGage({
					    id: "gauge", 
					    value: hashrate,
					    min: 0,
					    max: maxhashrate,
					    title: "24hr User Hashrate",
					    label: unit
					  });	
		  		}
		  	});
		  	
		  },
		  error: function(data)
		  {
		  }
	});
}

function getRecentPayouts(id)
{
	document.getElementById("recent-payouts-loading").innerHTML=loading;
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "http://reassent.no-ip.biz:8088/pool.com/payouts.php",
		data: "user_id="+id,
		success: function(data)
		{
			var html='<div class="panel panel-default"><div class="panel-heading">Recent Payouts</div><div class="panel-body"><table id="dataTable" class="table">';
			html+="<thead><tr><td>Date</td><td>BTC</td><td>Transaction ID</td></tr></thead><tbody class='searchable'>";
			for(var i=0;i<data.length;i++)
			{
				var datetime=new Date(data[i]["datetime"].replace(" ","T"));
				html+="<tr class='match'><td>";
				html+=m_names[datetime.getMonth()]+" "+datetime.getDate()+", "+datetime.getFullYear()+" "+formatAMPM(datetime);
				html+="</td><td>";
				html+=new Number(data[i]["transaction_amount"]).toFixed(8);
				html+="</td><td><a href='https://blockchain.info/tx/"+data[i]["tx_id"]+"'>";
				html+=data[i]["tx_id"];
				html+="</a></td></tr>";
			}
			html+="</table></table></div></div>";
			document.getElementById("recent-payouts-loading").innerHTML="";
			document.getElementById("recent-payouts").innerHTML=html;
			pagination(0);
		},
		error: function(data)
		{
			document.getElementById("recent-payouts-loading").innerHTML="<div class='alert alert-warning alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>No recent payouts</div>";
		}
	});
}


 function formatAMPM(date) {
  var hours = date.getHours();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var minutes=date.getMinutes();
  return hours+':'+minutes+" "+ampm;
}

function pagination(page)
{
	var perpage=30;
  $("#dataTable").show();
  $(".searchable tr").show();
  var total=$(".searchable tr.match").length;
 
    $(".searchable tr:not(.match)").hide();
    var number_of_pages=Math.ceil(total/perpage);
    $(".searchable tr.match:lt("+page*perpage+")").hide();
    $(".searchable tr.match:gt("+((page+1)*perpage-1)+")").hide();
    var html="";
    if(page!=0)
    {
      html+='<li onclick="pagination('+(page-1)+')"><a href="#recent-payouts">&laquo;</a></li>';
    }
    for(var i=0;i<number_of_pages;i++)
    {
      if(i==page)
      html+='<li class="active"><span>'+(i+1)+'</span></li>';
      else 
        html+='<li onclick="pagination('+(i)+')"><a href="#recent-payouts">'+(i+1)+'</a></li>';
    }
    if(page!=number_of_pages-1)
    {
      html+='<li onclick="pagination('+(page+1)+')"><a href="#recent-payouts">&raquo;</a></li>';
    }
      $("#pagination").html(html);
      $("#showing").html("<span>Showing results "+(page*perpage+1)+"-"+((page!=number_of_pages-1)?((page+1)*perpage):(total))+" of "+total+"</span>");
}



function getCurrentBalances(id)
{
	$.ajax({
			type: "POST",
			url: "http://reassent.no-ip.biz:8088/pool.com/user_details.php",
			dataType: "json",
			data: "user_id="+id,
			success: function(data)
			{
				if("error" in data)
					error404();
				else
				{
					var keys=$.map(data,function(value,key){return key});
					var values=$.map(data,function(value,key){return value});
					for(var i=0;i<keys.length;i++)
					{
						if(keys[i].indexOf("_balance")!=-1 || keys[i].indexOf("_profit")!=-1 || keys[i].indexOf("_btc")!=-1)
						{
							values[i]=new Number(values[i]).toFixed(8);
						}
						else if(keys[i].indexOf("_payout")!=-1)
						{
							values[i]=getFriendlyLastPayout(values[i].replace(" ","T"));
						}
						else if(keys[i].indexOf("DataCreated")!=-1)
						{
							values[i]=getFriendlyCreated(values[i].replace(" ","T"));
						}
						document.getElementById(keys[i]).innerHTML=values[i];	
					}
				}
			},
			error: function(data)
			{
				errorCustom();
			}
		});
}
$(document).ready(
	function()
	{
		var user_id=window.location.search.replace( "?", "" );
		user_id=decodeURI(user_id);
		var pattern=/^user_id=(.)+$/;
		if(!(user_id.match(pattern)))
		{
			error404();
			throw '';
		}
		user_id=user_id.split("=");
		id=user_id[1];
		getCurrentBalances(id);
		getLatestHashRate(id);
		getRecentPayouts(id);
		getPayout(id,"week");
		getHash(id,"day");
	});//End of document.ready
