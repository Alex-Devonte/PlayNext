function PageNotFound() {
  return (
    <div className="bg-dark mb-[-100px] flex h-screen flex-col items-center justify-center p-4">
      <h1 className="text-accent text-9xl font-bold">404</h1>
      <p className="text-light mt-4 text-center text-2xl">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="bg-accent text-dark active:bg-primary active:text-light hover:bg-primary hover:text-light active: mt-16 rounded-3xl p-3 text-lg font-bold duration-150 ease-in"
      >
        Go back to Home
      </a>
    </div>
  );
}
export default PageNotFound;
