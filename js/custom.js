
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
		  	for(var i=0;i<data.length;i++)
		  	{
		  		var users=$.map(data[i][1],function(value,key){return key;});
            	var hashes=$.map(data[i][1],function(value,key){return value;});
            	var x=users.indexOf(id);
            	if(x!=-1)
            	{
            		ret= Math.round( hashes[x]/data.length/1000/1000 * 100) / 100;
            		break;
            	}
		  	}
		  },
		  error: function(data)
		  {
		  }
	});
	return ret;
}
function getRecentPayouts(id)
{
	document.getElementById("recent-payouts-loading").innerHTML=loading;
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "http://localhost/google-charting-for-json-2/payouts.php",
		data: "user_id="+id,
		success: function(data)
		{
			var html='<div class="panel panel-default"><div class="panel-heading">Recent Payouts</div><div class="panel-body"><table class="table">';
			html+="<tr><td>Date</td><td>BTC</td><td>Transaction ID</td></tr>";
			for(var i=0;i<data.length;i++)
			{
				var datetime=new Date(data[i]["datetime"].replace(" ","T"));
				html+="<tr><td>";
				html+=m_names[datetime.getMonth()]+" "+datetime.getDate()+", "+datetime.getFullYear()+" "+formatAMPM(datetime);
				html+="</td><td>";
				html+=new Number(data[i]["transaction_amount"]).toFixed(8);
				html+="</td><td>";
				html+=data[i]["tx_id"];
				html+="</td></tr>";
			}
			html+="</table></div></div>";
			document.getElementById("recent-payouts-loading").innerHTML="";
			document.getElementById("recent-payouts").innerHTML=html;
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
function getCurrentBalances(id)
{
	$.ajax({
			type: "POST",
			url: "http://localhost/google-charting-for-json-2/user_details.php",
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
						else if(keys[i].indexOf("datecreated")!=-1)
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
		getRecentPayouts(id);
		// getPayout(id,"day");
		getHash(id,"day");
	});//End of document.ready