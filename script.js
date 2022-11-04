const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');

//search meal by fetching from API
function searchMeal(e) {
    e.preventDefault(); //to not actually submit the search keyword to a file

    single_mealEl.innerHTML = '';

    const term = search.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                resultHeading.innerHTML = `<p>Search results for '${term}':</p>`;

                if (data.meals === null) {
                    resultHeading.innerHTML = `<p>There are no search results. Try different keyword!</p>`;
                    mealsEl.innerHTML = '';
                } else {
                    mealsEl.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                            <div class="meal-info" data-meal_id="${meal.idMeal}">
                                <h3>${meal.strMeal}</h3>
                            </div>
                        </div>
                    `)
                        .join(''); //convert back the array to string
                }
            });

        //clear search bar after searching a term
        search.value = '';
    } else {
        alert("Please enter a search term :)");
    }
}

//Fetch meal by ID
function getMealByID(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

//Fetch random meal from API
function getRandomMeal() {
    //clear meals and heading
    resultHeading.innerHTML = '';
    mealsEl.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then(response => response.json())
        .then(data => {
            // console.log(data)
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
}

function addMealToDOM(meal) {
    const ingredients = [];

    //filling ingredients array with the ingredient and it's measure data fetched from API
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else {
            break;
        }
    }

    single_mealEl.innerHTML = `
        <div class="single-meal">
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

            <div class="single-meal-info">
                ${meal.strCategory ? `<p><b>Category:</b> ${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p><b>Area:</b> ${meal.strArea}</p>` : ''}
            </div>

            <div class="main">
                <h3>Ingredients</h3>
                <ul>
                    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>

                <h3>Method</h3>
                <p class="instructions">${meal.strInstructions}</p>
            </div>
        </div>
    `;
}

//Event Listeners
submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
    const mealInfoEl = e.path.find(element => {
        if (element.classList) {
            return element.classList.contains('meal-info')
        }
        else {
            return false;
        }
    });
    // console.log(mealInfoEl)

    const mealID = mealInfoEl.getAttribute('data-meal_id');
    getMealByID(mealID);
});

//shows a random meal on the home
getRandomMeal();