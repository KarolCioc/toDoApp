export default{
  "expo": {
    "name": "WhaleNotes",
    "slug": "WhaleNotes",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.filipszemraj.WhaleNotes",
      "config": {
        "googleMapsApiKey": "AIzaSyD-yTkgQxD_JBHUkRMf6hZPky4-7PGADnU"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "googleServicesFile": "./google-services.json",
      "package": "com.filipszemraj.WhaleNotes",
      "config":{
        "googleMaps": {
          "apiKey": "AIzaSyCTbEKg24sOomIrjN4vqp7kZtPqSoTTm_o"
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "958bb1e8-1d72-45c2-89a4-32b3d60e601f"
      }
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
        }
      ],
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/crashlytics",
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ]
    ]
  }
}
