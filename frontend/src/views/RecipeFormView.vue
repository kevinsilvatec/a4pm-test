<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        {{ isEditing ? 'Editar Receita' : 'Nova Receita' }}
      </h1>

      <form class="card space-y-6" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="nome" class="label">Nome</label>
          <input
            id="nome"
            v-model="form.nome"
            type="text"
            required
            class="input"
          />
        </div>

        <div class="form-group">
          <label for="categoria" class="label">Categoria</label>
          <select
            id="categoria"
            v-model="form.id_categorias"
            class="input"
          >
            <option value="">Selecione uma categoria</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.nome }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label for="tempo_preparo" class="label">Tempo de preparo (minutos)</label>
            <input
              id="tempo_preparo"
              v-model.number="form.tempo_preparo_minutos"
              type="number"
              min="1"
              class="input"
            />
          </div>

          <div class="form-group">
            <label for="porcoes" class="label">Porções</label>
            <input
              id="porcoes"
              v-model.number="form.porcoes"
              type="number"
              min="1"
              class="input"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="ingredientes" class="label">Ingredientes</label>
          <textarea
            id="ingredientes"
            v-model="form.ingredientes"
            rows="5"
            class="input"
            placeholder="Digite cada ingrediente em uma nova linha"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="modo_preparo" class="label">Modo de Preparo</label>
          <textarea
            id="modo_preparo"
            v-model="form.modo_preparo"
            rows="8"
            required
            class="input"
            placeholder="Digite os passos do preparo"
          ></textarea>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="flex justify-end space-x-4">
          <router-link to="/recipes" class="btn btn-secondary">
            Cancelar
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Receita' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRecipeStore } from '@/stores/recipe';
import { useCategoryStore } from '@/stores/category';
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const recipeStore = useRecipeStore();
const categoryStore = useCategoryStore();

const { currentRecipe } = storeToRefs(recipeStore);
const { categories } = storeToRefs(categoryStore);

const isEditing = computed(() => route.params.id !== undefined);
const loading = ref(false);
const error = ref('');

const form = reactive({
  nome: '',
  id_categorias: null as number | null,
  tempo_preparo_minutos: null as number | null,
  porcoes: null as number | null,
  ingredientes: '',
  modo_preparo: ''
});

onMounted(async () => {
  await categoryStore.fetchCategories();

  if (isEditing.value) {
    const id = parseInt(route.params.id as string);
    await recipeStore.fetchRecipeById(id);
    
    if (currentRecipe.value) {
      form.nome = currentRecipe.value.nome;
      form.id_categorias = currentRecipe.value.id_categorias;
      form.tempo_preparo_minutos = currentRecipe.value.tempo_preparo_minutos;
      form.porcoes = currentRecipe.value.porcoes;
      form.ingredientes = currentRecipe.value.ingredientes || '';
      form.modo_preparo = currentRecipe.value.modo_preparo;
    }
  }
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isEditing.value) {
      const id = parseInt(route.params.id as string);
      await recipeStore.updateRecipe(id, form);
    } else {
      await recipeStore.createRecipe(form);
    }
    router.push('/recipes');
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Falha ao salvar receita';
  } finally {
    loading.value = false;
  }
};
</script> 