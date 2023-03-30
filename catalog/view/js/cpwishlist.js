//load this module after jQuery
/*
notice:
the function addWishlist, deleteWishlist has a param name "callback"
this param is a function that update view dynamic by status
*/
window.CPcart = window.CPcart || {};
CPcart.url_add_wishlist = "index.php?route=account/wishlist/add";
CPcart.url_remove_wishlist = "index.php?route=account/wishlist/delete";

CPcart.wishlistBtns = ".cp-wish-btn";
CPcart.wishNotify = "#cp-wish-notify";
CPcart.wished_icon = "fa-heart";
CPcart.not_wish_icon = "fa-heart-o";
CPcart.addWishlist = function(id, callback){
	var current = this;
	if(typeof parseInt(id) != 'number'){
		return;
	}
	$.ajax({
	  url: current.url_add_wishlist,
	  type: 'post',
	  data: {product_id: id},
	  dataType: 'json',
	  success: function(json) {
	    callback(json);
	    },            
	  error: function(xhr, ajaxOptions, thrownError) {
	      alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	  }
	});
};

CPcart.deleteWishlist = function(id, callback){
	var current = this;

	if(typeof parseInt(id) != 'number'){
		return;
	}
	$.ajax({
	    url: current.url_remove_wishlist,
	    type: 'post',
	    data: "product_id=" + id,
	    dataType: 'json',
	    beforeSend: function() {},
	    complete: function() {},
	    success: function(json) {
	       callback(json);
	    },
	    error: function(xhr, ajaxOptions, thrownError) {
	        alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
	    }
	});
};
