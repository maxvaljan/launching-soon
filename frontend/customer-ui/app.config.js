module.exports = {
  expo: {
    name: 'MaxMove Customer',
    slug: 'maxmove-customer',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'maxmovecustomer',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    jsEngine: 'hermes',
    ios: {
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      bundleIdentifier: 'com.maxva.maxmovecustomer',
      jsEngine: 'hermes',
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      // "react-native-webview" // Temporarily remove plugin causing config issues
    ],
    experiments: {
      typedRoutes: true,
    },
    android: {
      package: 'com.maxva.maxmovecustomer',
      permissions: ['android.permission.INTERNET'],
      jsEngine: 'hermes',
    },
    extra: {
      apiUrl:
        process.env.EXPO_PUBLIC_API_URL ||
        'https://launching-soon-production.up.railway.app/api',
      supabaseUrl:
        process.env.EXPO_PUBLIC_SUPABASE_URL ||
        'https://xuehdmslktlsgpoexilo.supabase.co',
      supabaseAnonKey: 
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1ZWhkbXNsa3Rsc2dwb2V4aWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ3MjA4ODIsImV4cCI6MjAyMDI5Njg4Mn0.jEBkLbuU9bv4g__Jl5O5e_8rASNKJM5FNz-aceRvP1I',
      storageVehiclesBucket: 'vehicles',
      useDirectSupabase: true,
      router: {
        origin: false,
      },
      eas: {
        projectId: '211ed2f4-3294-484b-a963-b09eb16135db',
      },
    },
  },
};
