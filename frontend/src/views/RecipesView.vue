<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Minhas Receitas</h1>
      <router-link to="/recipes/new" class="btn btn-primary">
        Adicionar Receita
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Carregando receitas...</div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="error-message">{{ error }}</div>
    </div>

    <div v-else-if="recipes.length === 0" class="text-center py-8">
      <div class="text-gray-600">Nenhuma receita encontrada. Crie sua primeira receita!</div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="recipe in recipes" :key="recipe.id" class="card">
        <div class="flex justify-between items-start">
          <h2 class="text-xl font-semibold text-gray-900">{{ recipe.nome }}</h2>
          <div class="flex space-x-2">
            <router-link
              :to="`/recipes/${recipe.id}/edit`"
              class="text-blue-600 hover:text-blue-500"
            >
              Editar
            </router-link>
            <button
              @click="handleDelete(recipe.id)"
              class="text-red-600 hover:text-red-500"
            >
              Excluir
            </button>
          </div>
        </div>

        <div class="mt-2 text-gray-600">
          <div v-if="recipe.categoria">
            Categoria: {{ recipe.categoria.nome }}
          </div>
          <div v-if="recipe.tempo_preparo_minutos">
            Tempo de preparo: {{ recipe.tempo_preparo_minutos }} minutos
          </div>
          <div v-if="recipe.porcoes">
            Porções: {{ recipe.porcoes }}
          </div>
        </div>

        <div class="mt-4">
          <router-link
            :to="`/recipes/${recipe.id}`"
            class="text-blue-600 hover:text-blue-500"
          >
            Ver detalhes
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRecipeStore } from '@/stores/recipe';
import { storeToRefs } from 'pinia';

const recipeStore = useRecipeStore();
const { recipes, loading, error } = storeToRefs(recipeStore);

onMounted(() => {
  recipeStore.fetchRecipes();
});

const handleDelete = async (id: number) => {
  if (confirm('Tem certeza que deseja excluir esta receita?')) {
    try {
      await recipeStore.deleteRecipe(id);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Falha ao excluir receita');
    }
  }
};
</script> 