<template>
  <q-layout view="hHh LpR fFf">
    <div class="navbar">
    <q-header reveal class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          Тестовое задание
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/Accounts" label="Счета" />
        <q-route-tab to="/OperationDays" label="Операционннные дни" />
        <q-route-tab to="/Operations" label="Операции" />
      </q-tabs>
    </q-header>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>


<script setup>
import { ref } from 'vue'


</script>
