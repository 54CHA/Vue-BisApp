<template>
  <q-card-section>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <q-input filled v-model="upAcct" label="Наименование счета" readonly />
      <q-input
        filled
        type="number"
        v-model="upInitialBalance"
        label="Начальный баланс"
      />
      <div>
        <q-btn label="Обновить" type="submit" color="primary" />
        <q-btn
          label="Закрыть"
          @click="$emit('close')"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-card-section>
</template>

<script>
import { useBankStore } from "stores/bankStore";
import { ref } from "vue";
import { useQuasar } from "quasar";

export default {
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const store = useBankStore();
    const $q = useQuasar();

    const upAcct = ref(props.account.AcctNum);
    const upInitialBalance = ref(props.account.initialBalance);

    const onSubmit = () => {
      store.updateAcctByNumber(upAcct.value, {
        initialBalance: Number(upInitialBalance.value),
      });
      emit("close");
      $q.notify({
        color: "positive",
        message: `Счет ${upAcct.value} успешно обновлен`,
        icon: "update",
      });
    };

    return {
      onSubmit,
      upAcct,
      upInitialBalance,
      store,
    };
  },
};
</script>
