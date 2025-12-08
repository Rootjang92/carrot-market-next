async function getProducts() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
}

export default async function Chat() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-white text-4xl">Products!</h1>
    </div>
  );
}
