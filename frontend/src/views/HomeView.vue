<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        Bem-vindo ao Gerenciador de Receitas
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Seu sistema pessoal de coleção e gerenciamento de receitas
      </p>

      <div v-if="isAuthenticated" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link
            to="/recipes"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              Minhas Receitas
            </h2>
            <p class="text-gray-600">
              Visualize, crie, edite e gerencie sua coleção de receitas
            </p>
          </router-link>

          <router-link
            to="/categories"
            class="card p-6 hover:shadow-lg transition-shadow"
          >
            <h2 class="text-2xl font-semibold text-gray-900 mb-2">
              Categorias
            </h2>
            <p class="text-gray-600">
              Organize suas receitas com categorias personalizadas
            </p>
          </router-link>
        </div>

        <div class="text-center">
          <router-link to="/recipes/new" class="btn btn-primary">
            Criar Nova Receita
          </router-link>
        </div>
      </div>

      <div v-else class="space-y-6">
        <p class="text-gray-600">
          Por favor, faça login ou cadastre-se para começar a gerenciar suas receitas
        </p>
        <div class="flex justify-center space-x-4">
          <router-link to="/login" class="btn btn-primary">
            Entrar
          </router-link>
          <router-link to="/register" class="btn btn-secondary">
            Cadastrar
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script> 