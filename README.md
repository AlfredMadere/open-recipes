

# Open Recipes

## Project Description


Open Recipes is a service for a meal planning and recipe management aimed primarily at college students and young adults. The service will allow users to manually enter recipes into their personal "cookbook" or add existing recipes from a public library. The user will be able "tag" recipes with anything they want, examples including "Allergy: Gluten" or "Appliance Needed: Air Fryer," which will allow filtering of public recipes based on user needs. We have a "feed" where users can see potential new recipes. You can log in as your user with an auth jwt token. A personal recipes page, more in depth viewing of recipes as a page, and recipe deletion will be available in the very near future. Additional future features like recipe rating, picture uploads, weekly planners, and recipe forking are planned for later versions. The service aims to solve the problem of meal planning and grocery shopping, making it easier and more efficient for people first living on their own to find meals to cook with their given inventories. While the MVP will focus on core functionalities, future iterations could include AI-enabled inventory management and a premium feature set.

### NOTES
This is a combination project for both csc 307 and csc 365. Only a 10 or fewer endpoints were are required for 365, the rest were created to support our frontend expo application developed in 307. The expo app does not yet use all the endoints available in the backend but if taken to MVP, should use most of them. 

## Contributing

Thank you for considering contributing to our project! We follow certain coding standards and guidelines to maintain code consistency and quality. Please follow our guidelines when making contributions.

### Contributors

**Frontend - csc307:**
Alfred Madere,
Abigayle Mercer,
Pau Minguet,
Michael Murray,
Kassi Winter

**Backend - csc365:**
Mihir Chintawar- mchintaw@calpoly.edu, 
Alfred Madere - amadere@calpoly.edu,
Molly Sandler - mosandle@calpoly.edu


### Coding Standards

We use Prettier and ESLint to maintain code formatting and ensure code quality.
To set up your development environment, follow these steps:

NOTE: you must run `npm run check` with no errors before merging to main. To fix formatting warnings you can run npx 

1. **Prettier**: Install Prettier in your code editor and set it as your default formatter to automatically format your code according to our style rules.

Our style guide follows standard Prettier formatting guidelines. See the [Prettier webpage](https://prettier.io/docs/en/why-prettier) for more information

2. **ESLint**: Install ESLint in your code editor to catch and fix code errors and enforce our coding standards. Make sure you npm install because ESLint will have been added to your node modules.

We adhere to the following ESLint standards for our code:
"eslint:recommended",
"plugin:react/recommended",
"plugin:@typescript-eslint/recommended"


## Development Environment Setup 

### For Mac users with Xcode

1. Inside of the `frontend` directory run `npm install`
2. Run `npm run ios`
3. Install the Expo Go app and make an account (https://expo.dev/client)
4. Scan the QR code in your terminal with your Iphone camera
5. Finished! you should now be able to see the app live update on your emulator and phone

### For non-Mac users or users without Xcode

1. Inside of the `frontend` directory run `npm install`
2. Run `npm start`
3. Install the Expo Go app and make an account (https://expo.dev/client)
4. Scan the QR code in your terminal with your Iphone camera (your phone and computer must be on the same wifi network for this to work, you must have your network configured for devices to be able to see the other devices on the network. School wifi will not work for this.)
5. Finished! you should now be able to see the app live update on your phone (you need Xcode which is only available on mac for the emulator to work)

NOTE about CI: You must run `npm run check` without errors before merging to main to pass CI tests run on github.

NOTE about CD: our backend is continuously deployed on render with every push. We were given permission not to deploy our front end as its very hard and costly to become a registered developer on the app store. Our backend takes a few minuites to wake up as the free tier of render spins down after a period of activity. Here's the link: https://open-recipes.onrender.com/docs

## Technical Specifications

### Backend Requirements
- **Public API**: The API will be publicly accessible, adhering to the project's open-source nature.
- **Persistence Layer**: A relational database will be used for data storage.
- **Read and Write Operations**: The API will support CRUD operations for recipes, shopping lists, and user profiles.

### Features for MVP
1. **User Authentication**: Secure login and registration.
2. **Recipes**: Users can create, edit, and delete recipes.
3. **Recipe Lists**: Users can create, edit, and delete recipe lists.
5. **Public Recipe Library**: Users have read-only access to a collection of public recipes.
6. **Feed and Search**: Users can browse their feed or search for recipes stored in the database.
7. **Profile**: Users can view their account information and pinned recipes from their profile page.
   
### Future Features
- Weekly planner to enable users to plan for the week and generate a shopping list
- Ability to add images to your own recipes and rate others' recipes
- AI-enabled "Fridge" feature for inventory management.
- Average prep time and cost of ingredients.
- Reviews and ratings of all recipes. 
- Recipe scaling based on the number of people.
- Premium features for paying customers.

## UI Prototype
See the initial Figma prototype [here](https://www.figma.com/file/Rjw4vkBVjuUWTl80Z0OY7t/Mobile-App-Wire-Frame?type=design&node-id=0%3A1&mode=design&t=m4IlCNr30s8LjF4p-1)

Last Updated: 11/03/2023

## Diagrams
See our UML diagram [here](https://github.com/AlfredMadere/open-recipes/wiki/)

Last Updated: 11/02/2023

