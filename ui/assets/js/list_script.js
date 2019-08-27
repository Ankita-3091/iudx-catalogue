/*************************************************GLOBAL VARIABLES START*********************************************/
var tags_set=[]
/*************************************************GLOBAL VARIABLES END***********************************************/







/*************************************************FUNCTION DECLARATIONS START*********************************************/

function display_search_section(){
	$(".section").fadeOut(200);
	$("body").css("background-image","none");
	$("#search_section").fadeIn(1500);
	get_items();
}

function display_saved_search_section(){
	$(".section").fadeOut(200);
	$("body").css("background-image","none");
	$("#search_section").fadeIn(1500);
	// get_items();
}


function display_swagger_ui(_openapi_url){
	$(".section").fadeOut(200);
	$("body").css("background-image","none");
	$("#swagger_section").fadeIn(1500);
	const ui = SwaggerUIBundle({
	//url: "https://petstore.swagger.io/v2/swagger.json",
	url: _openapi_url,
	dom_id: '#swagger_ui',
	deepLinking: true,
	presets: [
	  SwaggerUIBundle.presets.apis,
	  SwaggerUIStandalonePreset
	],
	plugins: [
	  SwaggerUIBundle.plugins.DownloadUrl
	],
	layout: "StandaloneLayout"
	})
}


function get_items(){
	let seen_tags_set = [];
	$.get("/catalogue/v1/search", function(data) {
            // $("#searched_items").text(data);
			data=JSON.parse(data)
			
            for (var i = 0; i < data.length; i++) {
                $("#searched_items").append(json_to_htmlcard(data[i]));
                for (var tag_i = 0; tag_i < data[i]['tags']['value'].length - 1; tag_i++) {
                // if(data[i]['tags'][tag_i].toLowerCase()=="feeder" || data[i]['tags'][tag_i].toLowerCase()=="streetlight" || data[i]['tags'][tag_i].toLowerCase()=="streetlighting"){
                //     continue;
                // }
                if (!seen_tags_set.includes(data[i]['tags']['value'][tag_i].toLowerCase())) {
                    seen_tags_set.push(data[i]['tags']['value'][tag_i].toLowerCase())
                }
            }
            }
        });
	// $( "#_value" ).autocomplete({
	//       source: seen_tags_set
	// });

	// $( "#value" ).autocomplete({
	//       source: seen_tags_set
	// });
}


function get_items_for_tag(tag){
	let seen_tags_set = [];

	$.get("/catalogue/v1/search?attribute-name=(tags)&attribute-value=((" + tag + "))", function(data) {
            // $("#searched_items").text(data);
            $("#searched_items").html("");
            data=JSON.parse(data)
            $("#retrieved_items_count").html("About " + data.length + " results for " + tag);
            for (var i = 0; i < data.length; i++) {
                //console.log(data[i]);
                $("#searched_items").append(json_to_htmlcard(data[i]));
                for (var tag_i = 0; tag_i < data[i]['tags'].length - 1; tag_i++) {
                // if(data[i]['tags'][tag_i].toLowerCase()=="feeder" || data[i]['tags'][tag_i].toLowerCase()=="streetlight" || data[i]['tags'][tag_i].toLowerCase()=="streetlighting"){
                //     continue;
                // }
                if (!seen_tags_set.includes(data[i]['tags'][tag_i].toLowerCase())) {
                    seen_tags_set.push(data[i]['tags'][tag_i].toLowerCase())
                }
            }
            }
        });
	// $( "#_value" ).autocomplete({
	//       source: seen_tags_set
	// });

	// $( "#value" ).autocomplete({
	//       source: seen_tags_set
	// });
}


function getFooterContent(){
	return `<p>&copy; 2019 <a href="https://iudx.org.in">IUDX </a> | Read the  <a href="https://docs.google.com/document/d/12kQteMgxINPjZUVaNBqvtEYJEfqDn7r7QWbL74o7wPQ/edit?usp=sharing">Doc</a>.</p>`
}

function set_tags(_tags_set) {
	// //console.log("v:",$( "#value" ).is(':visible'))
	// //console.log("_v:",$( "#_value" ).is(':visible'))
	if($( "#value" ).is(':visible')){
			$( "#value" ).autocomplete({
				source: _tags_set,
				select: function( event, ui ) {
					get_items_for_tag(ui["item"]['label'])
				}
				// ,
				// select: function (e, ui) {
				// 	alert("selected!", e);
				// },
				// change: function (e, ui) {
				// 	alert("changed!", e, ui);
				// }
			});
 		}

	if($( "#_value" ).is(':visible')){
		$( "#_value" ).autocomplete({
			source: _tags_set,
			select: function( event, ui ) {
				get_items_for_tag(ui["item"]['label'])
			}
		});
	}
}

function show_details(id){
	$.get("/catalogue/v1/items/" + id , function(data) {
		data=JSON.parse(data)
		id = resource_id_to_html_id(id)
		//console.log(id);
		
		$("#_tbody_"+id).html(`
			<tr>
			      <th scope="row">Name</th>
			      <td>`+ data[0]["NAME"]["value"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Description</th>
			      <td>`+ data[0]["itemDescription"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Type</th>
			      <td>`+ data[0]["itemType"]["value"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Provider</th>
			      <td>`+ data[0]["provider"]["value"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Created-On</th>
			      <td>`+ data[0]["createdAt"]["value"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Resource Server Group</th>
			      <td>`+ data[0]["resourceServerGroup"]["value"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Authorization Server Info</th>
			      <td>`+ data[0]["authorizationServerInfo"]["value"]["authServer"] +` | Type: `+ data[0]["authorizationServerInfo"]["value"]["authType"] +`</td>
		    </tr>
		    <tr>
			      <th scope="row">Status</th>
			      <td>`+ data[0]["itemStatus"]["value"] +`</td>
		    </tr>
		`);
			$("#details_section_"+id).append(`
			<p>
				<a href="https://pune.iudx.org.in/api/1.0.0/resource/latest/`+data[0]["resourceServerGroup"]["value"]+`/`+data[0]["resourceId"]["value"]+`" target="_blank">Latest Data</a>   |  
				<a href="`+data[0]["refBaseSchema"]["object"]+`" target="_blank">Base Schema </a> |
				<a href="`+data[0]["refDataModel"]["object"]+`" target="_blank">Data Model </a>
			</p>
			`);
			// <a href="`+data[0]["latestResourceData"]["object"]+`" target="_blank">Latest Data </a>
		$("#details_section_"+id).toggle();
	});
}

function resource_id_to_html_id(resource_id){
	var replace_with = "_";
	return resource_id.replace(/\/|\.|\@/g,replace_with)
}


function request_access_token(resource_id,provider) {
	var body_json = [
             {
                 "resource-id": resource_id,  //change to latest data
                 "provider": provider, //change provider
                 "api": "/contents",
                 "methods": ["GET"]
             }
         ];
    // /auth/v1/token
	$.post("demo_test_post.asp",
	{
		name: "Donald Duck",
		city: "Duckburg"
	},
	function(data, status){
	alert("Data: " + data + "\nStatus: " + status);
	});
}

function json_to_htmlcard(json_obj){
	var openapi_url = json_obj["accessInformation"][0]["accessObject"]["value"]
	console.log(openapi_url)
	var is_public = (json_obj['secure']||[]).length === 0;
	var rat_btn_html=`<button class="btn btn-secondary" onclick="request_access_token('` + json_obj.id + `','` + json_obj.onboardedBy + `')">Request Access Token</button>`
	return `
		<div class="col-12 card-margin-top">
		<div class="card">
		  <h5 class="card-header card-header-color">` + json_obj["id"] + `</h5>
		  <div class="card-body">
		    <h5 class="card-title">` + json_obj["itemDescription"] + `</h5>
		    <strong>Onboarded-By</strong>: `+json_obj['onboardedBy']+`<br>
		    <strong>Security</strong>: `+ (is_public ? "Public": "Requires Authentication") +`<br>
		    <button class="btn btn-primary" onclick="show_details('`+ json_obj.id +`')">Details</button>
		    <button class="btn btn-info" onclick="display_swagger_ui('` + openapi_url + `')">APIs Details</button>
		    `+ ((!is_public)?"":rat_btn_html) +`
		    
		    <!--button class="btn btn-secondary">Request Access Token (For Non-Public data)???</button-->
		  </div>
		  <div id="details_section_`+resource_id_to_html_id(json_obj.id)+`" class="details_section">
		  	<table class="table table-borderless table-dark">
			  <thead>
			  	<tr></tr>
			  </thead>
			  <tbody id="_tbody_`+resource_id_to_html_id(json_obj.id)+`">

			  </tbody>
			</table>
		  </div>
		</div>
		</div>
	`	
}

/*************************************************FUNCTION DECLARATIONS START*********************************************/












/*************************************************EVENT BINDINGS START*********************************************/




// Set up Footer, filter seen_tags_set
$(document).ready(function(){
	$("body").fadeIn(1000);
	$("#landing_section").fadeIn();
	let seen_tags_set = [];
	$.get("/catalogue/v1/search", function(data) {
			// $("#searched_items").text(data);
			//console.log("RRRRRRRR1");
			data=JSON.parse(data)
			//console.log("RRRRRRRR");
            for (var i = 0; i < data.length; i++) {                
                for (var tag_i = 0; tag_i < data[i]['tags']['value'].length - 1; tag_i++) {
                // if(data[i]['tags'][tag_i].toLowerCase()=="feeder" || data[i]['tags'][tag_i].toLowerCase()=="streetlight" || data[i]['tags'][tag_i].toLowerCase()=="streetlighting"){
                //     continue;
                // }
                if (!seen_tags_set.includes(data[i]['tags']['value'][tag_i].toLowerCase())) {
                    seen_tags_set.push(data[i]['tags']['value'][tag_i].toLowerCase())
                }
            }
            }
        });
	tags_set=seen_tags_set;

	$("#landing_footer, #normal_footer").html(getFooterContent()	);
	$.get("/catalogue/v1/count", function(data) {
		$("#resource_item_count").html(JSON.parse(data)["Count"]);
	});

});





// Capture select on change effect for populating tags autosuggest 
$('select').on('change', function() {
	if(this.value == "tags"){
		set_tags(tags_set)
}else{
	set_tags=[]
}
//console.log( this.value );
});




// Capture search input click
$(".ui-menu").on('click',function(){
	//console.log("s",this.value)
});




/*************************************************EVENT BINDINGS END*********************************************/









/********************************************************************************************/



/********************************************************************************************/

