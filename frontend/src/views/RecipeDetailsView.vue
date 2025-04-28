<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="text-gray-600">Carregando receita...</div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <div class="error-message">{{ error }}</div>
    </div>

    <div v-else-if="currentRecipe" class="max-w-3xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">{{ currentRecipe.nome }}</h1>
        <div class="flex space-x-4">
          <router-link
            :to="`/recipes/${currentRecipe.id}/edit`"
            class="btn btn-secondary"
          >
            Editar
          </router-link>
          <button @click="handlePrint" class="btn btn-primary">Imprimir</button>
        </div>
      </div>

      <div class="card space-y-6">
        <div v-if="currentRecipe.categoria" class="text-gray-600">
          <span class="font-semibold">Categoria:</span>
          {{ currentRecipe.categoria.nome }}
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-if="currentRecipe.tempo_preparo_minutos" class="text-gray-600">
            <span class="font-semibold">Tempo de preparo:</span>
            {{ currentRecipe.tempo_preparo_minutos }} minutos
          </div>
          <div v-if="currentRecipe.porcoes" class="text-gray-600">
            <span class="font-semibold">Porções:</span>
            {{ currentRecipe.porcoes }}
          </div>
        </div>

        <div v-if="currentRecipe.ingredientes">
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Ingredientes</h2>
          <div class="text-gray-600 whitespace-pre-line">
            {{ currentRecipe.ingredientes }}
          </div>
        </div>

        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Modo de Preparo
          </h2>
          <div class="text-gray-600 whitespace-pre-line">
            {{ currentRecipe.modo_preparo }}
          </div>
        </div>

        <div class="text-gray-500 text-sm">
          <div>Criado em: {{ new Date(currentRecipe.criado_em).toLocaleString() }}</div>
          <div>Última atualização: {{ new Date(currentRecipe.alterado_em).toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRecipeStore } from '@/stores/recipe';
import { storeToRefs } from 'pinia';

const route = useRoute();
const recipeStore = useRecipeStore();
const { currentRecipe, loading, error } = storeToRefs(recipeStore);

onMounted(() => {
  const id = parseInt(route.params.id as string);
  recipeStore.fetchRecipeById(id);
});

const handlePrint = () => {
  window.print();
};
</script>

<style>
@media print {
  .btn {
    display: none;
  }
}
</style> 