import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useSearchStore = defineStore('cart', () => {
  const categoryId = ref();

  function updateCategoryId(categoryId) {
    this.categoryId = categoryId
  }

  return { categoryId, updateCategoryId }
})
