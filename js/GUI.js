/**
 * Created by TimR on 1/12/14.
 */

//Extension to JQuery
$.wait = function( callback, seconds){
   return window.setTimeout( callback, seconds * 1000 );
}
/*
*	Object responsible for manipulating the progressDialog
*	in the addModal
*/
var waitingDialog;
waitingDialog = waitingDialog || (function () {
    var progressDialog = $(".progress");
    progressDialog.hide();
    return {
        showProgress: function(progressWidth) {
            progressDialog.show().children().first().width(progressWidth+ "%");
            //progressDialog.children().first().first().text(progressWidth + "% Complete");
        },
        hidePleaseWait: function () {
            progressDialog.hide();
        },
        showMessage : function(message){     	
        	progressDialog.children().first().first().text(message);
        }
    };
})();

/*
*	Object responsible for manipulating the alerts
*	on top of the screen.
*/
var alertBox;
alertBox = alertBox || (function(){
	var alertBox = $("#alerts");
	alertBox.empty();
	var class_danger = "alert-danger";
	var class_warning = "alert-warning";
	var class_success = "alert-success"
	var template = "<a href='#' style=''>" +
						"<div class='alert [class] alert-dismissible' data-callbackid='[callbackid]' onclick='alertBox.removeAlert(this)' role='alert' style='box-shadow:10px 10px 40px #888888'>" +
							"<button type='button' class='close' data-dismiss='alert'>" +
	                          "<span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span>" +
	                      	"</button>"+
	                    	"<strong>[title]</strong> [message]<br/> <strong>Tijdstip van aanvraag:</strong> [time]"+
	                  	"</div>" +
	                "</a>";

	function getDateString(){
		var date = new Date();
		var options = {
		    weekday: "long", year: "numeric", month: "short",
		    day: "numeric", hour: "2-digit", minute: "2-digit"
		};
		return date.toLocaleDateString("en-us", options);
	}

	return {
		removeAlert: function(alertView){
			var callback_id = alertView.dataset.callbackid !== "[callbackid]" ? alertView.dataset.callbackid : 0;
			if (callback_id != 0) {
				//Delete the localstorage value
				localStorage.removeItem("messageJSON");
				
				//Set isViewed status on server
				//Post
				$.post("http://student.howest.be/tim.rijckaert/updateMessage.php", {id : callback_id},
					function(){
						console.log("Status of message is changed on database.");
				})
			};

			//Remove the DOM element
			alertView.remove();
		}, 
		addAlert: function(class_id, title, message, callback_id){
			//make custom alert
			var stringbuilder_template = template;
			
			//Add correct class to the alertDialog
			switch(class_id){
				case 1:
					stringbuilder_template = stringbuilder_template.replace("[class]", class_danger);
					break;
				case 2:
					stringbuilder_template = stringbuilder_template.replace("[class]", class_warning);
					break;
				case 3:
					stringbuilder_template = stringbuilder_template.replace("[class]", class_success);
					break;
			}

			//Add the title
			stringbuilder_template = stringbuilder_template.replace("[title]", title);

			//Add the message
			stringbuilder_template = stringbuilder_template.replace("[message]", message);

			//Add the callback_id if present
			if (callback_id != null) {
				stringbuilder_template = stringbuilder_template.replace("[callbackid]", callback_id);
			};

			//Add the time
			var date_string = getDateString();

			stringbuilder_template = stringbuilder_template.replace("[time]", date_string);

			//add to the DOM
			alertBox.append(stringbuilder_template);
		}, 
		emptyHolder : function(){
			alertBox.empty();
		}
	}
})();

/*
*	Class Representing an Ingredient Object
*/
var Ingredient = (function() {
	'use strict';

	function Ingredient(id, ingredient_name, amount) {
		// enforces new
		if (!(this instanceof Ingredient)) {
			return new Ingredient(id, name);
		}
		// constructor body
		this.id = id;
		this.ingredient_name = ingredient_name;
		this.amount = amount;
	}

	Ingredient.prototype.toString = function() {
		// method body
		return this.id + " " + this.ingredient_name + " " + this.amount;
	};

	return Ingredient;
}());

/*
* Class Representing the different Dishes
* according to when they are served
*/
var DishTime = (function() {
	'use strict';

	function DishTime(starters, main, dessert) {
		// enforces new
		if (!(this instanceof DishTime)) {
			return new DishTime(args);
		}
		// constructor body
		this.starters = starters;
		this.main = main;
		this.dessert = dessert;
	}

	DishTime.prototype.toString = function() {
		return this.starters + " " + this.main + " " + this.dessert;
	};

	return DishTime;
}());

/*
*	Class Representing Dish
*/
var Dish = (function() {
	'use strict';

	function Dish(id, food_name) {
		// enforces new
		if (!(this instanceof Dish)) {
			return new Dish(id, food_name);
		}
		// constructor body
		this.id = id;
		this.food_name = food_name;
	}

	return Dish;
}());

/*
*	Object responsible for manipulating the DOM.	
*/
var GUIBuilder = (function() {
	//API
	var baseURL = "http://student.howest.be/tim.rijckaert/";

	//Views
	var voorGerechtHolder, hoofdGerechtHolder, naGerechtHolder, brandName, modalButton;
	//Alerts
	var alerts;
	//View in Modal
	var addModal, gerechtNaam, uitleg, urlFoto, priceGerecht,  hoeveelheid, ingredient_search, ingredients_list, ingredientToevoegenButton, toegevoegdeIngredienten, progressBar;

	/*
	*	Simple functions returns the JQuery 
	*	object DOM Element
	*/
	function getView(wantedView){
		return $(wantedView);
	}

	/**
	*	Shows the ingredients in the custom 
	*	Bootstrap Combobox. With the requested query
	*/
	function displayIngredients(){
		//Clear all the previous ingredients
		ingredients_list.empty();
		
		//Get the query text
		var query = ingredient_search.val();

		//Get the results from the server
		$.ajax({
		    crossDomain:true,
		    type: "GET",
		    url: baseURL + "getFoodByName.php",
		    data: {
		        'q': query,
		        'max': 10
		    },
		    success: function(response){
		    	//JSON parsing
		    	var json_response = $.parseJSON($.parseJSON(response)[0]);
		    	//
		    	var dish_array = [];
		    	$.each(json_response.foods.food, function(i, val){
		    		var id = json_response.foods.food[i].food_id;
		    		var food_name = json_response.foods.food[i].food_name;
		    		//FatAPI concat the string. :(
		    		food_name = food_name.split(/(?=[A-Z])/);
		    		dish_array.push(new Dish(id, food_name));
		    	});

		    	//Build the append Options
		    	var append_string = "<select class='form-control combobox'><option></option>";
		    	for (var i = 0; i < dish_array.length; i++) {
		    		append_string += "<option value='" + dish_array[i].id + "'>" + dish_array[i].food_name + "</option>";
		    	};
		    	append_string += "</select>";
		    	
		    	//Place results in the <select>
		    	ingredients_list.append(append_string).show();

				//Reload the custom combobox bootstrap
				$('.combobox').combobox();

				//DEBUG
				console.log("Found Ingredients Matching: " + query);
				console.log(json_response.foods.food);
		    }
		});
	}

	/**
	*	Updates the Dish
	*/
	function postEditDish(selectedDish){
		//Get rid of the localstorage
		localStorage.removeItem("selectedDish");

		var selectedDish = $.parseJSON(selectedDish);
		var selectedDish_ID = selectedDish.id;

		//Add progress to the progressBar
		waitingDialog.showProgress(20);

		//Get the values
		var name = gerechtNaam.val();
		var description = uitleg.val();
		var price = priceGerecht.val();
		var dish_cat_id = $('input[name=optionsRadios]:checked', '.radio').val();
		var URL = urlFoto.val();
		var dish_categories = $('input:checkbox:checked').map(function() {
		    return this.value;
		}).get();

		$.wait(function(){waitingDialog.showProgress(30)}, 1/2);

		//Get Ingredients
		var arr_ingredient_holder = getView("a[href='#'] span[class='badge']").parent();
		var arr_ingr_amount = [];
		var arr_ingr_id = [];
		var arr_ingr_name = [];
		var arr_ingr_obj = [];
		for (var i = 0; i < arr_ingredient_holder.length; i++) {
			arr_ingr_id.push(arr_ingredient_holder[i].dataset.ingredient);
			arr_ingr_amount.push(arr_ingredient_holder[i].dataset.amount);
			arr_ingr_name.push(arr_ingredient_holder[i].dataset.name);

			//Push an ingredient to the list
			if (isNaN(arr_ingr_amount[i])) {
				waitingDialog.showMessage("Hoeveelheid fout!");
				return;
			};
			arr_ingr_obj.push(new Ingredient(arr_ingr_id[i], arr_ingr_name[i], arr_ingr_amount[i]));
		};

		$.wait(function(){waitingDialog.showProgress(40)}, 1/2);

		//Create a Dish object with extra params
		var new_created_dish = new Dish();
		//Add values
		//Name
		new_created_dish.food_name = name;
		//Photo URL
		new_created_dish.URL = URL;
		//Description
		new_created_dish.description = description;
		//Dish Category ID {1: "Voorgerecht", 2: "Hoofdschotel", 3: "Nagerecht"};
		new_created_dish.dish_cat_id = dish_cat_id;
		//Price 
		new_created_dish.price = price;
		//Ingredients
		new_created_dish.ingredients = arr_ingr_obj;
		//Categories
		new_created_dish.categories = dish_categories;

		$.wait(function(){waitingDialog.showProgress(45)}, 1);

		//Delete the unwanted properties
		delete selectedDish.calories;
		delete selectedDish.fat;
		delete selectedDish.id;
		delete selectedDish.protein;
		delete selectedDish.rating;
		delete selectedDish.sodium;
		delete selectedDish.sugar;
		for (var i = 0; i < selectedDish.ingredients.length; i++) {
			selectedDish.ingredients[i].id = selectedDish.ingredients[i].fatAPI_id;
			delete selectedDish.ingredients[i].fatAPI_id;
		};
		var arr_categories = [];
		for (var i = 0; i < selectedDish.categories.length; i++) {
			arr_categories.push(selectedDish.categories[i].cat_name_id);
		};
		selectedDish.categories = arr_categories;

		//Delete undefined ID
		delete new_created_dish.id;

		//Check differences
		if (JSON.stringify(new_created_dish) === JSON.stringify(selectedDish)) {
			addModal.modal('hide');
			wipeModal();
			return;
		};

		//Calculate the information
		waitingDialog.showMessage("Ingredient Informatie Opvragen ...");
		for (var i = 0; i < arr_ingr_obj.length; i++) {
			$.when(
				$.ajax({
				    crossDomain:true,
				    type: "GET",
				    async: false,
				    url: baseURL + "getFoodByID.php",
				    data: {
				        'id': arr_ingr_obj[i].id
				    },
				    timeout: 1000,
				    success : function(response){
				    	try{
				    		//JSON parsing
				    		//Rare bug soms geeft de API dit teken terug :(
				    		response = response.replace("<", "");
					    	var json_response = $.parseJSON($.parseJSON(response)[0]);
					    	//Add extra info to obj

				    		var serving = json_response.food.servings.serving[0] == null ? json_response.food.servings.serving : json_response.food.servings.serving[0];
					    	var serv_amount = serving.metric_serving_amount;
					    	
					    	//Calculate Food Information
					    	//Calculate Calories
					    	arr_ingr_obj[i].calories = arr_ingr_obj[i].amount*(serving.calories/serv_amount);
					    	//Calculate Proteins Levels
					    	arr_ingr_obj[i].proteins = arr_ingr_obj[i].amount*(serving.protein/serv_amount);
					    	//Calculate Fat Levels
					    	arr_ingr_obj[i].fat = arr_ingr_obj[i].amount*(serving.fat/serv_amount);
					    	//Calculate Sodium Levels
					    	arr_ingr_obj[i].sodium = arr_ingr_obj[i].amount*(serving.sodium/serv_amount);
					    	//Calculate Sugar Levels
					    	arr_ingr_obj[i].sugar = arr_ingr_obj[i].amount*(serving.sugar/serv_amount);
				    	}catch(e){
				    		waitingDialog.showMessage("Probleem bij het ophalen van het ingredient:" + arr_ingr_obj.toString());
				    	}
				    	
					}
				})
			)
		};

		$.wait(function(){waitingDialog.showProgress(70)}, 1);

		//Food Info
		var arr_foodi_cal = [];
		var arr_foodi_prot = [];
		var arr_foodi_fat = [];
		var arr_foodi_sod = [];
		var arr_foodi_sug = [];

		//Get values from all Ingredients
		for (var i = 0; i < arr_ingr_obj.length; i++) {
			var cal = isNaN(arr_ingr_obj[i].calories) ? 0 : arr_ingr_obj[i].calories;
			var prot = isNaN(arr_ingr_obj[i].proteins) ? 0 : arr_ingr_obj[i].proteins;
			var fat = isNaN(arr_ingr_obj[i].fat) ? 0 : arr_ingr_obj[i].fat;
			var sod = isNaN(arr_ingr_obj[i].sodium) ? 0 : arr_ingr_obj[i].sodium;
			var sug = isNaN(arr_ingr_obj[i].sugar) ? 0 : arr_ingr_obj[i].sugar;

			//Add them to array
			arr_foodi_cal.push(cal);
			arr_foodi_prot.push(prot);
			arr_foodi_fat.push(fat);
			arr_foodi_sod.push(sod);
			arr_foodi_sug.push(sug);
		};

		//Add them all up
		new_created_dish.calorie = 0;
		new_created_dish.protein = 0;
		new_created_dish.fat =0;
		new_created_dish.sodium = 0;
		new_created_dish.sugar = 0;
		for (var i = 0; i < arr_foodi_cal.length; i++) {
			new_created_dish.calorie += arr_foodi_cal[i];
			new_created_dish.protein += arr_foodi_prot[i];
			new_created_dish.fat += arr_foodi_fat[i];
			new_created_dish.sodium += arr_foodi_sod[i];
			new_created_dish.sugar += arr_foodi_sug[i];
		};

		$.wait(function(){waitingDialog.showProgress(75)}, 1);

		//Check if everything is filled in
		var bool_ready_to_post = false;

		waitingDialog.showMessage("Gegevens aan het controleren ...");
		var arr_properties = ["food_name", "description", "price", "dish_cat_id", "URL", "categories", "ingredients", "calorie", "protein", "fat", "sodium", "sugar"];
		var bool_has_all_prop = true;
		var bool_no_prop_null = true;
		var bool_arr_is_not_empty = true;
		for (var i = 0; i < arr_properties.length; i++) {
			//1. Check if all properties are present
			if (!new_created_dish.hasOwnProperty(arr_properties[i])) {
				bool_has_all_prop = false;
				break;
			}else{
				//2. Check if not null
				if (new_created_dish[arr_properties[i]] === "") {
					bool_no_prop_null = false; 
					waitingDialog.showMessage(arr_properties[i].replace("_", " ") + " is leeg!"); 
					break;
				}else{
					if (new_created_dish.categories.length <= 0){
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Duid minstens 1 categorie aan.");
						break;
					} else if(new_created_dish.ingredients.length <= 0 ) {
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Vul minstens 1 ingrdiënt in.");
						break;
					} else if(isNaN(new_created_dish.price)){
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Prijs is geen getal!");
						break;
					}
				}
			}
		};
		//Add (binairy) all validation bool
		bool_ready_to_post = bool_has_all_prop && bool_no_prop_null && bool_arr_is_not_empty;

		//Don't post if not valid
		if (!bool_ready_to_post) {
			return;
		}

		waitingDialog.showMessage("Gegevens Correct! Bezig Met Versturen ...");

		$.wait(function(){
			var data = {
				id : selectedDish_ID,
				URL : new_created_dish.URL,
				name : new_created_dish.food_name,
				description : new_created_dish.description,
				price : new_created_dish.price,
				calories : new_created_dish.calorie,
				fat : new_created_dish.fat,
				sugar : new_created_dish.sugar,
				sodium : new_created_dish.sodium,
				protein : new_created_dish.protein,
				dish_cat_id : new_created_dish.dish_cat_id,
				ingredients : arr_ingr_name,
				ingredients_id : arr_ingr_id,
				ingredients_amount : arr_ingr_amount,
				categories: new_created_dish.categories
			};

			//Post
			$.post( baseURL + "updateDish.php", data,
				function(){
					console.log("Success Editing Dish.");
			})
				.done(function(){
					$.wait(function(){waitingDialog.showProgress(80)}, 1);
					$.wait(function(){waitingDialog.showProgress(90)}, 1);
					$.wait(function(){waitingDialog.showProgress(100)}, 1);

					//Feedback 
					console.log("Dish was changed on the db. ", new_created_dish);
					$.wait(function(){addModal.modal('hide')}, 1);
					$.wait(function(){alertBox.addAlert(3, "Success!", new_created_dish.food_name + " is bijgewerkt op de server!");}, 1);

					//herladen van huidig scherm
					getDishesByTime();

				})
				.fail(function(){
					console.log("Error! Posting: ", new_created_dish);
					alertBox.addAlert(1, "Error!", "Kon " + new_created_dish.food_name + " niet bijwerken op de database!");
				});

			//Make all the fields blank again
			wipeModal();
		}, 3);
	}

	/**
	*	Posts a Place to the API
	*	Checks if everything was filled in correctly too
	*/
	function postAddDish(){
		//Check if in Editing State
		if (localStorage['selectedDish'] != null) {
			postEditDish(localStorage['selectedDish']);
			return;
		};

		//Add progress to the progressBar
		waitingDialog.showProgress(20);
		//Get the values
		var name = gerechtNaam.val();
		var description = uitleg.val();
		var price = priceGerecht.val();
		var dish_cat_id = $('input[name=optionsRadios]:checked', '.radio').val();
		var URL = urlFoto.val();
		var dish_categories = $('input:checkbox:checked').map(function() {
		    return this.value;
		}).get();

		$.wait(function(){waitingDialog.showProgress(30)}, 1/2);

		//Get Ingredients
		var arr_ingredient_holder = getView("a[href='#'] span[class='badge']").parent();
		var arr_ingr_amount = [];
		var arr_ingr_id = [];
		var arr_ingr_name = [];
		var arr_ingr_obj = [];
		for (var i = 0; i < arr_ingredient_holder.length; i++) {
			arr_ingr_id.push(arr_ingredient_holder[i].dataset.ingredient);
			arr_ingr_amount.push(arr_ingredient_holder[i].dataset.amount);
			arr_ingr_name.push(arr_ingredient_holder[i].dataset.name);

			//Push an ingredient to the list
			if (isNaN(arr_ingr_amount[i])) {
				waitingDialog.showMessage("Hoeveelheid fout!");
				return;
			};
			arr_ingr_obj.push(new Ingredient(arr_ingr_id[i], arr_ingr_name[i], arr_ingr_amount[i]));
		};

		$.wait(function(){waitingDialog.showProgress(40)}, 1);
		
		//Create a Dish object with extra params
		var new_created_dish = new Dish();
		//Add values
		//Name
		new_created_dish.food_name = name;
		//Description
		new_created_dish.description = description;
		//Price 
		new_created_dish.price = price;
		//Dish Category ID {1: "Voorgerecht", 2: "Hoofdschotel", 3: "Nagerecht"};
		new_created_dish.dish_cat_id = dish_cat_id;
		//Photo URL
		new_created_dish.URL = URL;
		//Categories
		new_created_dish.categories = dish_categories;
		//Ingredients
		new_created_dish.ingredients = arr_ingr_obj;

		$.wait(function(){waitingDialog.showProgress(45)}, 1);
		
		//Calculate the information
		waitingDialog.showMessage("Ingredient Informatie Opvragen ...");
		for (var i = 0; i < arr_ingr_obj.length; i++) {
			$.when(
				$.ajax({
				    crossDomain:true,
				    type: "GET",
				    async: false,
				    url: baseURL + "getFoodByID.php",
				    data: {
				        'id': arr_ingr_obj[i].id
				    },
				    timeout: 1000,
				    success : function(response){
				    	try{
				    		//JSON parsing
				    		//Rare bug soms geeft de API dit teken terug :(
				    		response = response.replace("<", "");
					    	var json_response = $.parseJSON($.parseJSON(response)[0]);
					    	//Add extra info to obj

				    		var serving = json_response.food.servings.serving[0] == null ? json_response.food.servings.serving : json_response.food.servings.serving[0];
					    	var serv_amount = serving.metric_serving_amount;
					    	
					    	//Calculate Food Information
					    	//Calculate Calories
					    	arr_ingr_obj[i].calories = arr_ingr_obj[i].amount*(serving.calories/serv_amount);
					    	//Calculate Proteins Levels
					    	arr_ingr_obj[i].proteins = arr_ingr_obj[i].amount*(serving.protein/serv_amount);
					    	//Calculate Fat Levels
					    	arr_ingr_obj[i].fat = arr_ingr_obj[i].amount*(serving.fat/serv_amount);
					    	//Calculate Sodium Levels
					    	arr_ingr_obj[i].sodium = arr_ingr_obj[i].amount*(serving.sodium/serv_amount);
					    	//Calculate Sugar Levels
					    	arr_ingr_obj[i].sugar = arr_ingr_obj[i].amount*(serving.sugar/serv_amount);
				    	}catch(e){
				    		waitingDialog.showMessage("Probleem bij het ophalen van het ingredient:" + arr_ingr_obj.toString());
				    	}
				    	
					}
				})
			)
		};

		$.wait(function(){waitingDialog.showProgress(70)}, 1);

		//Food Info
		var arr_foodi_cal = [];
		var arr_foodi_prot = [];
		var arr_foodi_fat = [];
		var arr_foodi_sod = [];
		var arr_foodi_sug = [];

		//Get values from all Ingredients
		for (var i = 0; i < arr_ingr_obj.length; i++) {
			var cal = isNaN(arr_ingr_obj[i].calories) ? 0 : arr_ingr_obj[i].calories;
			var prot = isNaN(arr_ingr_obj[i].proteins) ? 0 : arr_ingr_obj[i].proteins;
			var fat = isNaN(arr_ingr_obj[i].fat) ? 0 : arr_ingr_obj[i].fat;
			var sod = isNaN(arr_ingr_obj[i].sodium) ? 0 : arr_ingr_obj[i].sodium;
			var sug = isNaN(arr_ingr_obj[i].sugar) ? 0 : arr_ingr_obj[i].sugar;

			//Add them to array
			arr_foodi_cal.push(cal);
			arr_foodi_prot.push(prot);
			arr_foodi_fat.push(fat);
			arr_foodi_sod.push(sod);
			arr_foodi_sug.push(sug);
		};

		//Add them all up
		new_created_dish.calorie = 0;
		new_created_dish.protein = 0;
		new_created_dish.fat =0;
		new_created_dish.sodium = 0;
		new_created_dish.sugar = 0;
		for (var i = 0; i < arr_foodi_cal.length; i++) {
			new_created_dish.calorie += arr_foodi_cal[i];
			new_created_dish.protein += arr_foodi_prot[i];
			new_created_dish.fat += arr_foodi_fat[i];
			new_created_dish.sodium += arr_foodi_sod[i];
			new_created_dish.sugar += arr_foodi_sug[i];
		};

		$.wait(function(){waitingDialog.showProgress(75)}, 1);

		//Check if everything is filled in
		var bool_ready_to_post = false;

		waitingDialog.showMessage("Gegevens aan het controleren ...");
		var arr_properties = ["food_name", "description", "price", "dish_cat_id", "URL", "categories", "ingredients", "calorie", "protein", "fat", "sodium", "sugar"];
		var bool_has_all_prop = true;
		var bool_no_prop_null = true;
		var bool_arr_is_not_empty = true;
		for (var i = 0; i < arr_properties.length; i++) {
			//1. Check if all properties are present
			if (!new_created_dish.hasOwnProperty(arr_properties[i])) {
				bool_has_all_prop = false;
				break;
			}else{
				//2. Check if not null
				if (new_created_dish[arr_properties[i]] === "") {
					bool_no_prop_null = false; 
					waitingDialog.showMessage(arr_properties[i].replace("_", " ") + " is leeg!"); 
					break;
				}else{
					if (new_created_dish.categories.length <= 0){
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Duid minstens 1 categorie aan.");
						break;
					} else if(new_created_dish.ingredients.length <= 0 ) {
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Vul minstens 1 ingrdiënt in.");
						break;
					} else if(isNaN(new_created_dish.price)){
						bool_arr_is_not_empty = false;
						waitingDialog.showMessage("Prijs is geen getal!");
						break;
					}
				}
			}
		};
		//Add (binairy) all validation bool
		bool_ready_to_post = bool_has_all_prop && bool_no_prop_null && bool_arr_is_not_empty;

		//Don't post if not valid
		if (!bool_ready_to_post) {
			return;
		}

		waitingDialog.showMessage("Gegevens Correct! Bezig Met Versturen ...");

		var data = {
			URL : new_created_dish.URL,
			name : new_created_dish.food_name,
			description : new_created_dish.description,
			price : new_created_dish.price,
			calories : new_created_dish.calorie,
			fat : new_created_dish.fat,
			sugar : new_created_dish.sugar,
			sodium : new_created_dish.sodium,
			protein : new_created_dish.protein,
			dish_cat_id : new_created_dish.dish_cat_id,
			ingredients : arr_ingr_name,
			ingredients_id : arr_ingr_id,
			ingredients_amount : arr_ingr_amount,
			categories: new_created_dish.categories
		};

		$.post( baseURL + "addDish.php", data,
			function(){
				console.log("success");
		})
			.done(function(){
				$.wait(function(){waitingDialog.showProgress(80)}, 1);
				$.wait(function(){waitingDialog.showProgress(90)}, 1);
				$.wait(function(){waitingDialog.showProgress(100)}, 1);

				//Feedback 
				console.log("New dish was posted on the db. ", new_created_dish);
				$.wait(function(){addModal.modal('hide')}, 1);
				$.wait(function(){alertBox.addAlert(3, "Success!", new_created_dish.food_name + " is toegevoegd aan de database!");}, 1);

				//herladen van huidig scherm
				getDishesByTime();

			})
			.fail(function(){
				console.log("Error! Posting: ", new_created_dish);
				alertBox.addAlert(1, "Error!", "Kon " + new_created_dish.food_name + " niet toevoegen aan de database!");
			});

		//Make all the fields blank again
		wipeModal();
	}

	/**
	*	Helper function that cleans the Modal
	*	Reverts them back to initial values
	*/
	function wipeModal(){
		gerechtNaam.val("");
		uitleg.val("");
		urlFoto.val("");
		hoeveelheid.val("");
		priceGerecht.val("");
		ingredient_search.val("");
		toegevoegdeIngredienten.empty();
		$.each($('input:checkbox:checked'), function(){
			$(this).first().attr("checked", false);
		});
		waitingDialog.hidePleaseWait();
	}

	/**
	*	Do post to PHP file 
	*	responsible for the deletion
	*/
	function postDeleteDish(dish_id){
		var data = {
			dish_id : dish_id
		};
		$.post(baseURL + "deleteDish.php", data,
			function(){
				//success
				alertBox.addAlert(3, "Success!", "Gerecht verwijderd!");

				//herladen van huidig scherm
				getDishesByTime();
		})
			.fail(function(){
				alertBox.addAlert(1, "Error!", "Gerecht kon niet verwijderd worden!");
			});
	}

	/**
	*	Adds an icon showing an ingredient 
	*	in the modal.
	*/
	function addIngredient(){
		//Get the selected <option>-tag
		selectedOption = getView(".form-control.combobox option:selected");
		
		//Get the values to make the template
		var query_hoeveelheid = hoeveelheid.val() === "" ? "null" : hoeveelheid.val();
		var query_ingredient_id = selectedOption.val() === "" ? "null" : selectedOption.val();
		var query_ingredient_name = selectedOption.text().trim() === "" ? "null" : selectedOption.text().trim();
		var template = "<a href='#' onclick='GUIBuilder.deleteIngredient(this)' data-amount='" + 
						query_hoeveelheid + 
						"' data-ingredient='" + 
						query_ingredient_id + 
						"' data-name='" + 
						query_ingredient_name +
						"'><span style='margin:1%;' class='badge'><i class='glyphicon glyphicon-trash'></i> " + 
						query_ingredient_name + " ("+ query_hoeveelheid  +" g)</span></a>";

		//Add to DOM
		if(template.indexOf("null") == -1){
			toegevoegdeIngredienten.append(template);
			hoeveelheid.parent().removeClass("has-error");
		}else{ //--> 88: geen hoeveelheid | 108: geen ingrediënt
			hoeveelheid.parent().addClass("has-error");
			$.wait(function(){hoeveelheid.parent().removeClass("has-error");}, .5);
		}
	}

	/**
	*	Fetches the different dishes
	*	and shows them in the correct holders.
	*/
	function getDishesByTime(){
		//Clear all previous dishes
		voorGerechtHolder.empty();
		hoofdGerechtHolder.empty();
		naGerechtHolder.empty();

		//Get the results from the server
		$.ajax({
		    crossDomain:true,
		    type: "GET",
		    url: baseURL + "getDishes.php",
		    success: function(response){
		    	//Save in localStorage for later use
		    	localStorage["getDishesJSON"] = response;

		    	//JSON parsing
		    	var json_response = $.parseJSON(response);

		    	var arr_starters = [];
		    	var arr_main = [];
		    	var arr_dessert = [];
		    	for (var i = 0; i < json_response.length; i++) {
		    		if (json_response[i].disch_cat_id == "1") {
		    			arr_starters.push(json_response[i]);
		    		}else if(json_response[i].disch_cat_id == "2"){
		    			arr_main.push(json_response[i]);
		    		}else if(json_response[i].disch_cat_id == "3"){
	    				arr_dessert.push(json_response[i]);
		    		}
		    	};

		    	//String builder
		    	var string_new_row = "<div class='row'>";
		    	var string_starters = string_new_row;
		    	var string_main = string_new_row;
		    	var string_dessert = string_new_row;

		    	var template = "<div class='col-sm-6 col-md-4'><div class='thumbnail' style='box-shadow:10px 10px 40px #888888;'><img src='[photo]' alt='[name]'><div class='caption'><h3>[name]</h3><p>[description]</p><span style='margin:1%;' class='badge'> [rating] </span><span style='margin:1%;' class='badge'><i class='glyphicon glyphicon-info-sign'></i> [cal] cal</span><span style='margin:1%;' class='badge'><i class='glyphicon glyphicon-euro'></i> [price]</span><div style='margin-top:2%;'><button style='margin-right:2%;' onclick='[editDish]' type='button' class='btn btn-default' aria-label='Left Align'><span class='glyphicon glyphicon-pencil' aria-hidden='true'> Bewerken</span></button><button type='button' onclick='[deleteDish]' class='btn btn-danger' style='float:right;' aria-label='Left Align'><span class='glyphicon glyphicon-trash' aria-hidden='true'> Verwijderen</span></button></div></div></div></div>";
				var template_star_full = "<i class='glyphicon glyphicon-star' style='margin-left: 1%'></i>";
				var template_star_empty = "<i class='glyphicon glyphicon-star-empty' style='margin-left: 1%'></i>";
		    	//Starters string builder
		    	for (var i = 0; i < arr_starters.length; i++) {
		    		//Check end of row
		    		if (i%3 == 0) {
		    			if (i != 0) {
		    				string_starters += "</div>" + string_new_row;
		    			}
		    		}
		    		var template_dish = template.replace("[photo]", arr_starters[i].Local == null ? arr_starters[i].URL : arr_starters[i].Local);
		    		template_dish = template_dish.replace("[name]", arr_starters[i].name);
		    		template_dish = template_dish.replace("[name]", arr_starters[i].name);
		    		template_dish = template_dish.replace("[description]", arr_starters[i].description);
		    		template_dish = template_dish.replace("[cal]", arr_starters[i].calories);
		    		template_dish = template_dish.replace("[price]", arr_starters[i].price);

					//Show stars for rating
					var rating = parseInt(arr_starters[i].rating);
					if(rating <= 20){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_empty + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 40){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 60){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_empty + template_star_empty);
					}else if(rating <= 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_empty);
					}else if(rating > 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_full);
					}
		    		
		    		//Add clickListeners
		    		template_dish = template_dish.replace("[editDish]", "GUIBuilder.editDish(" + arr_starters[i].dish_id + ");");
		    		template_dish = template_dish.replace("[deleteDish]", "GUIBuilder.deleteDish(" + arr_starters[i].dish_id + ");");

		    		string_starters += template_dish;
		    	};

		    	//Main Courses string builder
		    	for (var i = 0; i < arr_main.length; i++) {
		    		//Check end of row
		    		if (i%3 == 0) {
		    			if (i != 0) {
		    				string_main += "</div>" + string_new_row;
		    			}
		    			
		    		}
		    		var template_dish = template.replace("[photo]", arr_main[i].Local == null ? arr_main[i].URL : arr_main[i].Local);
		    		template_dish = template_dish.replace("[name]", arr_main[i].name);
		    		template_dish = template_dish.replace("[name]", arr_main[i].name);
		    		template_dish = template_dish.replace("[description]", arr_main[i].description);
		    		template_dish = template_dish.replace("[cal]", arr_main[i].calories);
		    		template_dish = template_dish.replace("[price]", arr_main[i].price);

					//Show stars for rating
					var rating = parseInt(arr_main[i].rating);
					if(rating <= 20){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_empty + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 40){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 60){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_empty + template_star_empty);
					}else if(rating <= 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_empty);
					}else if(rating > 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_full);
					}

		    		//Add clickListeners
		    		template_dish = template_dish.replace("[editDish]", "GUIBuilder.editDish(" + arr_main[i].dish_id + ");");
		    		template_dish = template_dish.replace("[deleteDish]", "GUIBuilder.deleteDish(" + arr_main[i].dish_id + ");");

		    		string_main += template_dish;
		    	};

		    	//Desserts string builder
		    	for (var i = 0; i < arr_dessert.length; i++) {
		    		//Check end of row
		    		if (i%3 == 0) {
		    			if (i != 0) {
		    				string_dessert += "</div>" + string_new_row;
		    			}
		    		}
		    		var template_dish = template.replace("[photo]", arr_dessert[i].Local == null ? arr_dessert[i].URL : arr_dessert[i].Local);
		    		template_dish = template_dish.replace("[name]", arr_dessert[i].name);
		    		template_dish = template_dish.replace("[name]", arr_dessert[i].name);
		    		template_dish = template_dish.replace("[description]", arr_dessert[i].description);
		    		template_dish = template_dish.replace("[cal]", arr_dessert[i].calories);
		    		template_dish = template_dish.replace("[price]", arr_dessert[i].price);

					//Show stars for rating
					var rating = parseInt(arr_dessert[i].rating);
					if(rating <= 20){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_empty + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 40){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_empty + template_star_empty + template_star_empty);
					}else if(rating <= 60){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_empty + template_star_empty);
					}else if(rating <= 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_empty);
					}else if(rating > 80){
						template_dish = template_dish.replace("[rating]", template_star_full + template_star_full + template_star_full + template_star_full + template_star_full);
					}

		    		//Add clickListeners
		    		template_dish = template_dish.replace("[editDish]", "GUIBuilder.editDish(" + arr_dessert[i].dish_id + ");");
		    		template_dish = template_dish.replace("[deleteDish]", "GUIBuilder.deleteDish(" + arr_dessert[i].dish_id + ");");

		    		string_dessert += template_dish;
		    	};

		    	//End all rows
		    	string_starters += "</div>";
		    	string_main += "</div>";
		    	string_dessert += "</div>";

		    	//Put in correct holder
		    	//Add the starters
		    	voorGerechtHolder.append(string_starters);	
		    	console.log("Every dish for the starters have been added to the screen");	    	
		    	
		    	//Add the main courses
		    	hoofdGerechtHolder.append(string_main);
		    	console.log("Every dish for the main courses have been added to the screen");	    	

		    	//Add the desserts
		    	naGerechtHolder.append(string_dessert);
		    	console.log("Every dish for the desserts have been added to the screen");	    	

		    	//Verbose
		    	console.log("Every dish was added on the screen");
		    }
		});
	}

	/**
	*	Gets the data and fills in the previously 
	*	fetched data into the modal.
	*/
	function showEditModalByDishID(dish_id){
		//Get the selected Dish information from previously fetched JSON
		//No API call made here. :D
		var selectedDish = null; 
		var dishesFromStorage = $.parseJSON(localStorage["getDishesJSON"]);
		for (var i = 0; i < dishesFromStorage.length; i++) {
			if(dishesFromStorage[i].dish_id == dish_id){
				selectedDish = new Dish(dishesFromStorage[i].dish_id, dishesFromStorage[i].name);
				//Add extra properties
				selectedDish.URL = dishesFromStorage[i].URL;
				selectedDish.calories = dishesFromStorage[i].calories;
				selectedDish.description = dishesFromStorage[i].description;
				selectedDish.dish_cat_id = dishesFromStorage[i].disch_cat_id;
				selectedDish.fat = dishesFromStorage[i].dish_id;
				selectedDish.price = dishesFromStorage[i].price;
				selectedDish.protein = dishesFromStorage[i].protein;
				selectedDish.rating = dishesFromStorage[i].rating;
				selectedDish.sodium = dishesFromStorage[i].sodium;
				selectedDish.sugar = dishesFromStorage[i].sugar;
			}
		};

		//Get the Ingredients and the Categories
		$.ajax({
		    crossDomain:true,
		    type: "GET",
		    data: {
		        id: selectedDish.id
		    },
		    url: baseURL + "getIngredientsByDishID.php",
		    success: function(response){
		    	//JSON-ify
		    	var json_response = $.parseJSON(response);
		    	var arr_ingredients = [];
		    	for (var i = 0; i < json_response.length; i++) {
		    		var tmp_ingr = new Ingredient(json_response[i].ingredient_id, json_response[i].ingredient_name, json_response[i].amount);
		    		//Add extra properties
		    		tmp_ingr.fatAPI_id = json_response[i].fatAPI_id;
		    		arr_ingredients.push(tmp_ingr);
		    	};

		    	//Add the Ingredients to the selectedDish
		    	selectedDish.ingredients = arr_ingredients;
		    }
		});


		//Get the Categories
		$.ajax({
    		crossDomain: true,
    		type: "GET", 
    		data: {
    			id: selectedDish.id
    		},
    		url: baseURL + "getCategoriesByDishID.php",
    		success: function(response){
    			var json_response = $.parseJSON(response); 
    			var arr_categories = [];
    			for (var i = 0; i < json_response.length; i++) {
    				arr_categories.push(json_response[i]);
    			};

    			//Add the Categories to the selectedDish
    			selectedDish.categories = arr_categories;

    			//Set all the values to the addModal
    			gerechtNaam.val(selectedDish.food_name);
    			uitleg.val(selectedDish.description);
    			urlFoto.val(selectedDish.URL);
    			priceGerecht.val(selectedDish.price);

    			//Type
    			$(".radio input[value=" + selectedDish.dish_cat_id + "]").attr("checked", "checked");

    			//Categories
    			for (var i = 0; i < selectedDish.categories.length; i++) {
    				$("input[type='checkbox'][value='" + selectedDish.categories[i].cat_name_id + "']").attr('checked', 'checked');
    			};

    			//Ingredients
    			for (var i = 0; i < selectedDish.ingredients.length; i++) {
    				var template = "<a href='#' onclick='GUIBuilder.deleteIngredient(this)' data-amount='" + 
						selectedDish.ingredients[i].amount + 
						"' data-ingredient='" + 
						selectedDish.ingredients[i].fatAPI_id + 
						"' data-name='" + 
						selectedDish.ingredients[i].ingredient_name +
						"'><span style='margin:1%;' class='badge'><i class='glyphicon glyphicon-trash'></i> " + 
						selectedDish.ingredients[i].ingredient_name + " ("+ selectedDish.ingredients[i].amount  +" g)</span></a>"

					toegevoegdeIngredienten.append(template);    				
    			};

    			//Show the dialog
    			addModal.modal('show');

    			//Add the selectedDish to LocalStorage
    			localStorage['selectedDish'] = JSON.stringify(selectedDish);
    		}
    	});
	}

	return {
		/**
		*	Prepares all the views
		* 	Fetching, Binding Listeners
		*/
		init : function(){
			//Title
			brandName = getView(".navbar-brand");

			//Gerechten Holders
			voorGerechtHolder = getView("#voorgerechten");
			hoofdGerechtHolder = getView("#hoofdgerechten");
			naGerechtHolder = getView("#nagerechten");

			//Modal
			gerechtNaam = getView("#naamGerecht");
			uitleg = getView("#uitlegGerecht");
			hoeveelheid = getView("#hoeveelheid");
			ingredient_search = getView("#ingredient_search");
			ingredients_list = getView("#ingredients_list");
			toegevoegdeIngredienten = getView("#toegevoegdeIngredienten");
			urlFoto = getView("#urlFoto");
			ingredientToevoegenButton = getView(".col-sm-10 > .btn.btn-success");
			addModal = getView(".modal.fade.bs-example-modal-lg");
			progressBar = getView(".progress");
			priceGerecht = getView("#priceGerecht");

			//Set the Ingredients List hidden
			ingredients_list.hide();

			//ClickListeners
			$("button[data-toggle='modal']").click(function(){
				wipeModal();
			});

			//If there was a click on 'Ingrediënt toevoegen' make a dummy placeholder
			//containing the object
			ingredientToevoegenButton.click(function(){
				addIngredient();
			});

			//If there was a click on the modal the form should submit
			modalButton = getView(".modal-footer > .btn.btn-success");
			modalButton.click(function(){
				postAddDish();
			});

			ingredient_search.change(function(){
				console.log("Searching for: " + ingredient_search.val());
				displayIngredients();
			});
		},

		/**
		*	Fetches the recipes from the API
		*/
		showRecipes: function() {
			getDishesByTime();
			console.log('Getting the dishes from the server');
		},

		/**
		*	Deletes an icon showing an ingredient
		*	in the modal.
		*/
		deleteIngredient: function(clickedView){
			getView(clickedView).remove();
		},

		/**
		*	Shows the modal with the data that was 
		* 	filled in on the server user can update the values 
		*	and send back to the server		
		*/
		editDish : function(dish_id){
			showEditModalByDishID(dish_id);
		},

		/**
		*	Deletes the selected Dish
		* 	Confirmation Box?
		*/
		deleteDish : function(dish_id){
			if(window.confirm("Ben je zeker dat je dit wilt verwijderen uit je menu?")){
				postDeleteDish(dish_id);
			}
		}
	};   
})();

//When DOM is ready
$(function() {
	//Init (get all the views and bind click listeners)
	GUIBuilder.init();
	//Show all the dishes
	GUIBuilder.showRecipes();

	//Clear localStorage on start up
	localStorage.clear();

	//Create the webworker
	var worker = new Worker("js/messageServiceTask.js");
	//Attach EventListener
	worker.addEventListener('message', function(e){
		if (JSON.stringify(e.data) === localStorage["messageJSON"]) {
			console.log("Checked For New Messages.");
			return;
		}else{
			//Clean the message box
			alertBox.emptyHolder();

			//Save the fetched JSON
			localStorage["messageJSON"] = JSON.stringify(e.data);

			//Show the received message
			for (var i = 0; i < e.data.length; i++) {
				alertBox.addAlert(parseInt(e.data[i].class_id), e.data[i].title, e.data[i].message, e.data[i].message_id);
			};
		}
	}, false);
});