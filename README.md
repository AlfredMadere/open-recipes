

# Open Recipes

## Project Description

Open Recipes is a service for meal planning and recipe management aimed primarily at college students and young adults. The service allows users to create their own recipes or search for others' recipes using the search feature. The app also allows for the creation of recipe lists, which can group recipes together, e.g. "Breakfast". Users can view account information and pinned recipes from the 'profile' page. Finally, on the 'feed' page, popular and relevant recipes from the community are displayed for browsing!


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
- Recipe scaling based on the number of people.
- Premium features for paying customers.

## UI Prototype
See the initial Figma prototype [here](https://www.figma.com/file/Rjw4vkBVjuUWTl80Z0OY7t/Mobile-App-Wire-Frame?type=design&node-id=0%3A1&mode=design&t=m4IlCNr30s8LjF4p-1)

Last Updated: 11/03/2023

## Diagrams
See our UML diagram [here](https://github.com/AlfredMadere/open-recipes/wiki/)

Last Updated: 11/02/2023

