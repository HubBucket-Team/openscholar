// Fixes tab behavior after using the skip link in IE or Chrome
Drupal.behaviors.osBase_skipLinkFocus = {
	attach : function(ctx) {
		var $ = jQuery, $skip = $('#skip-link a', ctx);

		$skip.click(function(e) {
			var target = $skip[0].hash.replace('#', '');

			setTimeout(function() {
				$('a[name="' + target + '"]').attr('tabindex', -1).focus();
			}, 100);
		});
	}
};

jQuery(document).ready(function() {
	jQuery(".cal-export").click(function() {
		jQuery(".attachment.attachment-before ul").slideToggle();
		jQuery(".os_events_export_links .last").slideToggle();

	});
	
	jQuery(".block-boxes-os_search_solr_search_box").addClass("block-os-search-solr");

    jQuery("figure img").each(function() {
        var imgwidth = jQuery(this).attr('width');
        jQuery(this).parent().find('figcaption').css({
            "width" : + imgwidth
        });
    });


});


(function ($) {

Drupal.behaviors.osCpLayout = {
    attach: function (ctx) {
        $('[id^="os-importer-content-"]').click(function(){
            var cp_ctrl_id = $(this).attr('id').replace(/-/g, '_');
            $('#' + cp_ctrl_id).click();
        });

        $("div.ctools-dropdown-container span").hover(
            function() { $(this).addClass('ctools-dropdown-hover'); },
            function() { $(this).removeClass('ctools-dropdown-hover'); }
        );
    }
};

})(jQuery);