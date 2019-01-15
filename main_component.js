Vue.component('product', {
props:
{
	premium:
	{
		type:Boolean,
		required:true
	}
},
template:`
	<div class="product">
	
		<div class="product-image">
			<img :src="image">
		</div>
		
		<div class="product-info">
			<h1>{{title}}</h1>
			<p v-if="inStock > 10">In Stock</p>
			<p v-else-if="inStock <=10 && inStock > 0">Almost sold out</p>
			<p v-else>Out of Stock</p>
			<p v-show="display_discount">{{onSale}} 10% Discount </p>
			<p>Shipping: {{shipping}}</p>
			
			<ul>
				<li v-for="x in details">{{ x }}</li>
			</ul>
		
			<!--   v-for="x in variants"   																				<!--@mouseover="updateProduct(x.variantImage)"-->
			<div v-for="(x,index) in variants" :key="x.variantId" class="color-box" :style="{backgroundColor:x.variantColour}"  @mouseover="updateProductImage(index)">
				
			</div> 
			
			<button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton:!inStock}">Add to Cart</button>  <!--    v-on:click="cart += 1"   -->
			<button v-on:click="removeFromCart" :disabled="!inStock" :class="{disabledButton:!inStock}">Remove from Cart</button>  <!--    v-on:click="cart += 1"   -->
		</div>
		
		<product_review></product_review>
		
	</div>
`,
data()
{
	return{
		product:'Socks',
		brand:'Warm Me',
		selectedVarient:0, //image:'vmSocks-green-onWhite.jpg',
		display_discount:true,
		inventory:100,
		//inStock:false,
		details:["80% Coton", "20% Polyester", "Gender-Neutral"],
		variants:[
					{variantId:224,
					variantColour:"Green",
					variantQuantity:100,
					variantImage:'vmSocks-green-onWhite.jpg'},
					{variantId:225,
					variantColour:"Blue",
					variantQuantity:0,
					variantImage:'vmSocks-blue-onWhite.jpg'},
				],

	}
},

	methods:
	{
		addToCart: function(){ this.$emit('add-to-cart-event', this.variants[this.selectedVarient].variantId)}, //listning to event 'all-to-cart-event'
		removeFromCart: function(){this.$emit('remove-from-cart-event', this.variants[this.selectedVarient].variantId)},
		updateProductImage: function(index){this.selectedVarient=index;}	   //updateProduct: function(variantImage){this.image=variantImage;}
																												
	},
	computed:
	{
		title()
		{
			return this.brand+" "+this.product;
		},
		image()
		{
			return this.variants[this.selectedVarient].variantImage;
		},
		inStock()
		{
			return this.variants[this.selectedVarient].variantQuantity;
		},
		onSale()
		{
			return "On Sale:";
		},
		shipping()
		{
			if(this.premium)
			{return "Free";}
			return 2.99;
		}
	}
})

Vue.component('product_review',{
	template:`
	<form class="review-form">
      <p>
        <label for="name">Name:</label>
        <input id="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data()
	{
		return
		{
			name:null
		}
	}
})

var app=new Vue(
{
	el:'#app',
	data:
	{
		premium:true,
		cart:[],
	},
	methods:
	{
		updateCart(id){this.cart.push(id)},
		decrCart(id){this.cart.pop(id)}
	}	
}
)