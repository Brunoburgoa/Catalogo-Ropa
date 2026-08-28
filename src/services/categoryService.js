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
      categoriaPadre: "",
      ...doc.data(),
    }))
    .sort((a, b) =>
      a.nombre.localeCompare(b.nombre, "es"),
    );
}

export async function createCategory(
  nombre,
  categoriaPadre = "",
) {
  const category = {
    nombre: nombre.trim(),
    categoriaPadre,
    fechaCreacion: serverTimestamp(),
  };

  const document = await addDoc(
    categoriesCollection,
    category,
  );

  return document.id;
}

export async function deleteCategory(
  category,
) {
  const childCategoriesQuery = query(
    categoriesCollection,
    where("categoriaPadre", "==", category.id),
  );

  const childCategoriesSnapshot = await getDocs(
    childCategoriesQuery,
  );

  if (!childCategoriesSnapshot.empty) {
    throw new Error(
      "No se puede eliminar una categoría principal que todavía tiene subcategorías.",
    );
  }

  const productsCollection = collection(db, "products");
  const usageQueries = category.categoriaPadre
    ? [
        query(
          productsCollection,
          where("subcategoriaId", "==", category.id),
        ),
      ]
    : [
        query(
          productsCollection,
          where("categoriaId", "==", category.id),
        ),
        query(
          productsCollection,
          where("categoria", "==", category.nombre),
        ),
      ];

  const usageSnapshots = await Promise.all(
    usageQueries.map((productsQuery) =>
      getDocs(productsQuery),
    ),
  );

  if (usageSnapshots.some((snapshot) => !snapshot.empty)) {
    throw new Error(
      "No se puede eliminar una categoría que está siendo utilizada por un producto.",
    );
  }

  const categoryRef = doc(
    db,
    "categories",
    category.id,
  );

  await deleteDoc(categoryRef);
}
