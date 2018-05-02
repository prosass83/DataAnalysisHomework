USE sakila;
-- 1a. Display the first and last names of all actors from the table actor.
SELECT first_name, last_name FROM actor;

-- 1b. Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.-- 
SELECT CONCAT(first_name, ' ', last_name) AS 'Actor Name' FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." What is one query would you use to obtain this information?SELECT actor_id, first_name, last_name FROM actor WHERE first_name = 'JOE';

-- 2b. Find all actors whose last name contain the letters GEN:
SELECT actor_id, first_name, last_name FROM actor 
WHERE last_name LIKE '%GEN%';


-- 2c. Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:

SELECT actor_id, first_name, last_name FROM actor 
WHERE last_name LIKE '%LI%' ORDER BY last_name, first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China:
SELECT country_id, country FROM country WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a. Add a middle_name column to the table actor. Position it between first_name and last_name. Hint: you will need to specify the data type.
ALTER TABLE actor ADD COLUMN middle_name VARCHAR(30) AFTER first_name;

-- 3b. You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor MODIFY middle_name BLOB;

-- 3c. Now delete the middle_name column.
ALTER TABLE actor DROP COLUMN middle_name;

-- List the last names of actors, as well as how many actors have that last name.

SELECT last_name, COUNT(last_name) 
FROM actor
WHERE last_name = ANY (
SELECT last_name FROM actor
)
GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors
SELECT last_name, COUNT(last_name) 
FROM actor
WHERE last_name = ANY (
SELECT last_name FROM actor
) 
GROUP BY last_name HAVING COUNT(last_name) > 1;

-- 4c. Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
SELECT first_name, last_name FROM actor WHERE first_name = 'GROUCHO' AND last_name = 'WILLIAMS';
UPDATE actor 
SET first_name = REPLACE(first_name, 'GROUCHO', 'HARPO')
WHERE last_name = 'WILLIAMS';
SELECT first_name, last_name FROM actor WHERE first_name = 'HARPO' AND last_name = 'WILLIAMS';

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that GROUCHO was the correct name after all! In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO, as that is exactly what the actor will be with the grievous error. BE CAREFUL NOT TO CHANGE THE FIRST NAME OF EVERY ACTOR TO MUCHO GROUCHO, HOWEVER! (Hint: update the record using a unique identifier.)
UPDATE actor
SET first_name= CASE
   WHEN first_name = 'GROUCHO' THEN REPLACE(first_name, 'GROUCHO', 'MUCHO GROUCHO')
   WHEN first_name = 'HARPO' THEN REPLACE(first_name, 'HARPO', 'GROUCHO')
   ELSE first_name
END
WHERE last_name = 'WILLIAMS';

SELECT first_name, last_name FROM actor WHERE last_name = 'WILLIAMS';

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT staff.first_name, staff.last_name, address.address
FROM staff
INNER JOIN address ON
staff.address_id=address.address_id;

-- Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT staff.first_name, staff.last_name, payment.amount, payment.payment_date
FROM staff
INNER JOIN payment ON
staff.staff_id=payment.staff_id
WHERE payment.payment_date LIKE '%2005-08%';

SELECT staff.first_name, staff.last_name, SUM(payment.amount)
FROM staff
INNER JOIN payment ON
staff.staff_id=payment.staff_id
WHERE payment.payment_date LIKE '%2005-08%'
GROUP BY staff.first_name, staff.last_name;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT film.title, COUNT(actor_id)
FROM film
INNER JOIN film_actor ON
film_actor.film_id = film.film_id
GROUP BY film.title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT film.title, COUNT(inventory.film_id)
FROM film
INNER JOIN inventory ON
inventory.film_id = film.film_id
WHERE film.title = 'HUNCHBACK IMPOSSIBLE' 
GROUP BY film.title;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT customer.first_name, customer.last_name, SUM(payment.amount)
FROM customer
INNER JOIN payment ON
customer.customer_id=payment.customer_id
GROUP BY customer.first_name, customer.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. As an unintended consequence, films starting with the letters K and Q have also soared in popularity. Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT film.title FROM film WHERE language_id = 1 AND (film.title LIKE 'K%' OR film.title LIKE 'Q%');

-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.
SELECT last_name, first_name  
FROM actor
SELECT actor_id FROM film_actor WHERE film_id = ANY (SELECT film_id FROM film WHERE film.title = 'ALONE TRIP')) 
ORDER BY last_name, first_name;

-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. Use joins to retrieve this information.
-- I'm doing this with subqueries, since I do not believe JOINS are the best solution here
SELECT * from customer;
SELECT customer.last_name, customer.first_name, customer.email FROM customer
WHERE address_id = ANY (SELECT address_id FROM address WHERE city_id = ANY (SELECT city_id FROM city WHERE country_id = ANY (SELECT country_id FROM country WHERE country = 'CANADA')));

-- 7d. Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.
SELECT * from category;
SELECT title from film WHERE film_id = ANY (SELECT film_id FROM film_category WHERE category_id = ANY (SELECT category_id FROM category WHERE name = 'Family'));

-- 7e. Display the most frequently rented movies in descending order.
SELECT film.title, COUNT(rental.rental_id)
FROM film
INNER JOIN inventory ON
inventory.film_id = film.film_id
INNER JOIN rental ON
inventory.inventory_id = rental.inventory_id
GROUP BY film.title ORDER BY 2 DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT staff.store_id, SUM(payment.amount)
FROM payment
INNER JOIN staff ON
staff.staff_id = payment.staff_id
GROUP BY staff.store_id ORDER BY 2 DESC;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT store_id, city.city, country.country 
FROM store
INNER JOIN address ON
store.address_id=address.address_id
INNER JOIN city ON
address.city_id=city.city_id
INNER JOIN country ON
city.country_id=country.country_id
GROUP BY store.store_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may need to use the following tables: category, film_category, inventory, payment, and rental.)
SELECT category.name, SUM(payment.amount)
FROM payment 
INNER JOIN rental ON
rental.rental_id=payment.rental_id
INNER JOIN inventory ON
rental.inventory_id=inventory.inventory_id
INNER JOIN film_category ON
film_category.film_id=inventory.film_id
INNER JOIN category ON
film_category.category_id=category.category_id
GROUP BY category.name ORDER BY 2 DESC LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing the Top five genres by gross revenue. Use the solution from the problem above to create a view. If you haven't solved 7h, you can substitute another query to create a view.
CREATE VIEW TOP5_GENRE (GENRE, AMOUNT) AS
SELECT category.name, SUM(payment.amount)
FROM payment 
INNER JOIN rental ON
rental.rental_id=payment.rental_id
INNER JOIN inventory ON
rental.inventory_id=inventory.inventory_id
INNER JOIN film_category ON
film_category.film_id=inventory.film_id
INNER JOIN category ON
film_category.category_id=category.category_id
GROUP BY category.name ORDER BY 2 DESC LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
SELECT * FROM TOP5_GENRE;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW TOP5_GENRE;
