import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "@/src/lib/firebase/firebase";

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore";

// Replace the two functions below
export async function updateRestaurantImage(restaurantId, image) {}

async function uploadImage(restaurantId, image) {}
// Replace the two functions above
