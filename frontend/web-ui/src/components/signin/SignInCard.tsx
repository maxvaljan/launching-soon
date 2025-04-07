<div className="relative min-h-screen flex items-center justify-center bg-maxmove-creme overflow-hidden">
  {/* Blurred background image */}
  <div className="absolute inset-0 z-0 opacity-30">
    <Image
      src="https://whadz2ols6ge6eli.public.blob.vercel-storage.com/MAXMOVE-9.png"
      alt="MaxMove Background"
      layout="fill"
      objectFit="cover"
      className="blur-md"
      priority
    />
  </div>

  {/* Login Card */}
  <div className="z-10 bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
    <h1 className="text-2xl font-bold text-maxmove-navy">Welcome back</h1>
    <p className="text-sm text-maxmove-navy/70 mb-6">Sign in to your MaxMove account</p>

    <SignInForm />

    <p className="text-sm text-maxmove-navy/60 hover:underline cursor-pointer mt-2">
      Forgot your password?
    </p>

    <div className="relative my-6">
      <div className="absolute inset-0 border-t border-gray-300 top-1/2 z-0" />
      <span className="relative z-10 px-2 bg-white text-gray-500 text-sm">Or</span>
    </div>

    <GoogleSignInButton />

    <div className="text-sm mt-6 text-maxmove-navy/70">
      Don’t have an account?
      <Button
        onClick={() => router.push('/account-type')}
        className="w-full mt-2 bg-maxmove-navy hover:bg-maxmove-navy/90 text-white font-semibold"
      >
        Create an Account
      </Button>
    </div>

    <p className="text-xs text-gray-400 mt-6">
      By clicking continue, you agree to our{" "}
      <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" "}
      and{" "}
      <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>.
    </p>
  </div>
</div>
