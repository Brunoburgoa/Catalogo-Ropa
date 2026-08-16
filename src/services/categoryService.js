import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { app } from "../firebase/firebaseConfig";

const db = getFirestore(app);

const categoriesCollection = collection(db, "categories");

export async function getCategories() {
  const snapshot = await getDocs(categoriesCollection);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    );
}

export async function createCategory(nombre) {
  const category = {
    nombre: nombre.trim(),
    fechaCreacion: serverTimestamp(),
  };

  const document = await addDoc(
    categoriesCollection,
    category,
  );

  return document.id;
}

export async function deleteCategory(
  categoryId,
  categoryName,
) {
  const productsQuery = query(
    collection(db, "products"),
    where("categoria", "==", categoryName),
  );

  const productsSnapshot = await getDocs(
    productsQuery,
  );

  if (!productsSnapshot.empty) {
    throw new Error(
      "No se puede eliminar una categoría que está siendo utilizada por un producto.",
    );
  }

  const categoryRef = doc(
    db,
    "categories",
    categoryId,
  );

  await deleteDoc(categoryRef);
}