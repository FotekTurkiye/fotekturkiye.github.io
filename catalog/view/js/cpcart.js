//load this module after jQuery

window.CPcart = {
    url_get: "",
    url_add: "index.php?route=checkout/cart/add",
    url_update: "",
    url_remove: "",
    url_total: "index.php?route=checkout/cart/getTotal",
    rows: {},

    //elements 
    empty_status: "#cp-cart-empty-status",
    cart_notify: "#cp-cart-notify",
    quick_add_btns: ".cp-cart-btn",

    init: function(elementSelectors) {
        // required template
        this.container = elementSelectors.container;
        this.totalContainer = elementSelectors.totalContainer;
        this.itemTemplate = elementSelectors.itemTemplate;
        this.cartTable = elementSelectors.cartTable;
        //optional tempalte, can be overwritten
        this.priceTemplate = "<span>{{price}}</span>";
        this.specialPriceTemplate = "<span style='text-decoration:line-through;display:block;'>{{price}}</span><span style='color:#F00;'>{{special}}</span>";

        if (elementSelectors.priceTemplate) {
            this.priceTemplate = elementSelectors.priceTemplate;
        }
        if (elementSelectors.specialPriceTemplate) {
            this.specialPriceTemplate = elementSelectors.specialPriceTemplate;
        }
    },
    renderList: function(cart_data) {
        var current = this;

        $.each(cart_data, function(key, row) {
            var item = new CPcartItem(row, $(current.itemTemplate).html());
            $(current.container).append(item.container);
            current.rows[row.cart_id] = item;
        });

        if(Object.keys(current.rows).length != 0){
            $(current.empty_status).hide();
        }
    },
    add: function(product_id, set_id, ap, quantity, callback){
        var current = this;
        var data = {
            product_id: product_id
            ,product_option_set_id: set_id
            ,quantity: quantity
            ,ap: ap
        };

        $.ajax({
          url: current.url_add,
          type: 'post',
          data: data,
          dataType: 'json',
          success: function(json) {
            //specify update
            callback(json);
            //common update
            $(current.cart_notify).text(json['count']);
            },            
          error: function(xhr, ajaxOptions, thrownError) {
              alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
          }
        });
    },
    update: function(id, quantity){
        var current = this;
        $.ajax({
            url: current.url_update,
            type: 'post',
            data: "quantity[" + id + "]=" + quantity,
            dataType: 'json',
            beforeSend: function() {},
            complete: function() {
                current.updateTotal();
            },
            success: (json) => {
                $.each(json['update_patch'], (key, value) => {
                    if(this.rows[key] !== undefined){
                        this.rows[key].update(value);
                    }
                });
                $(this.cart_notify).text(json['count']);
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    updateTotal: function(){
        var current = this;
        $.ajax({
            url: current.url_total,
            type: 'post',
            dataType: 'json',
            beforeSend: function() {},
            complete: function() {},
            success: function(json) {
                //update view
                $(current.cartTable).load("index.php?route=checkout/cart/load_form");
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    remove: function(id){
        var current = this;
        $.ajax({
            url: current.url_remove,
            type: 'post',
            data: "key=" + id,
            dataType: 'json',
            beforeSend: function() {},
            complete: function() {
                current.update();
            },
            success: function(json) {
                //update view
                $(current.cartTable).load("index.php?route=checkout/cart/load_form");
            },
            error: function(xhr, ajaxOptions, thrownError) {
                alert(thrownError + "\r\n" + xhr.statusText + "\r\n" + xhr.responseText);
            }
        });
    },

    showMessage: function(type, message){
        var position = ".cp-message-position";
        
        var html = `
        '<div class="alert "><p style='display: inline;'></p>
            <button type="button" class="close" data-dismiss="alert">&times;</button>
         </div>'`;
         var template = $(html);

         template.find('p').html(message);
         switch(type){
            case "success":
                template.addClass('alert-success');
            break;
            case "warning":
                template.addClass('alert-warning');
            break;
            case "danger":
                template.addClass('alert-danger');
            break;
         }

        //delete other message box before parsing
        $(".alert").remove();
        $(position).prepend(template);
        $('html, body').animate({ scrollTop: $(position).position().top - 100 }, 'slow');
    }

};

class CPcartItem {
    constructor(data, html) {
        var html_row = html;
        //     //renderring - set data
        html_row = html_row.replace(/{{cart_id}}/g, data['cart_id']);
        html_row = html_row.replace(/{{cart_key}}/g, data['cart_key']);
        html_row = html_row.replace(/{{name}}/g, data['name']);
        html_row = html_row.replace(/{{href}}/g, data['href']);
        html_row = html_row.replace(/{{model}}/g, data['model']);
        html_row = html_row.replace(/{{thumb}}/g, data['thumb']);
        html_row = html_row.replace(/{{main_category}}/g, data['main_category']);
        // html_row = html_row.replace(/{{price}}/g, data['price']);
        html_row = html_row.replace(/{{quantity}}/g, data['quantity']);
        html_row = html_row.replace(/{{total}}/g, data['total']);

        var html = $(html_row);
        this.data = data;
        this.container = html;
        this.imageField = html.find(".cp-product-image-cell");
        this.nameField = html.find(".cp-product-name-cell");
        this.modelField = html.find(".cp-product-model-cell");
        this.optionField = html.find(".cp-product-option-list");
        this.quantityField = html.find(".cp-product-quantity-cell");
        this.priceField = html.find(".cp-product-price-cell");
        this.totalField = html.find(".cp-product-total-cell");
        this.stockWarningField = html.find(".cp-product-stock-warning");
        this.deleteBtn = html.find(".cp-cart-delete-btn");
        this.quantityAddBtn = html.find(".cp-product-quantity-add-btn");
        this.quantityMinusBtn = html.find(".cp-product-quantity-minus-btn");
        this.discountField = html.find(".cp-product-applied-discount");
        this.tagField = html.find(".cp-product-tag");

        this.quantityLimit = 99;
        //render details
        if (data.option_set) {
            var option_desc = "";
            $.each(data.option_set.values, function(k, item) {
                // console.log(item);
                option_desc += " - " + item.option_name + ": " + item.value_name + "<br>";
            });
            this.optionField.html(option_desc);
        }

        if (data['stock']) {
            this.stockWarningField.hide();
        } else {
            this.stockWarningField.show();
        }

        if (data['special']) {
            var price_html = CPcart.specialPriceTemplate;
            price_html = price_html.replace("{{price}}", data['price']);
            price_html = price_html.replace("{{special}}", data['special']);
            this.priceField.html(price_html);
        } else {
            var price_html = CPcart.priceTemplate;
            price_html = price_html.replace("{{price}}", data['price']);
            this.priceField.html(price_html);
        }

        if(data['discount'] !== undefined){
            this.discountField.text(data['discount']);
        }

        if(data['tag']){
            this.tagField.text(data['tag']);
        }else{
            this.tagField.remove();
        }

        //binding
        var currentObject = this;
        this.quantityAddBtn.on('click', function() {
            var qty = parseInt(currentObject.quantityField.val());
            if (qty + 1 <= currentObject.quantityLimit) {
                currentObject.quantityField.val(qty + 1).trigger("change");
            }
        });
        this.quantityMinusBtn.on('click', function() {
            var qty = parseInt(currentObject.quantityField.val());
            if (qty - 1 <= 0) {
                if (confirm("商品數量減至0時，會將該商品移除，您確定嗎")) {
                    currentObject.quantityField.val(qty - 1).trigger("change");
                }
            } else {
                currentObject.quantityField.val(qty - 1).trigger("change");
            }
        });
        this.quantityField.on('change', function() {

            var quantity = 0;
            $.each($('[name="quantity[' + currentObject.data['cart_id'] + ']"]'), function(index,value){
                quantity += parseInt(value.value); 
            });
            if (0 < quantity && quantity <= currentObject.quantityLimit) {
              CPcart.update(currentObject.data['cart_id'], quantity);
            } else if (quantity <= 0) {
              $(this).val(0);
              CPcart.remove(currentObject.data['cart_id']);
            } else if (quantity > currentObject.quantityLimit) {
              $(this).val(currentObject.quantityLimit);
            }
        });

        this.deleteBtn.on('click', function() {
            if (confirm("確定要刪除嗎")) {
                var quantity = 0;
                $.each($('[name="quantity[' + currentObject.data['cart_id'] + ']"]'), function(index,value){
                    quantity += parseInt(value.value); 
                });
                quantity -= parseInt($('.cart-' + currentObject.data['cart_key']).val());
                if(quantity == 0){
                    CPcart.remove(currentObject.data['cart_id']);
                } else {
                    CPcart.update(currentObject.data['cart_id'], quantity);
                }
            }
        });
    }

    update(data) {
        this.totalField.text(data['total']);
        if(data['stock']){
            this.stockWarningField.hide();
        }else{
            this.stockWarningField.show();
        }
    }

    remove(){
        delete CPcart.rows[this.data['cart_id']];
        this.container.remove();
    }
}
