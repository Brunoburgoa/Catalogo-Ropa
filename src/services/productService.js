import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { app } from "../firebase/firebaseConfig";

const db = getFirestore(app);

const productsCollection = collection(db, "products");

export async function getProducts() {
  const snapshot = await getDocs(productsCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
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
    ...snapshot.data(),
  };
}

export async function createProduct(productData) {
  const product = {
    nombre: productData.nombre,
    precio: Number(productData.precio),
    talle: productData.talle,
    categoria: productData.categoria,
    epoca: productData.epoca,
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

  const updatedProduct = {
    nombre: productData.nombre,
    precio: Number(productData.precio),
    talle: productData.talle,
    categoria: productData.categoria,
    epoca: productData.epoca,
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