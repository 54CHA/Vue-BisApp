<script setup>
import { ref, onMounted, computed } from "vue";
import { useBankStore } from "stores/bankStore";
import { useQuasar } from "quasar";

const $q = useQuasar();
const store = useBankStore();

const transactionDates = computed(() => {
  const dates = store.transactions.map(
    (t) => new Date(t.date).toISOString().split("T")[0]
  );
  return [...new Set(dates)].sort().reverse();
});

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate.toLocaleDateString("ru-RU", options);
};

const getTransactionsForDate = (date) => {
  return store.transactions.filter(
    (t) => new Date(t.date).toISOString().split("T")[0] === date
  );
};

const selectedDate = ref(null);

const selectDate = (date) => {
  selectedDate.value = date;
};

const editTransactionDialog = ref(false);
const editedTransaction = ref({
  id: null,
  fromAcct: "",
  toAcct: "",
  amount: 0,
});

const accountOptions = computed(() => {
  return store.Acct.map((account) => ({
    label: account.AcctNum,
    value: account.AcctNum,
  }));
});

const openEditTransactionDialog = (transaction) => {
  editedTransaction.value = { ...transaction };
  editTransactionDialog.value = true;
};

const editTransaction = () => {
  try {
    if (
      !editedTransaction.value.fromAcct ||
      !editedTransaction.value.toAcct ||
      !editedTransaction.value.amount
    ) {
      throw new Error("Please fill in all fields");
    }
    store.editTransaction(editedTransaction.value);
    editTransactionDialog.value = false;
    $q.notify({
      color: "positive",
      message: "Операция успешно обновлена",
      icon: "check",
    });
  } catch (error) {
    console.error("Ошибка обновления операции:", error);
    $q.notify({
      color: "negative",
      message: error.message || "Ошибка обновления операции",
      icon: "report_problem",
    });
  }
};

const deleteTransaction = (id) => {
  try {
    store.deleteTransaction(id);
    $q.notify({
      color: "negative",
      message: "Операция успешно удалена",
      icon: "check",
    });
  } catch (error) {
    console.error("Ошибка удаления операции:", error);
    $q.notify({
      color: "negative",
      message: "Ошибка удаления операции",
      icon: "report_problem",
    });
  }
};

const newTransaction = ref({
  fromAcct: "",
  toAcct: "",
  amount: 0,
  date: "",
});

const newTransactionDialog = ref(false);

const openNewTransactionDialog = () => {
  newTransaction.value = {
    fromAcct: "",
    toAcct: "",
    amount: 0,
    date: "",
  };
  newTransactionDialog.value = true;
};

const addNewTransaction = () => {
  try {
    if (
      !newTransaction.value.fromAcct ||
      !newTransaction.value.toAcct ||
      !newTransaction.value.amount ||
      !newTransaction.value.date
    ) {
      throw new Error("Please fill in all fields");
    }

    const localDate = new Date(newTransaction.value.date);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    );

    store.addTransaction({
      ...newTransaction.value,
      date: utcDate.toISOString().split("T")[0],
    });

    newTransactionDialog.value = false;
    $q.notify({
      color: "positive",
      message: "Операционный день успешно добавлен",
      icon: "check",
    });

    newTransaction.value = {
      fromAcct: "",
      toAcct: "",
      amount: 0,
      date: "",
    };
  } catch (error) {
    console.error("Ошибка добавления операцииого дня:", error);
    $q.notify({
      color: "negative",
      message: error.message || "Ошибка добавления операцииого дня",
      icon: "report_problem",
    });
  }
};

const confirmDeleteDay = (date) => {
  $q.dialog({
    title: "Подтвердите удаление",
    message: `Вы уверены, что хотите удалить все транзакции за ${formatDate(
      date
    )}?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteDay(date);
  });
};

const deleteDay = (date) => {
  store.deleteTransactionsByDate(date);
  $q.notify({
    color: "negative",
    message: `Все транзакции за ${formatDate(date)} успешно удалены`,
    icon: "delete",
  });
};

onMounted(async () => {
  if (store.transactions.length === 0) {
    await store.fetchTransactions();
  }

  if (transactionDates.value.length > 0) {
    selectDate(transactionDates.value[0]);
  }
});

const formatAmount = (amount) => {
  return Number(amount).toFixed(2);
};

const confirmDeleteTransaction = (id) => {
  $q.dialog({
    title: "Подтвердите удаление",
    message: "Вы уверены, что хотите удалить эту транзакцию?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteTransaction(id);
  });
};
</script>

<template>
  <main class="flex justify-center" style="gap: 1rem">
    <div style="width: 49%">
      <div class="Inline Flex row items-baseline justify-between">
        <h5>Операционные дни</h5>
        <q-btn
          color="primary"
          icon="add"
          label="Добавить операционный день"
          @click="openNewTransactionDialog"
          class="q-ml-md"
        />
      </div>
      <q-list>
        <q-item
          v-for="date in transactionDates"
          :key="date"
          clickable
          v-ripple
          @click="selectDate(date)"
          :class="{ 'selected-date': selectedDate === date }"
          class="text-h7"
          style="font-size: 14px; color: #757575"
        >
          <q-item-section>
            {{ formatDate(date) }}
          </q-item-section>
          <q-item-section side>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              class="custom-icon-btn"
              @click.stop="confirmDeleteDay(date)"
            >
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div style="width: 49%">
      <div class="Inline Flex row items-baseline justify-between">
        <h5 style="margin-left: 1rem">
          Операции на {{ selectedDate ? formatDate(selectedDate) : "" }}
        </h5>
        <q-btn
          color="primary"
          icon="add"
          label="Добавить операцию"
          @click="openNewTransactionDialog"
          class="q-ml-md"
        />
      </div>
      <div v-if="selectedDate">
        <q-list>
          <q-item
            v-for="transaction in getTransactionsForDate(selectedDate)"
            :key="transaction.id"
            class="q-mb-sm"
          >
            <q-item-section>
              <q-item-label class="text-subtitle2">
                От: {{ transaction.fromAcct }}
              </q-item-label>
              <q-item-label class="text-subtitle2">
                Кому: {{ transaction.toAcct }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div class="text-h6" style="font-size: 14px">
                {{ formatAmount(transaction.amount) }} р.
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="">
                <q-btn
                  flat
                  round
                  color="primary"
                  icon="edit"
                  class="custom-icon-btn"
                  @click="openEditTransactionDialog(transaction)"
                >
                </q-btn>
                <q-btn
                  flat
                  round
                  color="negative"
                  icon="delete"
                  class="custom-icon-btn"
                  @click.stop="confirmDeleteTransaction(transaction.id)"
                >
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>

    <q-dialog v-model="editTransactionDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Изменить операцию</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="editTransaction" class="q-gutter-md">
            <q-select
              filled
              v-model="editedTransaction.fromAcct"
              :options="accountOptions"
              label="Дебетовый счет"
              emit-value
              map-options
            />
            <q-select
              filled
              v-model="editedTransaction.toAcct"
              :options="accountOptions"
              label="Кредитовый счет"
              emit-value
              map-options
            />
            <q-input
              filled
              type="number"
              v-model.number="editedTransaction.amount"
              label="Сумма"
            />
            <div>
              <q-btn label="Изменить операцию" type="submit" color="primary" />
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

    <q-dialog v-model="newTransactionDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Добавить операцию</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="addNewTransaction" class="q-gutter-md">
            <q-select
              filled
              v-model="newTransaction.fromAcct"
              :options="accountOptions"
              label="Дебетовый счет"
              emit-value
              map-options
            />
            <q-select
              filled
              v-model="newTransaction.toAcct"
              :options="accountOptions"
              label="Кредитовый счет"
              emit-value
              map-options
            />
            <q-input
              filled
              type="number"
              v-model.number="newTransaction.amount"
              label="Сумма"
            />
            <q-input
              filled
              v-model="newTransaction.date"
              mask="date"
              :rules="['date']"
              label="Дата операции"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="newTransaction.date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Закрыть"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div>
              <q-btn label="Добавить операцию" type="submit" color="primary" />
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
  </main>
</template>

<style scoped>
.custom-icon-btn {
  font-size: 18px;
}

.q-item {
  transition: background-color 0.3s;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-bottom: 4px;
}

.q-item:hover {
  background-color: #f0f0f0;
}

.selected-date {
  background-color: #e0e0e0;
}
</style>
