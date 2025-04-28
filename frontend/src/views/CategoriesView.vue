<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Categorias</h1>

      <div v-if="loading" class="text-center py-8">
        <div class="text-gray-600">Carregando categorias...</div>
      </div>

      <div v-else-if="error" class="text-center py-8">
        <div class="error-message">{{ error }}</div>
      </div>

      <div v-else>
        <form @submit.prevent="handleSubmit" class="card mb-8">
          <div class="flex space-x-4">
            <div class="flex-grow">
              <label for="nome" class="label">Nova Categoria</label>
              <input
                id="nome"
                v-model="newCategory"
                type="text"
                required
                class="input"
                placeholder="Digite o nome da categoria"
              />
            </div>
            <div class="flex items-end">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                Adicionar Categoria
              </button>
            </div>
          </div>
        </form>

        <div class="card">
          <div v-if="categories.length === 0" class="text-center py-4">
            <div class="text-gray-600">Nenhuma categoria encontrada</div>
          </div>

          <div v-else class="divide-y">
            <div
              v-for="category in categories"
              :key="category.id"
              class="py-4 first:pt-0 last:pb-0"
            >
              <div v-if="editingId === category.id">
                <form @submit.prevent="handleUpdate(category.id)" class="flex space-x-4">
                  <input
                    v-model="editingName"
                    type="text"
                    required
                    class="input flex-grow"
                  />
                  <div class="flex space-x-2">
                    <button type="submit" class="btn btn-primary">Salvar</button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="cancelEdit"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
              <div v-else class="flex justify-between items-center">
                <span class="text-gray-900">{{ category.nome }}</span>
                <div class="flex space-x-2">
                  <button
                    @click="startEdit(category)"
                    class="text-blue-600 hover:text-blue-500"
                  >
                    Editar
                  </button>
                  <button
                    @click="handleDelete(category.id)"
                    class="text-red-600 hover:text-red-500"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';

const categoryStore = useCategoryStore();
const { categories, loading, error } = storeToRefs(categoryStore);

const newCategory = ref('');
const editingId = ref<number | null>(null);
const editingName = ref('');

onMounted(() => {
  categoryStore.fetchCategories();
});

const handleSubmit = async () => {
  try {
    await categoryStore.createCategory(newCategory.value);
    newCategory.value = '';
  } catch (e: any) {
    alert(e.response?.data?.error || 'Falha ao criar categoria');
  }
};

const startEdit = (category: { id: number; nome: string }) => {
  editingId.value = category.id;
  editingName.value = category.nome;
};

const cancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

const handleUpdate = async (id: number) => {
  try {
    await categoryStore.updateCategory(id, editingName.value);
    cancelEdit();
  } catch (e: any) {
    alert(e.response?.data?.error || 'Falha ao atualizar categoria');
  }
};

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir esta categoria?')) {
    try {
      await categoryStore.deleteCategory(id);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Falha ao excluir categoria');
    }
  }
};
</script> 