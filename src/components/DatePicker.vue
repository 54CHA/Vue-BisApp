<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input
      filled
      v-model="date"
      mask="date"
      :rules="['date']"
      @update:model-value="updateDate"
    >
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="date" @update:model-value="updateDate">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Закрыть" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useBankStore } from "stores/bankStore";

export default {
  setup() {
    const store = useBankStore();
    const date = ref(null);

    const updateDate = (newDate) => {
      if (newDate) {
        const localDate = new Date(newDate);
        localDate.setHours(12, 0, 0, 0);
        const formattedDate = localDate.toISOString().split("T")[0];
        store.setSelectedDate(formattedDate);
      } else {
        store.setSelectedDate(null);
      }
    };

    onMounted(() => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const formattedToday = today.toISOString().split("T")[0];
      date.value = formattedToday;
      updateDate(formattedToday);
    });

    return { store, date, updateDate };
  },
};
</script>
