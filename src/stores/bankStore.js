import { defineStore } from "pinia";

export const useBankStore = defineStore("bank", {
  state: () => ({
    Acct: [
      {
        id: 1,
        AcctNum: "0323454353948",
        initialBalance: 1000,
        date: "2024-08-25",
      },
      {
        id: 2,
        AcctNum: "9885474575646",
        initialBalance: 9005,
        date: "2024-08-26",
      },
      {
        id: 3,
        AcctNum: "34545346567856",
        initialBalance: 10005,
        date: "2024-08-27",
      },
    ],
    selectedDate: null,
    transactions: [
      {
        id: 1,
        fromAcct: "0323454353948",
        toAcct: "9885474575646",
        amount: 501,
        date: "2024-08-26",
      },
      {
        id: 2,
        fromAcct: "9885474575646",
        toAcct: "34545346567856",
        amount: 1000,
        date: "2024-08-27",
      },
    ],
    selectedAccount: null,
  }),

  getters: {
    filteredAccounts() {
      return this.Acct;
    },
    filteredTransactions() {
      if (!this.selectedDate) {
        return this.transactions;
      }
      return this.transactions.filter(
        (transaction) => transaction.date <= this.selectedDate
      );
    },
    accountBalances() {
      const balances = {};
      this.Acct.forEach((account) => {
        balances[account.AcctNum] = account.initialBalance;
      });

      this.filteredTransactions.forEach((transaction) => {
        if (balances[transaction.fromAcct]) {
          balances[transaction.fromAcct] -= transaction.amount;
        }
        if (balances[transaction.toAcct]) {
          balances[transaction.toAcct] += transaction.amount;
        }
      });

      return balances;
    },
  },

  actions: {
    deleteAcct(id) {
      const accountToDelete = this.Acct.find((acct) => acct.id === id);
      if (accountToDelete) {
        this.transactions = this.transactions.filter(
          (t) =>
            t.fromAcct !== accountToDelete.AcctNum &&
            t.toAcct !== accountToDelete.AcctNum
        );

        this.Acct = this.Acct.filter((t) => t.id !== id);

        if (this.selectedAccount === accountToDelete.AcctNum) {
          this.selectedAccount = null;
        }

        if (this.Acct.length > 0) {
          this.selectedAccount = this.Acct[0].AcctNum;
        }
      }
    },
    addAcct(acct) {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      const formattedDate = today.toISOString().split("T")[0];
      this.Acct.push({
        ...acct,
        initialBalance: Number(acct.balance),
        date: formattedDate,
        id: this.Acct.length + 1,
      });
    },
    updateAcct(id, updatedAcct) {
      const index = this.Acct.findIndex((acct) => acct.id === id);
      if (index !== -1) {
        this.Acct[index] = { ...this.Acct[index], ...updatedAcct };
      }
    },
    updateAcctByNumber(acctNum, updatedAcct) {
      const index = this.Acct.findIndex((acct) => acct.AcctNum === acctNum);
      if (index !== -1) {
        this.Acct[index] = {
          ...this.Acct[index],
          ...updatedAcct,
          balance: updatedAcct.initialBalance,
        };

        const transactions = this.transactions
          .filter((t) => t.fromAcct === acctNum || t.toAcct === acctNum)
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        let balance = updatedAcct.initialBalance;
        for (const transaction of transactions) {
          if (transaction.fromAcct === acctNum) {
            balance -= transaction.amount;
          } else if (transaction.toAcct === acctNum) {
            balance += transaction.amount;
          }
        }

        this.Acct[index].balance = Number(balance.toFixed(2));
      }
    },
    setSelectedDate(date) {
      this.selectedDate = date;
    },
    setSelectedAccount(accountNum) {
      this.selectedAccount = accountNum;
    },
    addTransaction(transaction) {
      const { fromAcct, toAcct, amount, date } = transaction;
      const fromAccount = this.Acct.find((acct) => acct.AcctNum === fromAcct);
      const toAccount = this.Acct.find((acct) => acct.AcctNum === toAcct);

      if (!fromAccount || !toAccount) {
        throw new Error("One or both accounts do not exist");
      }

      if (fromAccount.balance < amount) {
        throw new Error("Insufficient funds in the source account");
      }

      const localDate = new Date(date);
      const transactionDate = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      )
        .toISOString()
        .split("T")[0];

      const newTransaction = {
        ...transaction,
        date: transactionDate,
        id: this.transactions.length + 1,
      };

      fromAccount.balance = Number((fromAccount.balance - amount).toFixed(2));

      toAccount.balance = Number(
        (toAccount.balance + Number(amount)).toFixed(2)
      );

      this.transactions.push(newTransaction);

      if (new Date(transactionDate) > new Date(fromAccount.date)) {
        fromAccount.date = transactionDate;
      }
      if (new Date(transactionDate) > new Date(toAccount.date)) {
        toAccount.date = transactionDate;
      }
    },
    deleteTransaction(id) {
      const transaction = this.transactions.find((t) => t.id === id);
      if (transaction) {
        this.updateAccountBalance(transaction.fromAcct, transaction.amount);
        this.updateAccountBalance(transaction.toAcct, -transaction.amount);
        this.transactions = this.transactions.filter((t) => t.id !== id);
      }
    },
    updateAccountBalance(acctNum, amount) {
      const account = this.Acct.find((acct) => acct.AcctNum === acctNum);
      if (account) {
        account.balance = Number((account.balance + amount).toFixed(2));
      }
    },
    selectFirstAccount() {
      if (this.Acct.length > 0) {
        this.selectedAccount = this.Acct[0].AcctNum;
      }
    },
    editTransaction(updatedTransaction) {
      const index = this.transactions.findIndex(
        (t) => t.id === updatedTransaction.id
      );
      if (index === -1) {
        throw new Error("Transaction not found");
      }

      const oldTransaction = this.transactions[index];

      this.updateAccountBalance(oldTransaction.fromAcct, oldTransaction.amount);
      this.updateAccountBalance(oldTransaction.toAcct, -oldTransaction.amount);

      const fromAccount = this.Acct.find(
        (acct) => acct.AcctNum === updatedTransaction.fromAcct
      );
      const toAccount = this.Acct.find(
        (acct) => acct.AcctNum === updatedTransaction.toAcct
      );

      if (!fromAccount || !toAccount) {
        throw new Error("One or both accounts do not exist");
      }

      if (fromAccount.balance < updatedTransaction.amount) {
        throw new Error("Insufficient funds in the source account");
      }

      fromAccount.balance = Number(
        (fromAccount.balance - updatedTransaction.amount).toFixed(2)
      );
      toAccount.balance = Number(
        (toAccount.balance + Number(updatedTransaction.amount)).toFixed(2)
      );

      this.transactions[index] = {
        ...oldTransaction,
        ...updatedTransaction,
        date: oldTransaction.date,
      };
    },
    deleteTransactionsByDate(date) {
      const transactionsToDelete = this.transactions.filter(
        (t) => t.date === date
      );

      transactionsToDelete.forEach((transaction) => {
        const fromAccount = this.Acct.find(
          (a) => a.AcctNum === transaction.fromAcct
        );
        const toAccount = this.Acct.find(
          (a) => a.AcctNum === transaction.toAcct
        );

        if (fromAccount) {
          fromAccount.balance += transaction.amount;
        }
        if (toAccount) {
          toAccount.balance -= transaction.amount;
        }
      });

      this.transactions = this.transactions.filter((t) => t.date !== date);
    },

    getAccountBalanceAtDate(accountNum, date) {
      const account = this.Acct.find((acc) => acc.AcctNum === accountNum);
      if (!account) return "N/A";

      let balance = account.initialBalance;

      const sortedTransactions = [...this.transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      for (const transaction of sortedTransactions) {
        const transactionDate = new Date(transaction.date);
        if (transactionDate > date) break;

        if (transaction.fromAcct === accountNum) {
          balance -= transaction.amount;
        } else if (transaction.toAcct === accountNum) {
          balance += transaction.amount;
        }

        if (
          transactionDate.getTime() === date.getTime() &&
          (transaction.fromAcct === accountNum ||
            transaction.toAcct === accountNum)
        ) {
          break;
        }
      }

      return balance.toFixed(2);
    },
  },
});
