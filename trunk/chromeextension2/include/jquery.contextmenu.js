/**
 * jQuery.contextMenu - Show a custom context when right clicking something
 * Jonas Arnklint, http://github.com/arnklint/jquery-contextMenu
 * Released into the public domain
 * Date: Jan 14, 2011
 * @author Jonas Arnklint
 * @version 1.3
 *  
 *  Edited by Maurice Lam to allow multiple calling on the same context menu
 *  So multiple calls to the function with the same ID will only create one menu
 */
// Making a local '$' alias of jQuery to support jQuery.noConflict
(function($) {
  jQuery.fn.contextMenu = function ( name, actions, options ) {
      var me = this,
          active_element = null, // last clicked element that responds with contextMenu
          hide_menu = function() {
            $('.context-menu').each(function() {
              $(this).trigger("closed");
              $(this).hide();
            });
            $('body').unbind('click', hide_menu);
          }, 
          default_options = {
              disable_native_context_menu: false, // disables the native contextmenu everywhere you click
			  title: ""
          },
          options = $.extend(default_options, options);
      
	  if($("#"+name).size() == 0){ //create a new context menu only if none exists
		  $(document).bind('contextmenu', function(e) {
			if (options.disable_native_context_menu)
			  e.preventDefault();
			hide_menu();
		  });
          menu = $('<ul id="'+name+'" class="context-menu"></ul>'),
		  menu.hide().appendTo('body');
		  $("<div class='title'></div>").appendTo(menu).click(function(e){
			  e.stopPropagation();
		  });
		  $.each(actions, function(me, item_options) {
			  var menuItem = $('<li>'+me+'</li>');

			  if (item_options.klass)
				menuItem.attr("class", item_options.klass);

			  menuItem.appendTo(menu).bind('click', function(e) {
				  item_options.click($(this).parent().data("invoker"));
				  e.preventDefault();
			  });
		  });
	  }


      return me.bind('contextmenu', function(e){
          // Hide any existing context menus
          hide_menu(); 

          active_element = $(this); // set clicked element
		  var menu = $("#"+name);
		  menu.data("invoker", active_element);

          if (options.showMenu) {
              options.showMenu.call(menu, active_element);
          }

          // Bind to the closed event if there is a hideMenu handler specified
          if (options.hideMenu) {
              menu.bind("closed", function() {
                  options.hideMenu.call(menu, active_element);
              });
          }

		  menu.find(".title").html(options.title);

          menu.show(0, function() { $('body').bind('click', hide_menu); }).css({
            position: 'absolute', 
            top: e.pageY, 
            left: e.pageX, 
            zIndex: 1000 
          });
          return false;
      });
  }
})(jQuery);
