<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entre na sua conta
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="login" class="sr-only">Login</label>
            <input
              id="login"
              v-model="form.login"
              name="login"
              type="text"
              required
              class="input rounded-t-md"
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
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>

        <div class="text-center">
          <router-link to="/register" class="text-blue-600 hover:text-blue-500">
            Não tem uma conta? Cadastre-se
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
  login: '',
  senha: ''
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authStore.login(form.login, form.senha);
    router.push('/recipes');
  } catch (e: any) {
    error.value = e.response?.data?.error || 'Falha ao entrar';
  } finally {
    loading.value = false;
  }
};
</script> 