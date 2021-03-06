const products = [{id: 1, title: "tomato"}, {id: 2, title: "orange"}];

export const productsRepository = {
  findProducts(title: string | null | undefined) {
    if (title) {
      const filteredProducts = products.filter(product => product.title.includes(title));
      return filteredProducts;
    } else {
      return products;
    }
  },
  createProduct(title: string) {
    const newProduct = {id: +(new Date()), title: title};
    products.push(newProduct);
    return newProduct;
  },
  findProductById(id: number) {
    return products.find(product => product.id === id);
  },
  updateProduct(id: number, title: string) {
    let product = products.find(product => product.id === id);
    if (product) {
      product.title = title;
      return true
    } else {
      return false;
    }
  },
  deleteProduct(id: number) {
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        products.splice(i, 1);
        return true
      }
    }
    return false;
  }
}