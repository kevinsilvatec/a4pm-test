<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nome</label>
            <input
              id="name"
              v-model="form.nome"
              name="name"
              type="text"
              required
              class="input rounded-t-md"
              placeholder="Nome"
            />
          </div>
          <div>
            <label for="login" class="sr-only">Login</label>
            <input
              id="login"
              v-model="form.login"
              name="login"
              type="text"
              required
              class="input"
              placeholder="Login"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              v-model="form.senha"
              name="password"
              type="password"
              required
              class="input rounded-b-md"
              placeholder="Senha"
            />
          </div>
        </div>

        <div v-if="error" class="error-message text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/login" class="text-blue-600 hover:text-blue-500">
            Já tem uma conta? Entre
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  nome: '',
  login: '',
  senha: ''
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.register({
      nome: form.nome,
      login: form.login,
      senha: form.senha
    });
    router.push('/recipes');
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Falha ao criar conta';
  } finally {
    loading.value = false;
  }
};
</script> 