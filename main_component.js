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
		
		<div>
			<h2>Reviews:</h2>
			<p v-if="!reviews.length">No reviews yet</p>
			<ul v-else>
				<li v-for="(x, index) in reviews" :key="index">
					<p>Name: {{x.name}}</p>
					<p>Rating: {{x.rating}}</p>
					<p>Review: {{x.review}}</p>
					<p>Recommened: {{x.recommend}}</p>
				</li>
			</ul>
	    </div>
		
		<product_review @review-submitted="addReview"></product_review>
		
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
		reviews:[]

	}
},

	methods:
	{
		addToCart: function(){ this.$emit('add-to-cart-event', this.variants[this.selectedVarient].variantId)}, //listning to event 'all-to-cart-event'
		removeFromCart: function(){this.$emit('remove-from-cart-event', this.variants[this.selectedVarient].variantId)},
		updateProductImage: function(index){this.selectedVarient=index;},	   //updateProduct: function(variantImage){this.image=variantImage;}
		addReview: function(productReview){ this.reviews.push(productReview);},
																												
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
	<form class="review-form" @submit.prevent="onSubmit">
      
      <p v-if="errors.length">
      	<b>Please correct the following errors:</b>
      	<ul v-for="x in errors">
    		<li>{{x}}</li>  	
		</ul>
      </p>
      
      <p>
        <label for="name" >Name:</label>
        <input id="name" v-model="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      
   	   <p>Would you recommend this product?</p>
        <label>
          Yes
          <input type="radio" value="Yes" v-model="recommend"/>
        </label>
        <label>
          No
          <input type="radio" value="No" v-model="recommend"/>
        </label>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
	`,
	data()
	{
		return{
			name:null,
			review:null,
			rating:null,
			recommend:null,
			errors:[],
		}
	},
	methods:
	{
		onSubmit(){
			if(this.name && this.review && this.ratring && this.recommend)
			{
				this.errors.length=0;
				let productReview={
					name:this.name,
					review:this.review,
					recommend:this.recommend,
					rating:this.rating
				}
				this.$emit('review-submitted', productReview),
					this.name=null,
					this.review=null,
					this.recommend=null,
					this.ratring=null
			}
			else
			{
				this.errors.length=0; //delete the old reports from the "errors[]" upon each submittion
				if(!this.name) this.errors.push("Name required");
				if(!this.review) this.errors.push("Review required");
				if(!this.recommend) this.errors.push("Recommendation required");
				if(!this.rating) this.errors.push("Rating required");
			}

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