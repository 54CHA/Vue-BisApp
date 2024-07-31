<script setup></script>

<template>
<div class="flex">
    <div style="width: 49%;">
        <div class="Inline Flex row items-baseline justify-center" style=" margin-right: 3rem; margin-left: 3rem">
            <h5>Список операций

            </h5>
          <p v-for="n in 20" :key="n">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae labore recusandae placeat tempora earum. Veniam qui aspernatur voluptates fugit ea sint, error voluptate eum vero earum, dolorum numquam nulla harum!</p>
          </div>
        </div>
       
     
      <div style="width: 49%;">
          <div class="Inline Flex row items-baseline justify-center">
            <h5>Список проводок
            </h5>
            <p v-for="n in 20" :key="n">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quae labore recusandae placeat tempora earum. Veniam qui aspernatur voluptates fugit ea sint, error voluptate eum vero earum, dolorum numquam nulla harum!</p>
          </div>
        </div>
      </div>
      </template>

<style scoped></style>
