Drupal.behaviors.scholarlayout = function() {
    var layoutRegions = ["#scholarlayout-header-left","#scholarlayout-header-main", "#scholarlayout-header-right", "#scholarlayout-navbar", "#scholarlayout-left", "#scholarlayout-right"];
    
    $.each(layoutRegions, function(i, value){
      $(value).sortable({
	    connectWith: layoutRegions,
	    stop: scholarlayout_afterdrag
	  });
	});

    $("#scholarlayout-top-widgets").sortable({ 
      connectWith: layoutRegions,
      stop: scholarlayout_afterdrag
    });
    
    
    if(!scholarlayout_change_bound){
    	scholarlayout_change_bound = true;

	    $("#edit-page-type").bind('change', function(e){
	    	if(scholarlayout_catchchanges()){
	    		$('#edit-secret-hidden-ahah').val($("#edit-page-type").val());
		    	$('#edit-secret-hidden-ahah').trigger('go_ahah');
		    	$("#edit-page-type").trigger('go_ahah');
		    	$("#scholarforms_save_warning").remove();
	    	}else{
	    		//revert
	    		$('#edit-page-type').val($("#edit-secret-hidden-ahah").val());
	    	}
	    });
    }
};

var scholarlayout_change_bound = false;
function scholarlayout_afterdrag(event, ui) {
	  var regions = $("#scholarlayout-container > ul.scholarlayout-widgets-list");
	  $.each(regions, function(i, region){ 
	    var items = $(region.id+" > .scholarlayout-item");
	    var ids = "";
	    $.each(items, function(i, value){ 
	      if(ids.length) ids += "|";
	      ids += value.id; 
	    } );
	   	$(region.id.replace('#','#edit-')).val(ids);
	  });	  
    
	  if(!$("#scholarforms_save_warning").length) $("#scholarlayout-layoutsettings").before($('<div id="scholarforms_save_warning" class="messages error">Your changes have not been saved. You must click "Save Settings" for your changes to take effect</div>'));
};

function scholarlayout_catchchanges() {
	if(!$("#scholarforms_save_warning").length || confirm("Your changes have not been saved.  Continue and loose your changes?")) return true;
	 
	return false; 
};