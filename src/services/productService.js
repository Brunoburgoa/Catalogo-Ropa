import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { app } from "../firebase/firebaseConfig";
import { isClothingCategory } from "../utils/category";

const db = getFirestore(app);

const productsCollection = collection(db, "products");

function normalizeProduct(product) {
  return {
    ...product,
    categoriaId: product.categoriaId || "",
    subcategoriaId: product.subcategoriaId || "",
    subcategoria: product.subcategoria || "",
    temporada: product.temporada || product.epoca || "",
    condicion:
      product.condicion === "Como nueva"
        ? "Excelente estado"
        : product.condicion,
  };
}

export async function getProducts() {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((productDocument) => ({
    id: productDocument.id,
    ...normalizeProduct(productDocument.data()),
  }));
}

export async function getProductById(id) {
  const productRef = doc(db, "products", id);
  const snapshot = await getDoc(productRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...normalizeProduct(snapshot.data()),
  };
}

export async function createProduct(productData) {
  const hasSeason = isClothingCategory(productData.categoria);
  const product = {
    nombre: productData.nombre,
    precio: Number(productData.precio),
    categoriaId: productData.categoriaId,
    categoria: productData.categoria,
    subcategoriaId: productData.subcategoriaId,
    subcategoria: productData.subcategoria,
    ...(hasSeason
      ? { temporada: productData.temporada }
      : {}),
    condicion: productData.condicion,
    estado: productData.estado,
    descripcion: productData.descripcion,
    imagenes: productData.imagenes || [],
    visible: true,
    fechaCreacion: serverTimestamp(),
    fechaActualizacion: serverTimestamp(),
  };

  const document = await addDoc(productsCollection, product);

  return document.id;
}

export async function updateProduct(id, productData) {
  const productRef = doc(db, "products", id);
  const hasSeason = isClothingCategory(productData.categoria);

  const updatedProduct = {
    nombre: productData.nombre,
    precio: Number(productData.precio),
    categoriaId: productData.categoriaId,
    categoria: productData.categoria,
    talle: deleteField(),
    epoca: deleteField(),
    subcategoriaId: productData.subcategoriaId,
    subcategoria: productData.subcategoria,
    temporada: hasSeason
      ? productData.temporada
      : deleteField(),
    condicion: productData.condicion,
    estado: productData.estado,
    descripcion: productData.descripcion,
    visible: productData.visible,
    imagenes: productData.imagenes || [],
    fechaActualizacion: serverTimestamp(),
  };

  await updateDoc(productRef, updatedProduct);
}

export async function deleteProduct(id) {
  const productRef = doc(db, "products", id);

  await deleteDoc(productRef);
}
