##Quick start instructions - FOR MAC USERS WITH XCODE
1. Inside of the `frontend` directory run `npm install`
2. Run `npm run ios`
3. Install the Expo Go app and make an account (https://expo.dev/client)
4. Scan the QR code in your terminal with your Iphone camera
5. Finished! you should now be able to see the app live update on your emulator and phone

##Quick start instructions - FOR NON MAC USERS OR USERS WITHOUT XCODE
1. Inside of the `frontend` directory run `npm install`
2. Run `npm start`
3. Install the Expo Go app and make an account (https://expo.dev/client)
4. Scan the QR code in your terminal with your Iphone camera (your phone and computer must be on the same wifi network for this to work, you must have your network configured for devices to be able to see the other devices on the network. School wifi will not work for this.)
5. Finished! you should now be able to see the app live update on your phone (you need Xcode which is only available on mac for the emulator to work)



## Documentation reference
Tamagui (component library): https://tamagui.dev/docs/components/button/1.28.0

Expo (framework for managing react-native development): https://docs.expo.dev/

React Native: https://reactnative.dev/docs/getting-started

## Contributing

Thank you for considering contributing to our project! We follow certain coding standards and guidelines to maintain code consistency and quality. Please follow these guidelines when making contributions.

### Coding Standards

We use Prettier and ESLint to maintain code formatting and ensure code quality.
To set up your development environment, follow these steps:

1. **Prettier**: Install Prettier in your code editor and set it as your default formatter to automatically format your code according to our style rules.

Our style guide follows standard Prettier formatting guidelines. See https://prettier.io/docs/en/why-prettier for more information

2. **ESLint**: Install ESLint in your code editor to catch and fix code errors and enforce our coding standards. Make sure you npm install because ESLint will have been added to your node modules.

We adhere to the following ESLint standards for our code:
  "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"