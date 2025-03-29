module.exports = {
  expo: {
    name: "MaxMove Customer",
    slug: "maxmove-customer",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "maxmoveapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: false,
    jsEngine: "hermes",
    ios: {
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      },
      bundleIdentifier: "y",
      jsEngine: "hermes"
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "react-native-webview"
    ],
    experiments: {
      typedRoutes: true
    },
    android: {
      package: "com.maxva.maxmovecustomer",
      permissions: [
        "android.permission.INTERNET"
      ],
      jsEngine: "hermes"
    },
    extra: {
      apiUrl: process.env.EXPO_PUBLIC_API_URL || "https://launching-soon-production.up.railway.app/api",
      router: {
        origin: false
      },
      eas: {
        projectId: "211ed2f4-3294-484b-a963-b09eb16135db"
      }
    }
  }
}; 