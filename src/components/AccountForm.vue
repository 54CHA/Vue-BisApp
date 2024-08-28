<template>
  <div class="q-pa-md flex row items-center" style="max-width: 400px">
    <q-btn
      color="primary"
      icon="add"
      label="Добавить счет"
      @click="openNewAccountDialog"
    />

    <q-dialog v-model="newAccountDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Новый счет</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              filled
              v-model="newAcct"
              label="Наименование счета"
              :rules="[val => !!val || 'Поле обязательно для заполнения']"
            />
            <q-input
              filled
              type="number"
              v-model="newBalance"
              label="Баланс"
              :rules="[val => !!val || 'Поле обязательно для заполнения']"
            />
            <div>
              <q-btn label="Добавить" type="submit" color="primary" />
              <q-btn
                label="Закрыть"
                v-close-popup
                color="primary"
                flat
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref } from "vue";
import { useBankStore } from "stores/bankStore";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = useBankStore();
    const $q = useQuasar();

    const newAcct = ref("");
    const newBalance = ref("");
    const newAccountDialog = ref(false);

    const openNewAccountDialog = () => {
      newAcct.value = "";
      newBalance.value = "";
      newAccountDialog.value = true;
    };

    const onSubmit = () => {
      if (newAcct.value.length > 0 && newBalance.value.length > 0) {
        store.addAcct({
          AcctNum: newAcct.value,
          balance: Number(newBalance.value),
        });
        $q.notify({
          color: "positive",
          message: `Счет ${newAcct.value} успешно добавлен`,
          icon: "add",
        });
        newAccountDialog.value = false;
        newAcct.value = "";
        newBalance.value = "";
      }
    };

    return {
      onSubmit,
      newAcct,
      newBalance,
      store,
      newAccountDialog,
      openNewAccountDialog,
    };
  },
};
</script>
